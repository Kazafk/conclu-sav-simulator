/* ═══════════════════════════════════════════════════════════════
   CONCLU ! — js/audio.js
   Sons 100% WebAudio générés en direct (aucun fichier audio).
   Exposé sur window.SAVAudio.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var ctx = null;              // AudioContext (créé à la 1re interaction)
  var masterGain = null;
  var muted = false;
  var ringTimer = null;        // boucle de sonnerie
  var MUTE_KEY = "conclu_mute";

  /* ── Persistance du mute ── */
  try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch (e) { /* mode privé */ }

  /* Crée (ou réveille) l'AudioContext — doit être appelé sur un geste utilisateur */
  function ensureCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.5;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") { ctx.resume(); }
    return ctx;
  }

  /* Joue une note : fréquence, durée, type d'onde, volume, délai, glissando optionnel */
  function note(freq, dur, type, vol, delay, slideTo) {
    if (muted || !ensureCtx()) return;
    var t0 = ctx.currentTime + (delay || 0);
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) { osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur); }
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol || 0.15, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /* ── Sonneries (3 variantes) ─────────────────────────────── */
  var RINGS = {
    /* 0 : bip classique de central téléphonique (double tonalité) */
    ring_classic: function () {
      note(440, 0.18, "square", 0.14, 0);
      note(480, 0.18, "square", 0.14, 0.2);
      note(440, 0.18, "square", 0.14, 0.4);
      note(480, 0.18, "square", 0.14, 0.6);
    },
    /* 1 : sonnerie électronique années 90 */
    ring_digital: function () {
      note(1200, 0.09, "square", 0.12, 0);
      note(1200, 0.09, "square", 0.12, 0.13);
      note(900, 0.2, "square", 0.12, 0.28);
    },
    /* 2 : petite mélodie rétro façon téléphone mobile vintage */
    ring_retro: function () {
      var seq = [659, 587, 370, 415, 554, 494, 294, 330, 494, 440, 277, 330, 440];
      for (var i = 0; i < seq.length; i++) {
        note(seq[i], 0.11, "square", 0.1, i * 0.12);
      }
    }
  };

  /* Lance la sonnerie en boucle jusqu'à stopRing() */
  function startRing(variantId) {
    stopRing();
    var fn = RINGS[variantId] || RINGS.ring_classic;
    var cycle = (variantId === "ring_retro") ? 2100 : 1600;
    fn();
    ringTimer = setInterval(function () {
      if (!muted) { fn(); }
    }, cycle);
  }

  function stopRing() {
    if (ringTimer) { clearInterval(ringTimer); ringTimer = null; }
  }

  /* ── Effets ─────────────────────────────────────────────── */
  /* Bleep de machine à écrire (léger, aigu, random) */
  function blip(speaker) {
    var base = 620 + Math.random() * 120;
    if (speaker === "client") { base = 480 + Math.random() * 90; }
    else if (speaker === "gilbert") { base = 720 + Math.random() * 120; }
    note(base, 0.04, "square", 0.05);
  }

  /* Clic d'interface */
  function click() { note(880, 0.06, "square", 0.1); note(1320, 0.05, "square", 0.07, 0.04); }

  /* Choix validé (petit "bip-bip" positif) */
  function confirm() { note(660, 0.07, "square", 0.1); note(990, 0.09, "square", 0.1, 0.07); }

  /* Erreur / refus */
  function error() { note(220, 0.18, "sawtooth", 0.12); note(160, 0.25, "sawtooth", 0.12, 0.14); }

  /* Indice collecté */
  function clue() { note(784, 0.08, "triangle", 0.14); note(1046, 0.14, "triangle", 0.14, 0.08); }

  /* Jingle de victoire triomphal */
  function victory() {
    var seq = [
      [523, 0.14, 0], [659, 0.14, 0.14], [784, 0.14, 0.28], [1046, 0.3, 0.42],
      [784, 0.12, 0.78], [1046, 0.5, 0.92]
    ];
    for (var i = 0; i < seq.length; i++) { note(seq[i][0], seq[i][1], "square", 0.14, seq[i][2]); }
    /* petite basse */
    note(131, 0.4, "triangle", 0.12, 0);
    note(196, 0.4, "triangle", 0.12, 0.42);
  }

  /* Tonalité de défaite : le client raccroche (bips occupés descendants) */
  function defeat() {
    note(440, 0.3, "sine", 0.14, 0, 380);
    note(425, 0.3, "sine", 0.14, 0.5);
    note(425, 0.3, "sine", 0.14, 1.0);
    note(425, 0.3, "sine", 0.14, 1.5);
  }

  /* ── Mute ───────────────────────────────────────────────── */
  function setMuted(m) {
    muted = !!m;
    try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch (e) { /* ok */ }
    if (muted) { stopRing(); }
  }
  function toggleMuted() { setMuted(!muted); return muted; }
  function isMuted() { return muted; }

  /* API publique */
  window.SAVAudio = {
    ensureCtx: ensureCtx,   // à appeler sur le 1er geste utilisateur (politique autoplay)
    startRing: startRing,
    stopRing: stopRing,
    blip: blip,
    click: click,
    confirm: confirm,
    error: error,
    clue: clue,
    victory: victory,
    defeat: defeat,
    setMuted: setMuted,
    toggleMuted: toggleMuted,
    isMuted: isMuted
  };
})();
