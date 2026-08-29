# 📞 CONCLU ! — Le Jeu du SAV

Un **visual novel comique** façon *Ace Attorney*, jouable sur mobile et PC, 100 % HTML/CSS/JS vanilla, sans build ni dépendance npm. Vous incarnez **Gilbert**, téléconseiller d'un service après-vente : écoutez les clients, collectez des indices, gérez leurs émotions… et **concluez la vente** avant qu'ils ne raccrochent !

## 🎮 Comment jouer

Ouvrez simplement `index.html` dans un navigateur (double-clic, `file://` accepté) — ou servez le dossier avec n'importe quel serveur statique.

1. **Briefing du jour** : lisez l'objectif de vente et la fiche client, puis **DÉCROCHEZ** 📞.
2. Pendant l'appel, surveillez les 3 jauges :
   - 🟩 **Confiance** — le client vous croit-il ?
   - 🟦 **Intérêt** — le produit le tente-t-il ?
   - 🟥 **Agacement** — à **100, il raccroche** (défaite immédiate).
3. Choisissez vos répliques (2 à 4 choix). Certains choix 🔒 exigent un **indice** préalablement collecté dans votre **📓 Carnet**.
4. Quand le moment est venu, cliquez **💼 PROPOSER LA VENTE** :
   - Confiance ≥ seuil **ET** Intérêt ≥ seuil **ET** Agacement < max → **VENTE CONCLUE !** 🎉
   - Sinon : refus sec et **Agacement +25**.
5. Victoire = XP (100 × difficulté), niveaux RPG et **déblocables** pour le **👔 Vestiaire** : sonneries, décors de bureau, cadres de portrait, cravates (changent réellement le son, le fond et la couleur d'accent).

### ⌨️ Raccourcis clavier (desktop)

| Touche | Action |
|---|---|
| `1`–`4` | Choisir une réplique |
| `Espace` / `Entrée` | Passer le texte / avancer |
| `Échap` | Fermer le carnet |

## 💾 Sauvegarde

Progression automatique dans `localStorage` (clé `conclu_save`) : jour débloqué, XP, équipement, victoires/défaites. Le bouton **CONTINUER** reprend au jour en cours. Réinitialisation possible depuis le vestiaire.

## 📁 Structure

```
conclu-sav/
├── index.html        # écrans : titre, briefing, appel, vestiaire, crédits, fins
├── css/style.css     # pixel-art CSS pur, scanlines CRT, responsive mobile-first
├── js/audio.js       # sons WebAudio générés (sonneries ×3, typewriter, jingles) — aucun fichier audio
├── js/scenarios.js   # données des jours/dialogues (window.GAME_DATA)
└── js/engine.js      # moteur : typewriter, stats animées, carnet, vente, RPG, sauvegarde
```

Le jeu fonctionne **hors-ligne** (seules les Google Fonts « Press Start 2P » / « VT323 » nécessitent le réseau ; fallback monospace sinon).

## 🚀 Déploiement GitHub Pages

1. Poussez ce dossier dans un dépôt GitHub (par ex. `conclu-sav`).
2. Dans **Settings → Pages** : *Source* = `Deploy from a branch`, branche `main`, dossier `/ (root)`.
3. Le jeu est en ligne sur `https://<votre-pseudo>.github.io/conclu-sav/`.

Aucune étape de build : les fichiers statiques sont servis tels quels.

## ✍️ Ajouter du contenu

Les journées sont décrites dans `js/scenarios.js` via `window.GAME_DATA.days` : nœuds de dialogue (`speaker`, `text`, `next`), choix à effets (`confiance` / `interet` / `agacement`), indices (`clue`, `requiresClue`), seuils de victoire (`winThresholds`), etc.

## 🌐 Jouer en ligne

Pour publier le jeu avec **GitHub Pages** :

1. Allez dans **Settings → Pages** du dépôt.
2. Sous *Build and deployment* : **Source** = `Deploy from a branch`, branche **main**, dossier **/ (root)**, puis *Save*.
3. Après quelques secondes, le jeu est jouable sur `https://kazafk.github.io/conclu-sav-simulator/`.

Aucune étape de build : les fichiers statiques sont servis tels quels. Le jeu fonctionne aussi **en ouvrant simplement `index.html` en local** (double-clic, `file://` accepté) — aucune dépendance réseau requise hors Google Fonts.
