/* ═══════════════════════════════════════════════════════════════
   CONCLU ! — Le Jeu du SAV · js/engine.js
   Moteur de jeu (visual novel façon Ace Attorney).
   Lit window.GAME_DATA (fourni par js/scenarios.js).
   Sauvegarde : localStorage, clé "conclu_save".
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ════════════ 0. CONSTANTES & CATALOGUE ════════════ */

  var SAVE_KEY = "conclu_save";
  var CRT_KEY = "conclu_crt";
  var TYPE_SPEED = 22;          // ms par caractère
  var AUTO_NEXT_DELAY = 1700;   // délai d'enchaînement auto des nœuds "next"
  var SELL_PENALTY = 25;        // agacement en cas de refus de vente

  /* Niveaux RPG : XP cumulé requis */
  var LEVELS = [
    { name: "Commercial Stagiaire",    xp: 0 },
    { name: "Téléconseiller",          xp: 200 },
    { name: "Conseiller Confirmé",     xp: 500 },
    { name: "Expert SAV",              xp: 900 },
    { name: "Chef de Plateau",         xp: 1400 },
    { name: "Légende du Standard",     xp: 2000 }
  ];

  /* Déblocables : 4 catégories × 3 items. minLevel = index (1-based) du niveau requis */
  var UNLOCKABLES = {
    ring: {
      label: "🎵 Sonneries",
      items: [
        { id: "ring_classic", name: "Bip Central",  icon: "☎️", minLevel: 1 },
        { id: "ring_digital", name: "Digital 90s",  icon: "📟", minLevel: 2 },
        { id: "ring_retro",   name: "Mélodie Rétro",icon: "📱", minLevel: 4 }
      ]
    },
    bg: {
      label: "🖼 Décors de bureau",
      items: [
        { id: "bg_office", name: "Open Space",   icon: "🏢", minLevel: 1 },
        { id: "bg_sunset", name: "Heure Dorée",  icon: "🌇", minLevel: 3 },
        { id: "bg_night",  name: "Shift de Nuit",icon: "🌙", minLevel: 5 }
      ]
    },
    frame: {
      label: "🖼 Cadres de portrait",
      items: [
        { id: "frame_basic", name: "Cadre Standard", icon: "⬛", minLevel: 1 },
        { id: "frame_gold",  name: "Cadre Doré",     icon: "🟨", minLevel: 3 },
        { id: "frame_neon",  name: "Cadre Néon",     icon: "🟩", minLevel: 6 }
      ]
    },
    accent: {
      label: "👔 Cravates (accent)",
      items: [
        { id: "accent_gold", name: "Cravate Dorée",  icon: "🟡", minLevel: 1 },
        { id: "accent_red",  name: "Cravate Rouge",  icon: "🔴", minLevel: 2 },
        { id: "accent_mint", name: "Cravate Menthe", icon: "🟢", minLevel: 5 }
      ]
    }
  };

  var SPEAKER_NAMES = { client: null, gilbert: "Gilbert (vous)", narrator: "Standard" };

  /* ════════════ 1. ÉTAT ════════════ */

  var save = null;          // sauvegarde chargée
  var dayIndex = 0;         // jour en cours (0-based)
  var day = null;           // données du jour en cours
  var currentNodeId = null; // nœud affiché
  var stats = { confiance: 0, interet: 0, agacement: 0 };
  var clues = {};           // indices collectés pendant l'appel
  var exchanges = 0;        // nb d'échanges (active le bouton de vente)
  var typeTimer = null;     // timer du typewriter
  var typeDone = true;      // texte entièrement affiché ?
  var fullText = "";        // texte complet du nœud courant
  var autoNextTimer = null; // timer d'enchaînement auto
  var gameOver = false;     // appel terminé ?
  var toastTimer = null;

  /* ════════════ 2. RACCOURCIS DOM ════════════ */

  function $(id) { return document.getElementById(id); }
  var els = {};
  [
    "screen-title", "screen-briefing", "screen-call", "screen-wardrobe", "screen-credits",
    "btn-new-game", "btn-continue", "btn-wardrobe", "btn-credits", "btn-mute", "title-level",
    "briefing-day-title", "briefing-stars", "briefing-text", "objective-name", "objective-desc",
    "objective-price", "briefing-portrait", "briefing-emoji", "briefing-client-name",
    "briefing-client-subtitle", "btn-answer", "btn-briefing-back",
    "call-portrait", "call-emoji", "call-client-name", "call-client-subtitle",
    "stat-confiance", "stat-interet", "stat-agacement", "deco-gilbert",
    "btn-notebook", "btn-sell", "notebook-count",
    "dialogue-box", "dialogue-speaker", "dialogue-text", "dialogue-next-hint", "choices-container",
    "panel-notebook", "notebook-list", "notebook-empty", "btn-notebook-close", "notebook-backdrop",
    "wardrobe-categories", "wardrobe-level", "btn-wardrobe-back", "btn-reset-save",
    "btn-credits-back", "toggle-crt",
    "overlay-ending", "ending-flash", "ending-stamp", "ending-lost", "confetti-container",
    "ending-result", "ending-result-title", "ending-result-sub", "ending-xp", "ending-xp-value",
    "ending-level-name", "xp-fill", "ending-unlocks",
    "btn-next-day", "btn-replay", "btn-ending-menu", "toast"
  ].forEach(function (id) { els[id] = $(id); });

  /* ════════════ 3. SAUVEGARDE ════════════ */

  function defaultSave() {
    return {
      maxDay: 1,              // dernier jour débloqué (1-based)
      currentDay: 1,          // jour à jouer via CONTINUER
      xp: 0,
      wins: 0,
      losses: 0,
      equipped: { ring: "ring_classic", bg: "bg_office", frame: "frame_basic", accent: "accent_gold" }
    };
  }

  function loadSave() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        var d = defaultSave();
        // fusion défensive (tolère les anciennes versions)
        for (var k in d) { if (!(k in s)) { s[k] = d[k]; } }
        for (var e in d.equipped) { if (!(e in s.equipped)) { s.equipped[e] = d.equipped[e]; } }
        return s;
      }
    } catch (e) { /* localStorage indisponible ou corrompu */ }
    return defaultSave();
  }

  function persistSave() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* mode privé */ }
  }

  function hasSave() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
  }

  /* Niveau courant (1-based) + progression vers le suivant */
  function levelInfo(xp) {
    var lvl = 1, next = null;
    for (var i = 0; i < LEVELS.length; i++) {
      if (xp >= LEVELS[i].xp) { lvl = i + 1; }
    }
    next = (lvl < LEVELS.length) ? LEVELS[lvl].xp : null;
    var base = LEVELS[lvl - 1].xp;
    return { level: lvl, name: LEVELS[lvl - 1].name, next: next, base: base };
  }

  /* ════════════ 4. NAVIGATION ENTRE ÉCRANS ════════════ */

  function showScreen(id) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) { screens[i].classList.remove("active"); }
    els[id].classList.add("active");
  }

  function showToast(msg, duration) {
    els["toast"].textContent = msg;
    els["toast"].classList.remove("hidden");
    if (toastTimer) { clearTimeout(toastTimer); }
    toastTimer = setTimeout(function () { els["toast"].classList.add("hidden"); }, duration || 2600);
  }

  /* ════════════ 5. ÉQUIPEMENT (applique réellement au jeu) ════════════ */

  function applyEquipment() {
    var eq = save.equipped;
    var b = document.body;
    // décor de bureau
    b.classList.remove("bg-office", "bg-sunset", "bg-night");
    b.classList.add(eq.bg);
    // cravate = couleur d'accent (variable CSS --accent via classe body)
    b.classList.remove("accent-gold", "accent-red", "accent-mint");
    b.classList.add(eq.accent);
    // cadre de portrait
    ["briefing-portrait", "call-portrait"].forEach(function (id) {
      els[id].classList.remove("frame-basic", "frame-gold", "frame-neon");
      els[id].classList.add(eq.frame);
    });
  }

  /* ════════════ 6. ÉCRAN TITRE ════════════ */

  function refreshTitle() {
    var info = levelInfo(save.xp);
    els["title-level"].textContent =
      info.name + " · " + save.xp + " XP · ✅" + save.wins + " ❌" + save.losses;
    els["btn-continue"].classList.toggle("hidden", !hasSave());
  }

  /* ════════════ 7. BRIEFING ════════════ */

  function showBriefing(idx) {
    if (!window.GAME_DATA || !GAME_DATA.days || !GAME_DATA.days.length) {
      showToast("⚠ Données de scénario introuvables (js/scenarios.js).");
      return;
    }
    dayIndex = Math.max(0, Math.min(idx, GAME_DATA.days.length - 1));
    day = GAME_DATA.days[dayIndex];

    // Fix : ne pas doubler le préfixe si le titre commence déjà par « Jour »
    var title = String(day.title || "");
    els["briefing-day-title"].textContent = /^\s*jour/i.test(title) ? title : "JOUR " + (dayIndex + 1) + " — " + title;
    var stars = "";
    for (var i = 1; i <= 5; i++) { stars += (i <= day.difficulty) ? "★" : "☆"; }
    els["briefing-stars"].textContent = stars;
    els["briefing-text"].textContent = day.briefing;
    els["objective-name"].textContent = day.objective.name;
    els["objective-desc"].textContent = day.objective.description;
    els["objective-price"].textContent = "Prix : " + day.objective.price;
    els["briefing-emoji"].textContent = day.client.emoji;
    els["briefing-client-name"].textContent = day.client.name;
    els["briefing-client-subtitle"].textContent = day.client.subtitle;

    applyEquipment();
    // Fix : réinitialise le carnet d'indices au démarrage de chaque jour
    clues = {};
    updateNotebook();
    closeNotebook();
    showScreen("screen-briefing");
    // sonnerie jusqu'au décrochage (équipée via le vestiaire)
    SAVAudio.startRing(save.equipped.ring);
  }

  /* ════════════ 8. DÉMARRAGE D'UN APPEL ════════════ */

  function startCall() {
    SAVAudio.stopRing();
    stats = {
      confiance: clampStat(day.startConfiance || 0),
      interet: clampStat(day.startInteret || 0),
      agacement: clampStat(day.startAgacement || 0)
    };
    clues = {};
    exchanges = 0;
    gameOver = false;
    currentNodeId = null;

    els["call-emoji"].textContent = day.client.emoji;
    els["call-client-name"].textContent = day.client.name;
    els["call-client-subtitle"].textContent = day.client.subtitle;
    els["notebook-count"].classList.add("hidden");
    els["btn-sell"].classList.add("hidden");
    closeNotebook();
    updateNotebook();

    renderAllStats(true);
    showScreen("screen-call");
    renderNode(day.start);
  }

  function clampStat(v) { return Math.max(0, Math.min(100, Math.round(v))); }

  /* ════════════ 9. BARRES DE STATS (animées) ════════════ */

  function renderStat(key, instant, delta) {
    var row = els["stat-" + key];
    var fill = row.querySelector(".stat-fill");
    var value = row.querySelector(".stat-value");
    var flash = row.querySelector(".stat-flash");
    fill.style.width = stats[key] + "%";
    value.textContent = stats[key];
    if (instant) { return; }
    // animation de variation
    row.classList.remove("pulse");
    void row.offsetWidth; // force le reflow pour rejouer l'animation
    row.classList.add("pulse");
    if (delta && delta !== 0) {
      flash.textContent = (delta > 0 ? "+" : "") + delta;
      flash.classList.remove("show-up", "show-down");
      void flash.offsetWidth;
      flash.classList.add(delta > 0 ? "show-up" : "show-down");
    }
  }

  function renderAllStats(instant) {
    renderStat("confiance", instant);
    renderStat("interet", instant);
    renderStat("agacement", instant);
  }

  /* Applique les effets d'un choix, avec animations + réactions de Gilbert */
  function applyEffects(effects) {
    if (!effects) { return; }
    ["confiance", "interet", "agacement"].forEach(function (key) {
      var d = effects[key] || 0;
      if (d === 0) { return; }
      var before = stats[key];
      stats[key] = clampStat(before + d);
      renderStat(key, false, stats[key] - before);
    });
    var gil = els["deco-gilbert"];
    gil.classList.remove("gilbert-happy", "gilbert-shock");
    void gil.offsetWidth;
    if ((effects.confiance || 0) > 0) { gil.classList.add("gilbert-happy"); }
    if ((effects.agacement || 0) > 0) { gil.classList.add("gilbert-shock"); }
  }

  /* ════════════ 10. DIALOGUE : TYPEWRITER & NŒUDS ════════════ */

  function stopTypewriter() { if (typeTimer) { clearInterval(typeTimer); typeTimer = null; } }
  function stopAutoNext() { if (autoNextTimer) { clearTimeout(autoNextTimer); autoNextTimer = null; } }

  function renderNode(nodeId) {
    if (gameOver) { return; }
    var node = day.nodes[nodeId];
    if (!node) {
      console.error("Nœud introuvable :", nodeId);
      showToast("⚠ Erreur de scénario : nœud « " + nodeId + " » manquant.");
      return;
    }
    currentNodeId = nodeId;
    stopAutoNext();
    els["choices-container"].innerHTML = "";
    els["dialogue-next-hint"].classList.add("hidden");

    // indice collecté automatiquement à l'affichage du nœud
    if (node.clue && !clues[node.clue.id]) {
      clues[node.clue.id] = node.clue;
      SAVAudio.clue();
      updateNotebook();
      showToast("📓 Indice collecté : " + node.clue.title);
    }

    // locuteur (couleur selon speaker)
    var spk = els["dialogue-speaker"];
    spk.className = "speaker-" + (node.speaker || "narrator");
    spk.textContent = (node.speaker === "client") ? day.client.name
      : (node.speaker === "gilbert") ? SPEAKER_NAMES.gilbert
      : SPEAKER_NAMES.narrator;

    typewrite(node.text, node.speaker, function () { onNodeComplete(node); });
  }

  /* Appelé quand le texte d'un nœud est entièrement affiché */
  function onNodeComplete(node) {
    if (gameOver) { return; }
    if (node.choices && node.choices.length) {
      showChoices(node);
    } else if (node.next) {
      // enchaînement auto avec délai (ou tap pour avancer tout de suite)
      els["dialogue-next-hint"].classList.remove("hidden");
      stopAutoNext();
      autoNextTimer = setTimeout(function () { renderNode(node.next); }, AUTO_NEXT_DELAY);
    } else {
      // nœud TERMINAL (ni next ni choices) : fin d'appel naturelle,
      // on évalue immédiatement les seuils de victoire
      stopAutoNext();
      autoNextTimer = setTimeout(endCallNaturally, 900);
    }
  }

  /* Fin d'appel naturelle : victoire si les seuils sont atteints, sinon défaite */
  function endCallNaturally() {
    if (gameOver) { return; }
    if (checkWin()) { victory(); }
    else { defeat("Le client raccroche… sans rien signer. Les seuils n'étaient pas atteints."); }
  }

  /* Conditions de victoire (contrat winThresholds) */
  function checkWin() {
    var t = day.winThresholds;
    return stats.confiance >= t.confiance
      && stats.interet >= t.interet
      && stats.agacement < t.maxAgacement;
  }

  function typewrite(text, speaker, onDone) {
    stopTypewriter();
    fullText = text;
    typeDone = false;
    var i = 0;
    els["dialogue-text"].textContent = "";
    typeTimer = setInterval(function () {
      i++;
      els["dialogue-text"].textContent = text.slice(0, i);
      if (i % 2 === 0) { SAVAudio.blip(speaker); }
      if (i >= text.length) {
        stopTypewriter();
        typeDone = true;
        if (onDone) { onDone(); }
      }
    }, TYPE_SPEED);
  }

  /* Tap sur la boîte de dialogue : skip du typewriter ou avance manuelle */
  function onDialogueTap() {
    if (gameOver) { return; } // l'overlay de fin est affiché : on n'avance plus
    SAVAudio.ensureCtx();
    if (!typeDone) {
      // termine instantanément le texte
      stopTypewriter();
      els["dialogue-text"].textContent = fullText;
      typeDone = true;
      // relance la logique de fin de nœud (choix / next auto / fin d'appel)
      var node = day.nodes[currentNodeId];
      if (node) { onNodeComplete(node); }
      return;
    }
    // texte terminé : avance si nœud "next"
    var node = day.nodes[currentNodeId];
    if (node && node.next && (!node.choices || !node.choices.length)) {
      stopAutoNext();
      SAVAudio.click();
      renderNode(node.next);
    }
  }

  /* ════════════ 11. CHOIX ════════════ */

  function showChoices(node) {
    if (gameOver) { return; }
    var container = els["choices-container"];
    container.innerHTML = "";
    node.choices.forEach(function (choice, idx) {
      var btn = document.createElement("button");
      btn.className = "btn-pixel choice-btn";
      var locked = choice.requiresClue && !clues[choice.requiresClue];
      var key = document.createElement("span");
      key.className = "choice-key";
      key.textContent = (idx + 1);
      btn.appendChild(key);
      btn.appendChild(document.createTextNode((locked ? "🔒 " : "") + choice.text));
      if (locked) { btn.classList.add("locked"); }
      btn.addEventListener("click", function () { onChoice(choice, locked); });
      container.appendChild(btn);
    });
  }

  function onChoice(choice, locked) {
    SAVAudio.ensureCtx();
    if (locked) {
      SAVAudio.error();
      showToast("🔒 " + (choice.lockedText || "Il vous manque un indice pour dire ça…"));
      return;
    }
    SAVAudio.confirm();
    exchanges++;
    maybeShowSellButton();
    applyEffects(choice.effects);
    els["choices-container"].innerHTML = "";

    // raccrochage immédiat du client
    if (choice.hangup) { defeat("Le client a raccroché."); return; }
    // agacement maximal atteint
    if (stats.agacement >= 100) { defeat("Le client explose et raccroche !"); return; }

    if (choice.next) {
      // petit délai pour laisser voir l'animation des stats
      setTimeout(function () { renderNode(choice.next); }, 650);
    }
  }

  function maybeShowSellButton() {
    if (exchanges >= 1) { els["btn-sell"].classList.remove("hidden"); }
  }

  /* ════════════ 12. PROPOSITION DE VENTE ════════════ */

  function trySell() {
    if (gameOver) { return; }
    SAVAudio.ensureCtx();
    if (checkWin()) { victory(); return; }

    // refus sec : agacement +25, retour au dialogue (ou défaite à 100)
    SAVAudio.error();
    var before = stats.agacement;
    stats.agacement = clampStat(before + SELL_PENALTY);
    renderStat("agacement", false, stats.agacement - before);
    els["choices-container"].innerHTML = "";

    if (stats.agacement >= 100) {
      defeat("Trop insistant : le client raccroche, furieux.");
      return;
    }
    // le client refuse, on retourne au nœud courant
    typewrite("« Non merci, ça ne m'intéresse pas. » — Le client refuse sèchement. Trouvez un meilleur angle…", "client", function () {
      var node = day.nodes[currentNodeId];
      if (node && node.choices) { showChoices(node); }
    });
  }

  /* ════════════ 13. VICTOIRE / DÉFAITE ════════════ */

  var overlayShownAt = 0;   // anti click-through : timestamp d'affichage de l'overlay
  var resultShownAt = 0;    // idem pour l'écran de résultat
  var ENDING_CLICK_GUARD = 1200; // ms pendant lesquelles tout clic sur l'overlay est ignoré

  function showOverlay() {
    overlayShownAt = Date.now();
    els["overlay-ending"].classList.remove("hidden");
  }

  /* Bloque les clics sur les boutons de fin pendant ~1,2 s après l'affichage :
     empêche le clic déclencheur (vente / dernier choix) ou un double-tap de
     skipper l'animation ou l'écran de résultat. */
  function endingClickGuard(ev) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    if (Date.now() - resultShownAt < ENDING_CLICK_GUARD) { return false; }
    return true;
  }

  function resetOverlay() {
    var o = els["overlay-ending"];
    o.classList.add("hidden");
    o.classList.remove("dark", "shake");
    els["ending-stamp"].classList.add("hidden");
    els["ending-stamp"].classList.remove("slam");
    els["ending-lost"].classList.add("hidden");
    els["ending-lost"].innerHTML = "";
    els["ending-result"].classList.add("hidden");
    els["ending-xp"].classList.add("hidden");
    els["confetti-container"].innerHTML = "";
  }

  function victory() {
    gameOver = true;
    stopTypewriter(); stopAutoNext();
    els["choices-container"].innerHTML = "";
    var o = els["overlay-ending"];
    resetOverlay();
    showOverlay();

    // séquence façon Phoenix Wright : flash → tremblement → tampon → confettis → jingle
    els["ending-flash"].classList.remove("zap");
    void els["ending-flash"].offsetWidth;
    els["ending-flash"].classList.add("zap");
    o.classList.add("shake");
    SAVAudio.victory();
    setTimeout(function () {
      els["ending-stamp"].classList.remove("hidden");
      els["ending-stamp"].classList.add("slam");
      spawnConfetti();
    }, 350);
    setTimeout(function () { showVictoryResult(); }, 2200);
  }

  function spawnConfetti() {
    var colors = ["#c1121f", "#dda448", "#4c9a2a", "#3d7ea6", "#f2e8cf"];
    var container = els["confetti-container"];
    for (var i = 0; i < 60; i++) {
      var c = document.createElement("div");
      c.className = "confetti";
      c.style.left = (Math.random() * 100) + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = (1.6 + Math.random() * 1.6) + "s";
      c.style.animationDelay = (Math.random() * 0.6) + "s";
      container.appendChild(c);
    }
    setTimeout(function () { container.innerHTML = ""; }, 4200);
  }

  function showVictoryResult() {
    resultShownAt = Date.now();
    var gained = 100 * (day.difficulty || 1);
    var beforeLevel = levelInfo(save.xp).level;
    save.xp += gained;
    save.wins++;
    // déblocage du jour suivant
    if (dayIndex + 1 < GAME_DATA.days.length) {
      save.maxDay = Math.max(save.maxDay, dayIndex + 2);
      save.currentDay = dayIndex + 2;
    } else {
      save.currentDay = Math.min(save.maxDay, GAME_DATA.days.length);
    }
    var afterInfo = levelInfo(save.xp);
    var newUnlocks = unlocksBetween(beforeLevel, afterInfo.level);
    persistSave();

    els["ending-result-title"].textContent = "VENTE CONCLUE !";
    els["ending-result-sub"].textContent =
      day.client.name + " a signé pour " + day.objective.name + " (" + day.objective.price + ").";
    els["ending-xp"].classList.remove("hidden");
    els["ending-xp-value"].textContent = "+" + gained + " XP";
    els["ending-level-name"].textContent = afterInfo.name + " (niv. " + afterInfo.level + ")";
    // barre de progression vers le niveau suivant
    var pct = 100;
    if (afterInfo.next !== null) {
      pct = Math.round(((save.xp - afterInfo.base) / (afterInfo.next - afterInfo.base)) * 100);
    }
    els["xp-fill"].style.width = "0%";
    setTimeout(function () { els["xp-fill"].style.width = pct + "%"; }, 60);
    els["ending-unlocks"].textContent = newUnlocks.length
      ? "🎁 Débloqué : " + newUnlocks.join(" · ")
      : "";

    els["btn-next-day"].classList.toggle("hidden", dayIndex + 1 >= GAME_DATA.days.length);
    els["btn-replay"].textContent = "🔁 REJOUER";
    els["ending-result"].classList.remove("hidden");
  }

  /* Déblocables franchis entre deux niveaux */
  function unlocksBetween(fromLevel, toLevel) {
    var found = [];
    if (toLevel <= fromLevel) { return found; }
    for (var cat in UNLOCKABLES) {
      UNLOCKABLES[cat].items.forEach(function (it) {
        if (it.minLevel > fromLevel && it.minLevel <= toLevel) { found.push(it.name); }
      });
    }
    return found;
  }

  function defeat(reason) {
    gameOver = true;
    stopTypewriter(); stopAutoNext();
    els["choices-container"].innerHTML = "";
    var o = els["overlay-ending"];
    resetOverlay();
    showOverlay();
    SAVAudio.defeat();
    setTimeout(function () { o.classList.add("dark"); }, 100);

    // « APPEL PERDU… » : lettres grises qui tombent une à une
    var text = "APPEL PERDU…";
    var holder = els["ending-lost"];
    holder.classList.remove("hidden");
    for (var i = 0; i < text.length; i++) {
      (function (ch, idx) {
        setTimeout(function () {
          var span = document.createElement("span");
          span.textContent = ch === " " ? " " : ch;
          span.className = "drop";
          holder.appendChild(span);
        }, 700 + idx * 130);
      })(text[i], i);
    }
    setTimeout(function () { showDefeatResult(reason); }, 700 + text.length * 130 + 800);
  }

  function showDefeatResult(reason) {
    resultShownAt = Date.now();
    save.losses++;
    persistSave();
    els["ending-result-title"].textContent = "APPEL PERDU…";
    els["ending-result-sub"].textContent = reason || "Le client a raccroché.";
    els["btn-next-day"].classList.add("hidden");
    els["btn-replay"].textContent = "🔁 RÉESSAYER";
    els["ending-result"].classList.remove("hidden");
  }

  /* ════════════ 14. CARNET D'INDICES ════════════ */

  function updateNotebook() {
    var list = els["notebook-list"];
    list.innerHTML = "";
    var ids = Object.keys(clues);
    els["notebook-empty"].classList.toggle("hidden", ids.length > 0);
    var badge = els["notebook-count"];
    badge.textContent = ids.length;
    badge.classList.toggle("hidden", ids.length === 0);
    ids.forEach(function (id) {
      var li = document.createElement("li");
      var t = document.createElement("p");
      t.className = "clue-title";
      t.textContent = "🔎 " + clues[id].title;
      var x = document.createElement("p");
      x.className = "clue-text";
      x.textContent = clues[id].text;
      li.appendChild(t);
      li.appendChild(x);
      list.appendChild(li);
    });
  }

  function openNotebook() {
    SAVAudio.click();
    els["panel-notebook"].classList.add("open");
    els["notebook-backdrop"].classList.remove("hidden");
  }

  function closeNotebook() {
    els["panel-notebook"].classList.remove("open");
    els["notebook-backdrop"].classList.add("hidden");
  }

  /* ════════════ 15. VESTIAIRE ════════════ */

  function isUnlocked(item) { return levelInfo(save.xp).level >= item.minLevel; }

  function renderWardrobe() {
    var info = levelInfo(save.xp);
    els["wardrobe-level"].textContent = info.name + " — NIVEAU " + info.level + " (" + save.xp + " XP)";
    var wrap = els["wardrobe-categories"];
    wrap.innerHTML = "";

    for (var cat in UNLOCKABLES) {
      var section = document.createElement("div");
      section.className = "wardrobe-cat";
      var h = document.createElement("h3");
      h.textContent = UNLOCKABLES[cat].label;
      section.appendChild(h);
      var grid = document.createElement("div");
      grid.className = "wardrobe-items";

      UNLOCKABLES[cat].items.forEach(function (item) {
        var unlocked = isUnlocked(item);
        var equipped = save.equipped[cat] === item.id;
        var card = document.createElement("div");
        card.className = "wardrobe-item" + (equipped ? " equipped" : "") + (unlocked ? "" : " locked");

        var icon = document.createElement("span");
        icon.className = "wi-icon";
        icon.textContent = item.icon;
        var name = document.createElement("span");
        name.className = "wi-name";
        name.textContent = item.name;
        var status = document.createElement("span");
        status.className = "wi-status";
        status.textContent = equipped ? "ÉQUIPÉ" : (unlocked ? "DISPONIBLE" : "NIV. " + item.minLevel + " REQUIS");

        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(status);

        if (unlocked && !equipped) {
          var btn = document.createElement("button");
          btn.className = "btn-pixel";
          btn.textContent = "ÉQUIPER";
          btn.addEventListener("click", function () {
            save.equipped[cat] = item.id;
            persistSave();
            applyEquipment();
            SAVAudio.confirm();
            // aperçu immédiat de la sonnerie équipée
            if (cat === "ring") { SAVAudio.startRing(item.id); setTimeout(SAVAudio.stopRing, 1800); }
            renderWardrobe();
          });
          card.appendChild(btn);
        }
        grid.appendChild(card);
      });
      section.appendChild(grid);
      wrap.appendChild(section);
    }
  }

  /* ════════════ 16. ÉVÉNEMENTS ════════════ */

  function bindEvents() {
    // déblocage audio au premier geste + sonnerie du titre
    var unlockedAudio = false;
    document.addEventListener("pointerdown", function () {
      SAVAudio.ensureCtx();
      if (!unlockedAudio) {
        unlockedAudio = true;
        if (els["screen-title"].classList.contains("active")) {
          SAVAudio.startRing(save.equipped.ring);
          setTimeout(SAVAudio.stopRing, 3500);
        }
      }
    }, { passive: true });

    // mute global
    els["btn-mute"].addEventListener("click", function () {
      var m = SAVAudio.toggleMuted();
      els["btn-mute"].textContent = m ? "🔇" : "🔊";
      if (!m) { SAVAudio.click(); }
    });
    els["btn-mute"].textContent = SAVAudio.isMuted() ? "🔇" : "🔊";

    // ── Titre ──
    els["btn-new-game"].addEventListener("click", function () {
      SAVAudio.click();
      var hasProgress = save.xp > 0 || save.maxDay > 1 || save.wins > 0 || save.losses > 0;
      if (hasProgress && !window.confirm("Recommencer à zéro ?\nVotre progression (XP, déblocables) sera effacée.")) {
        return;
      }
      save = defaultSave();
      persistSave();
      showBriefing(0);
    });
    els["btn-continue"].addEventListener("click", function () {
      SAVAudio.click();
      var idx = Math.min(save.currentDay, GAME_DATA.days.length) - 1;
      showBriefing(Math.max(0, idx));
    });
    els["btn-wardrobe"].addEventListener("click", function () {
      SAVAudio.click();
      SAVAudio.stopRing();
      renderWardrobe();
      showScreen("screen-wardrobe");
    });
    els["btn-credits"].addEventListener("click", function () {
      SAVAudio.click();
      showScreen("screen-credits");
    });

    // ── Briefing ──
    els["btn-answer"].addEventListener("click", function () {
      SAVAudio.click();
      startCall();
    });
    els["btn-briefing-back"].addEventListener("click", function () {
      SAVAudio.click();
      SAVAudio.stopRing();
      refreshTitle();
      showScreen("screen-title");
    });

    // ── Appel ──
    els["dialogue-box"].addEventListener("click", onDialogueTap);
    els["btn-notebook"].addEventListener("click", openNotebook);
    els["btn-notebook-close"].addEventListener("click", function () { SAVAudio.click(); closeNotebook(); });
    els["notebook-backdrop"].addEventListener("click", closeNotebook);
    els["btn-sell"].addEventListener("click", function () { SAVAudio.click(); trySell(); });

    // ── Vestiaire ──
    els["btn-wardrobe-back"].addEventListener("click", function () {
      SAVAudio.click();
      SAVAudio.stopRing();
      refreshTitle();
      showScreen("screen-title");
    });
    els["btn-reset-save"].addEventListener("click", function () {
      SAVAudio.click();
      if (window.confirm("Tout effacer (XP, déblocables, progression) ?")) {
        save = defaultSave();
        persistSave();
        applyEquipment();
        renderWardrobe();
        showToast("Sauvegarde réinitialisée.");
      }
    });

    // ── Crédits ──
    els["btn-credits-back"].addEventListener("click", function () {
      SAVAudio.click();
      refreshTitle();
      showScreen("screen-title");
    });
    els["toggle-crt"].addEventListener("change", function () {
      var on = els["toggle-crt"].checked;
      document.body.classList.toggle("no-crt", !on);
      try { localStorage.setItem(CRT_KEY, on ? "1" : "0"); } catch (e) { /* ok */ }
    });

    // ── Fin ──
    // l'overlay avale tous les clics : rien ne doit traverser vers l'écran d'appel
    els["overlay-ending"].addEventListener("click", function (ev) { ev.stopPropagation(); });
    els["ending-result"].addEventListener("click", function (ev) { ev.stopPropagation(); });
    els["btn-next-day"].addEventListener("click", function (ev) {
      if (!endingClickGuard(ev)) { return; }
      SAVAudio.click();
      resetOverlay();
      showBriefing(dayIndex + 1);
    });
    els["btn-replay"].addEventListener("click", function (ev) {
      if (!endingClickGuard(ev)) { return; }
      SAVAudio.click();
      resetOverlay();
      showBriefing(dayIndex);
    });
    els["btn-ending-menu"].addEventListener("click", function (ev) {
      if (!endingClickGuard(ev)) { return; }
      SAVAudio.click();
      resetOverlay();
      refreshTitle();
      showScreen("screen-title");
    });

    // ── Clavier desktop : 1-4 choix, Espace/Entrée avancer, Échap carnet ──
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { closeNotebook(); return; }
      if (!els["screen-call"].classList.contains("active")) { return; }
      if (ev.key === " " || ev.key === "Enter") {
        ev.preventDefault();
        onDialogueTap();
        return;
      }
      var n = parseInt(ev.key, 10);
      if (n >= 1 && n <= 4) {
        var btns = els["choices-container"].querySelectorAll(".choice-btn");
        if (btns[n - 1]) { btns[n - 1].click(); }
      }
    });
  }

  /* ════════════ 17. INITIALISATION ════════════ */

  function init() {
    save = loadSave();
    applyEquipment();

    // scanlines CRT persistées
    var crt = true;
    try { crt = localStorage.getItem(CRT_KEY) !== "0"; } catch (e) { /* ok */ }
    document.body.classList.toggle("no-crt", !crt);
    els["toggle-crt"].checked = crt;

    bindEvents();
    refreshTitle();
    showScreen("screen-title");

    if (!window.GAME_DATA || !GAME_DATA.days) {
      showToast("⚠ js/scenarios.js introuvable : le jeu ne peut pas démarrer.", 6000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
