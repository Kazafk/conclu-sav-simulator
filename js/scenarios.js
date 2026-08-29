// scenarios.js — contenu narratif du jeu CONCLU ! — Le Jeu du SAV
const GAME_DATA = {
  products: [],
  days: [
    {
      id: 1,
      title: "Jour 1 — La Mamie en Colère (enfin presque)",
      briefing: "Gilbert, écoute-moi bien. Aujourd'hui on vend l'Assurance Cornflakes Anti-Miettes. Oui, je sais. Non, ce n'est pas une blague, le comité de direction a validé ça un vendredi à 19h. Alors tu vas me faire honneur : tu écoutes la cliente, tu notes tout, et tu CONCLU ! On va pas se mentir, ça va être un grand jour.",
      objective: { name: "Assurance Cornflakes Anti-Miettes — formule Petit-Déjeuner Zen", description: "Couvre les miettes de céréales sur nappes, tapis, pyjamas et dignité.", price: "9,99 €/mois" },
      difficulty: 1,
      client: { name: "Mme Lachance", subtitle: "Retraitée au caractère bien trempé", emoji: "👵" },
      startConfiance: 25, startInteret: 15, startAgacement: 20,
      winThresholds: { confiance: 55, interet: 45, maxAgacement: 85 },
      start: "n1",
      nodes: {
        "n1": {
          speaker: "client",
          text: "Allôôô ? Josette ? C'est toi, ma Josette ? Je t'entends mal, cette ligne est fabriquée en carton.",
          next: "n2"
        },
        "n2": {
          speaker: "client",
          text: "Alors, tu te décides à parler, oui ou non ?",
          choices: [
            { text: "Non madame, ici Gilbert Vendeur, de la compagnie Assur'Tout.", effects: { confiance: 5, interet: 0, agacement: 5 }, next: "n3" },
            { text: "Oui mamie, c'est Josette ! Tu m'as reconnu(e) ?", effects: { confiance: -5, interet: 10, agacement: 0 }, next: "n4" },
            { text: "Non, mais je peux être votre rayon de soleil de 8h37.", effects: { confiance: 10, interet: 5, agacement: 0 }, next: "n5" }
          ]
        },
        "n3": {
          speaker: "client",
          text: "Encore un vendeur ! Vous appelez toujours pendant Questions pour un champion, c'est une conspiration.",
          choices: [
            { text: "Vous n'avez qu'à pas répondre, madame.", effects: { confiance: -10, interet: 0, agacement: 10 }, hangup: true },
            { text: "Pardon pour Julien Lepers. Je vous promets deux minutes, montre en main.", effects: { confiance: 10, interet: 0, agacement: -10 }, next: "n6" }
          ]
        },
        "n4": {
          speaker: "client",
          text: "Oh ma Josette ! Alors, ce mariage avec Kévin, ça avance ? Ta grand-mère veut voir la robe !",
          clue: { id: "josette", title: "La vraie Josette", text: "Mme Lachance attend des nouvelles de sa petite-fille Josette, fiancée à un certain Kévin." },
          choices: [
            { text: "Kévin ? Il m'a quittée pour une vendeuse en assurance. Enfin... c'est compliqué.", effects: { confiance: -5, interet: 5, agacement: 0 }, next: "n5" },
            { text: "Mamie... euh, madame, je dois vous avouer quelque chose : je m'appelle Gilbert.", effects: { confiance: 10, interet: 0, agacement: 0 }, next: "n5" }
          ]
        },
        "n5": {
          speaker: "client",
          text: "Bon. Vous avez de la chance : j'ai raté mon bus pour le loto. Je vous écoute, jeune homme, mais faites vite.",
          next: "n6"
        },
        "n6": {
          speaker: "client",
          text: "Et dépêchez-vous, mon chat M. Moustache renverse tout sur la table du petit-déjeuner, ce garnement. Des cornflakes PARTOUT, tous les matins !",
          clue: { id: "moustache", title: "M. Moustache, le chat sème la panique", text: "Le chat de Mme Lachance éparpille des miettes de cornflakes chaque matin sur la table du petit-déjeuner." },
          choices: [
            { text: "Les chats, ces petits anarchistes du salon.", effects: { confiance: 5, interet: 5, agacement: 0 }, next: "n7" },
            { text: "J'ai EXACTEMENT le produit qu'il vous faut !", effects: { confiance: 0, interet: 5, agacement: 10 }, next: "n8" },
            { text: "Ce chat mérite une médaille. Et peut-être une franchise.", effects: { confiance: 0, interet: 10, agacement: 5 }, next: "n7" }
          ]
        },
        "n7": {
          speaker: "client",
          text: "Alors comme ça, vous vendez des assurances ? Moi je suis déjà assurée contre tout, hein ! Contre rien, peut-être, je ne sais plus.",
          choices: [
            { text: "Contre les miettes de cornflakes au petit-déjeuner, vous êtes assurée ?", effects: { confiance: 10, interet: 15, agacement: -5 }, next: "n9", requiresClue: "moustache", lockedText: "Il vous manque un détail sur les matins de madame pour placer ça…" },
            { text: "Notre Assurance Cornflakes Anti-Miettes couvre TOUT : nappe, tapis, pantalon de pyjama.", effects: { confiance: 0, interet: 10, agacement: 5 }, next: "n8" },
            { text: "Contre le loto raté, par contre, on ne peut rien. Mes condoléances.", effects: { confiance: 10, interet: 5, agacement: 0 }, next: "n9" }
          ]
        },
        "n8": {
          speaker: "client",
          text: "Une assurance pour les MIETTES ? Vous vous moquez de moi, jeune homme ?",
          choices: [
            { text: "Jamais de la vie ! Chiffre officiel : 3 000 foyers français souffrent de miettes chroniques.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n9" },
            { text: "Un peu, oui. Mais avouez que ça vous fait sourire.", effects: { confiance: 10, interet: 5, agacement: -5 }, next: "n9" },
            { text: "Signez d'abord, vous verrez bien après.", effects: { confiance: -10, interet: 0, agacement: 20 }, hangup: true }
          ]
        },
        "n9": {
          speaker: "client",
          text: "Ah bah ça... M. Moustache, ARRÊTE ÇA ! ... Pardon. Vous disiez, jeune homme ?",
          next: "n10"
        },
        "n10": {
          speaker: "client",
          text: "Alors, c'est combien, votre histoire ?",
          choices: [
            { text: "9,99 € par mois, et vos matins redeviennent zen. On signe ?", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n11" },
            { text: "Offrez-le à Josette pour son mariage avec Kévin : c'est LE cadeau qui surprend.", effects: { confiance: 15, interet: 10, agacement: -5 }, next: "n12", requiresClue: "josette", lockedText: "Vous ne savez rien de la famille de la cliente…" },
            { text: "Bon, si vous ne voulez pas dormir tranquille…", effects: { confiance: -10, interet: 0, agacement: 15 }, next: "n13" }
          ]
        },
        "n11": {
          speaker: "client",
          text: "Neuf quatre-vingt-dix-neuf... C'est le prix de deux paquets de cornflakes, ça !",
          choices: [
            { text: "Exactement ! Et ceux-là, on vous les protège à vie.", effects: { confiance: 5, interet: 15, agacement: 0 }, next: "n12" },
            { text: "C'est le prix du bonheur, madame Lachance. Et le bonheur, il est en promo aujourd'hui.", effects: { confiance: 5, interet: 0, agacement: 5 }, next: "n13" }
          ]
        },
        "n12": {
          speaker: "client",
          text: "Bon ben... Allez, je signe. Et dites bonjour à Kévin de ma part. Enfin à Josette. Enfin bref, vous m'avez comprise !",
          next: "n14"
        },
        "n13": {
          speaker: "client",
          text: "Vous me stressez, jeune homme. Je vais raccrocher, moi, et retourner à mes cornflakes.",
          choices: [
            { text: "Un dernier mot : faites-le pour M. Moustache. Il vous remerciera.", effects: { confiance: 10, interet: 10, agacement: -5 }, next: "n12", requiresClue: "moustache", lockedText: "Il vous manque un détail sur le chat de la maison…" },
            { text: "Attendez ! Premier mois offert, cadeau de la maison !", effects: { confiance: 0, interet: 10, agacement: 10 }, next: "n12" },
            { text: "Très bien, je vous laisse à votre émission, madame.", effects: { confiance: 0, interet: 0, agacement: 5 }, hangup: true }
          ]
        },
        "n14": {
          speaker: "narrator",
          text: "Mme Lachance raccroche en fredonnant une chanson de Michel Sardou. Quelque part dans la cuisine, M. Moustache renverse un dernier cornflake, libre et assuré."
        }
      }
    },
    {
      id: 2,
      title: "Jour 2 — Le Concours de Labour",
      briefing: "Gilbert ! Mauvaise nouvelle : le stock d'assurances cornflakes s'écoule tout seul grâce à toi, donc la direction a monté d'un cran. Aujourd'hui : la Multirisque Tracteur-Tondeuse. La cible du jour conduit un engin qui vient d'exploser. C'est pas une coïncidence, c'est du marketing. Écoute-le bien, ces gens-là parlent peu mais disent tout. CONCLU !",
      objective: { name: "Multirisque Tracteur-Tondeuse — formule Gisèle", description: "Panne, casse, explosion et chagrin d'amour mécanique couverts, même la veille d'un concours.", price: "29,99 €/mois" },
      difficulty: 2,
      client: { name: "M. Kowalski", subtitle: "Agriculteur pressé, triple vice-champion de labour", emoji: "🚜" },
      startConfiance: 20, startInteret: 10, startAgacement: 30,
      winThresholds: { confiance: 58, interet: 48, maxAgacement: 80 },
      start: "n1",
      nodes: {
        "n1": {
          speaker: "narrator",
          text: "Le combiné grésille. En fond sonore : un moteur diesel, et un coq qui a visiblement des choses à dire.",
          next: "n2"
        },
        "n2": {
          speaker: "client",
          text: "ALLO ?! Parlez fort ! J'étais sur la tondeuse ! Enfin... elle vient de m'exploser au nez, alors je suis À CÔTÉ de la tondeuse.",
          next: "n3"
        },
        "n3": {
          speaker: "client",
          text: "C'est qui ?! J'ai pas que ça à faire !",
          choices: [
            { text: "Monsieur Kowalski ? Gilbert Vendeur, Assur'Tout. Et votre tondeuse, elle va bien ?", effects: { confiance: 10, interet: 0, agacement: 0 }, next: "n4" },
            { text: "Quelle coïncidence : je vends justement des assurances pour tondeuses !", effects: { confiance: 0, interet: 5, agacement: 10 }, next: "n5" },
            { text: "On dirait le hall d'un aéroport chez vous. Le coq, c'est le haut-parleur ?", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n4" }
          ]
        },
        "n4": {
          speaker: "client",
          text: "Gisèle va PAS bien ! Trente ans de loyaux services, et elle me lâche comme ça, sans prévenir !",
          clue: { id: "gisele", title: "Gisèle, la tondeuse", text: "La tracteur-tondeuse de M. Kowalski s'appelle Gisèle. Trente ans de loyaux services. Il en parle comme d'une vieille amie." },
          next: "n5"
        },
        "n5": {
          speaker: "client",
          text: "Et sans elle, adieu le concours de labour de Saint-Pouilloux, samedi ! Triple vice-champion, moi, monsieur ! Le labour, c'est ma retraite sportive !",
          clue: { id: "concours", title: "Le concours de samedi", text: "Le grand concours de labour de Saint-Pouilloux a lieu samedi. M. Kowalski est triple vice-champion et rêve du titre." },
          choices: [
            { text: "Triple vice-champion : le titre le plus cruel du sport moderne. Tous mes respects.", effects: { confiance: 10, interet: 5, agacement: 0 }, next: "n6" },
            { text: "Le labour, ça se pratique en salle ou en extérieur ?", effects: { confiance: -5, interet: -5, agacement: 10 }, next: "n7" },
            { text: "Si Gisèle avait été assurée, samedi, vous labouriez.", effects: { confiance: 5, interet: 15, agacement: 0 }, next: "n8", requiresClue: "gisele", lockedText: "Vous ne connaissez pas encore le nom de la machine…" }
          ]
        },
        "n6": {
          speaker: "client",
          text: "Bon, c'est quoi votre camelotte, à la fin ? J'ai pas la journée, mes betteraves m'attendent.",
          choices: [
            { text: "La Multirisque Tracteur-Tondeuse : panne, casse, explosion, et même chagrin d'amour mécanique.", effects: { confiance: 0, interet: 10, agacement: 5 }, next: "n8" },
            { text: "Une assurance pensée pour Gisèle. Pas pour une vulgaire tondeuse : pour Gisèle.", effects: { confiance: 15, interet: 10, agacement: -5 }, next: "n8", requiresClue: "gisele", lockedText: "Il vous manque le nom de la fameuse tondeuse…" },
            { text: "Rien, je vous appelais surtout pour parler du coq.", effects: { confiance: -5, interet: 0, agacement: 10 }, next: "n9" }
          ]
        },
        "n7": {
          speaker: "narrator",
          text: "Nœud de réserve. Si vous lisez ceci, le coq a gagné.",
          next: "n8"
        },
        "n8": {
          speaker: "client",
          text: "Hmm... Et si Gisèle explose la veille d'un concours ? Genre un samedi. Genre CE samedi. Vous faites quoi, concrètement ?",
          choices: [
            { text: "Tondeuse de remplacement sous 48 h. Le championnat est sauvé, monsieur le vice-champion.", effects: { confiance: 10, interet: 15, agacement: -5 }, next: "n10", requiresClue: "concours", lockedText: "Vous ne savez rien d'un quelconque concours…" },
            { text: "On vous envoie un calendrier avec des photos de tracteurs.", effects: { confiance: -5, interet: -5, agacement: 15 }, next: "n9" },
            { text: "On pleure avec vous. Puis on paie. Dans cet ordre.", effects: { confiance: 10, interet: 10, agacement: 0 }, next: "n10" }
          ]
        },
        "n9": {
          speaker: "client",
          text: "Vous me faites perdre mon temps, monsieur Vendeur. Et mon temps, c'est du fumier en or.",
          choices: [
            { text: "Le fumier n'attend pas : deux minutes, parole de Gilbert.", effects: { confiance: 5, interet: 0, agacement: -5 }, next: "n8" },
            { text: "Alors je résume : Gisèle assurée, samedi assuré, gloire assurée.", effects: { confiance: 5, interet: 15, agacement: 0 }, next: "n10", requiresClue: "concours", lockedText: "Il vous manque l'info sur le grand rendez-vous du client…" },
            { text: "Pas de problème. Bonne betterave, monsieur !", effects: { confiance: 0, interet: 0, agacement: 5 }, hangup: true }
          ]
        },
        "n10": {
          speaker: "client",
          text: "Et ça coûte combien ? Parce que les arnaques, je connais : en 1987, un type m'a vendu une assurance contre la pluie. Il pleut encore.",
          choices: [
            { text: "29,99 € par mois. Moins cher qu'un bidon d'huile moteur, et bien plus utile.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n11" },
            { text: "Promis, on ne couvre pas la pluie. Uniquement la gloire mécanique.", effects: { confiance: 10, interet: 5, agacement: 0 }, next: "n11" }
          ]
        },
        "n11": {
          speaker: "client",
          text: "Bon... Vous m'enverrez les papiers ? Et Gisèle sera couverte avant samedi, hein ?",
          choices: [
            { text: "Signé, scellé, laburé. Bienvenue chez Assur'Tout.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n12" },
            { text: "Avant samedi, oui. Et dites bonjour à Gisèle de la part d'un admirateur.", effects: { confiance: 10, interet: 10, agacement: -5 }, next: "n12", requiresClue: "gisele", lockedText: "Vous avez oublié le nom de la star de la ferme…" },
            { text: "Ah, alors en fait, il y a trois semaines de délai de carence...", effects: { confiance: -10, interet: 0, agacement: 20 }, hangup: true }
          ]
        },
        "n12": {
          speaker: "client",
          text: "C'est conclu ! ... Attendez. Me dites pas que c'est VOTRE slogan, quand même ?",
          next: "n13"
        },
        "n13": {
          speaker: "narrator",
          text: "Gilbert sourit si fort que son casque glisse sur son oreille. Derrière la vitre, le chef d'agence lève le pouce. C'est le plus beau jour de sa carrière depuis mardi."
        }
      }
    },
    {
      id: 3,
      title: "Jour 3 — Le Facteur Sonne Toujours Deux Fois",
      briefing: "Gilbert, assieds-toi. Aujourd'hui on vend l'Assurance Grève de la Poste. Oui, je sais ce que tu vas dire, et non, je n'ai pas le droit d'en parler. Le client du jour est facteur, syndiqué, et il connaît toutes les techniques de vente par cœur. On va pas se mentir : si tu le brusques, il te raccroche au nez en respectant les délais légaux. Finesse, Gilbert. Finesse.",
      objective: { name: "Assurance Grève de la Poste — formule Piquet de Grève Zen", description: "Verse une indemnité pour chaque jour de grève, avec option banderole aux normes.", price: "14,99 €/mois" },
      difficulty: 3,
      client: { name: "M. Dufragile", subtitle: "Facteur syndiqué, en grève depuis son canapé", emoji: "📮" },
      startConfiance: 15, startInteret: 10, startAgacement: 35,
      winThresholds: { confiance: 62, interet: 52, maxAgacement: 75 },
      start: "n1",
      nodes: {
        "n1": {
          speaker: "narrator",
          text: "Vous composez le numéro. Une musique d'attente démarre : « La Vie en rose » aux flûtes de pan. Le combiné émet un bruit de chute suspect.",
          next: "n2"
        },
        "n2": {
          speaker: "client",
          text: "Allô ? Ah, enfin un humain ! Non, attendez... c'est MOI qui reçois l'appel. Vous êtes qui, d'abord ?",
          choices: [
            { text: "Gilbert Vendeur, Assur'Tout. Vous êtes bien monsieur Dufragile ?", effects: { confiance: 5, interet: 0, agacement: 0 }, next: "n3" },
            { text: "Un admirateur du service postal. Et de vos shorts d'été.", effects: { confiance: 5, interet: 5, agacement: 0 }, next: "n3" },
            { text: "Votre appel est important pour nous.", effects: { confiance: 0, interet: 10, agacement: 5 }, next: "n3" }
          ]
        },
        "n3": {
          speaker: "client",
          text: "Dufragile, oui. Facteur depuis 22 ans. Et en ce moment, monsieur, je suis en GRÈVE. Alors parlez bas : je manifeste depuis mon canapé, la banderole est accrochée au lampadaire.",
          clue: { id: "greve", title: "La grève du jeudi", text: "M. Dufragile fait grève tous les jeudis, depuis son canapé, avec une banderole accrochée au lampadaire du salon." },
          next: "n4"
        },
        "n4": {
          speaker: "client",
          text: "Vous vendez quoi ? Attention, je suis syndiqué : j'ai le droit de raccrocher au nez trois fois sans préavis. C'est dans la convention.",
          choices: [
            { text: "Une assurance pensée pour les héros du courrier. Genre vous, précisément.", effects: { confiance: 10, interet: 5, agacement: 0 }, next: "n5" },
            { text: "De l'assurance. Et franchement, trois raccrochages garantis, c'est un beau droit acquis.", effects: { confiance: 10, interet: 5, agacement: -5 }, next: "n5" },
            { text: "Peu importe ce que je vends, c'est GRATUIT !", effects: { confiance: -10, interet: 0, agacement: 15 }, hangup: true }
          ]
        },
        "n5": {
          speaker: "client",
          text: "Un héros, oui ! Vous savez que je collectionne les timbres ? J'avais le Cérès de 1849. Enfin, une photocopie. L'original est... parti par la poste. Ironique, non ?",
          clue: { id: "timbres", title: "La collection de timbres", text: "M. Dufragile collectionne les timbres. Son plus beau spécimen, un Cérès de 1849, s'est perdu... par la poste." },
          choices: [
            { text: "Un timbre perdu par la poste : c'est le comble du métier. Vous avez mon respect éternel.", effects: { confiance: 10, interet: 5, agacement: -5 }, next: "n6" },
            { text: "La photocopie a une valeur sentimentale. C'est déjà un trésor.", effects: { confiance: 5, interet: 0, agacement: 0 }, next: "n6" },
            { text: "Les timbres, ça ne sert plus à rien avec les e-mails, de toute façon.", effects: { confiance: -10, interet: -5, agacement: 20 }, next: "n6" }
          ]
        },
        "n6": {
          speaker: "client",
          text: "Bon. Votre assurance, là. Elle assure QUOI, exactement ? Et je veux des mots simples, hein, pas du charabia de direction.",
          choices: [
            { text: "La grève, monsieur. Une indemnité pour chaque jeudi où vous ne triez pas le courrier.", effects: { confiance: 10, interet: 15, agacement: -5 }, next: "n7", requiresClue: "greve", lockedText: "Vous ne savez pas encore quel jour le client manifeste…" },
            { text: "Tout. Enfin presque tout. Enfin... lisez le contrat, c'est marqué dedans.", effects: { confiance: -5, interet: -5, agacement: 10 }, next: "n8" },
            { text: "Elle peut aussi couvrir votre collection. Contre le vol, les dégâts... et la poste.", effects: { confiance: 10, interet: 10, agacement: 0 }, next: "n7", requiresClue: "timbres", lockedText: "Il vous manque un détail sur la passion du client…" }
          ]
        },
        "n7": {
          speaker: "client",
          text: "Attendez, attendez... Vous êtes en train de me dire que je serais PAYÉ pour faire grève ?",
          choices: [
            { text: "Payé pour défendre vos droits, oui. C'est beau comme une phrase de meeting.", effects: { confiance: 10, interet: 10, agacement: -5 }, next: "n9" },
            { text: "Payé, oui. Mais pas en timbres. En vrai argent, celui qui ne se perd pas.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n9" }
          ]
        },
        "n8": {
          speaker: "client",
          text: "« Lisez le contrat » ?! C'est EXACTEMENT ce que dit ma direction ! Vous êtes qui, au juste ? Un espion du siège ?!",
          choices: [
            { text: "Pardon. Reprenons : je vous explique tout, ligne par ligne, sans jargon. Promis, juré, tamponné.", effects: { confiance: 15, interet: 0, agacement: -10 }, next: "n7" },
            { text: "Un camarade de lutte, à ma façon. Une façon très assise.", effects: { confiance: 5, interet: 5, agacement: 0 }, next: "n7" },
            { text: "Personne. Ce coup de fil n'a jamais existé. Oubliez mon numéro.", effects: { confiance: 0, interet: 0, agacement: 10 }, hangup: true }
          ]
        },
        "n9": {
          speaker: "client",
          text: "Mmh... Et si je signe, je peux afficher votre logo sur ma banderole de grève ? Histoire de faire les choses bien.",
          choices: [
            { text: "Monsieur Dufragile, ce serait un honneur syndical. Je le mentionne dans le contrat.", effects: { confiance: 10, interet: 10, agacement: -5 }, next: "n10" },
            { text: "Seulement si la banderole est aux normes ISO 9001, monsieur.", effects: { confiance: 0, interet: -5, agacement: 10 }, next: "n10" }
          ]
        },
        "n10": {
          speaker: "client",
          text: "Bon, allez, je signe. Mais dites à votre direction que le jeudi, c'est sacré. Et que le lampadaire, c'est du mobilier de lutte.",
          next: "n11"
        },
        "n11": {
          speaker: "narrator",
          text: "Au loin, la musique d'attente reprend toute seule, sans raison. M. Dufragile siffle l'Internationale dans le combiné. Gilbert note sur sa fiche : « Client conclu. Légèrement chantant. »"
        }
      }
    },
    {
      id: 4,
      title: "Jour 4 — Haut-Parleur Conjugal",
      briefing: "Gilbert, aujourd'hui c'est délicat : on vend l'Assurance Divorce Express. Le client du jour est... enfin, les clients. Un couple. Sur haut-parleur. En pleine dispute. C'est comme vendre des parapluies pendant une tempête : tout le monde a besoin de toi, mais personne ne t'écoute. Reste neutre, reste humain, et pour l'amour du chiffre d'affaires, CONCLU !",
      objective: { name: "Assurance Divorce Express — formule Amour Vache", description: "Procédure rapide, frais couverts, et garde alternée des animaux de plus de 25 kilos incluse.", price: "39,99 €/mois" },
      difficulty: 4,
      client: { name: "Mme Berbère", subtitle: "En pleine dispute conjugale, sur haut-parleur", emoji: "💔" },
      startConfiance: 15, startInteret: 15, startAgacement: 40,
      winThresholds: { confiance: 66, interet: 58, maxAgacement: 70 },
      start: "n1",
      nodes: {
        "n1": {
          speaker: "narrator",
          text: "Le téléphone sonne à peine qu'on décroche déjà. Deux voix s'affrontent sur haut-parleur. Vous venez d'entrer dans un conseil de guerre conjugal.",
          next: "n2"
        },
        "n2": {
          speaker: "client",
          text: "Allô ?! OUI ?! Si c'est encore pour les panneaux solaires, je vous préviens : mon mari adore les panneaux solaires, et moi je déteste mon mari !",
          next: "n3"
        },
        "n3": {
          speaker: "client",
          text: "Alors ?! Vous parlez ou vous respirez dans le combiné ?",
          choices: [
            { text: "Madame Berbère ? Gilbert Vendeur, Assur'Tout. J'arrive mal, c'est ça ?", effects: { confiance: 10, interet: 0, agacement: -5 }, next: "n4" },
            { text: "Je vends de l'assurance, pas des panneaux. Et je ne prends parti pour personne. C'est écrit sur ma fiche de poste.", effects: { confiance: 5, interet: 5, agacement: 0 }, next: "n4" },
            { text: "Votre mari a raison : les panneaux solaires, c'est l'avenir.", effects: { confiance: -10, interet: 0, agacement: 20 }, hangup: true }
          ]
        },
        "n4": {
          speaker: "client",
          text: "UNE VOIX D'HOMME, AU LOIN : « C'est qui ?! Dis-lui qu'on a déjà TOUT ce qu'il faut, y compris un avocat ! » — Vous entendez ça ? « Un avocat » ! Il dit ça comme s'il disait « une Porsche » !",
          clue: { id: "avocat", title: "Ils ont déjà un avocat", text: "Les Berbère ont déjà consulté un avocat. La procédure est lancée, mais rien n'est signé. Tout peut encore bouger." },
          next: "n5"
        },
        "n5": {
          speaker: "client",
          text: "Bon, jeune homme, vous vendez quoi, à la fin ? Et faites court, je dois encore disputer deux ou trois points avant le déjeuner.",
          choices: [
            { text: "L'Assurance Divorce Express. Je ne vous la fais pas plus longue : c'est dans le nom.", effects: { confiance: 0, interet: 10, agacement: 5 }, next: "n6" },
            { text: "D'abord, dites-moi ce qui coince entre vous. Je suis très bon auditeur, c'est tout mon métier.", effects: { confiance: 15, interet: 0, agacement: -10 }, next: "n6" }
          ]
        },
        "n6": {
          speaker: "client",
          text: "Ce qui coince ? MÉDOR ! Vingt-six kilos de labrador, et monsieur réclame la garde alternée ! C'est un chien, monsieur Vendeur, pas un canapé !",
          clue: { id: "medor", title: "La garde de Médor", text: "Le vrai sujet de dispute : Médor, labrador de 26 kilos. Mme veut la garde complète ; M. réclame l'alternée." },
          choices: [
            { text: "La garde alternée d'un labrador... Votre mari a de l'humour, au moins. Reconnaissez-le.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n7" },
            { text: "Et Médor, lui, il préfère qui ? Les chiens ne mentent jamais.", effects: { confiance: 10, interet: 5, agacement: 0 }, next: "n7" },
            { text: "Vingt-six kilos ? Le divorce est justifié, effectivement.", effects: { confiance: -5, interet: 0, agacement: 10 }, next: "n7" }
          ]
        },
        "n7": {
          speaker: "client",
          text: "Le pire, jeune homme, c'est qu'on s'est rencontrés à un cours de danse country. Il dansait si bien. Il danse toujours si bien, l'andouille. On y retourne tous les samedis, d'ailleurs. Enfin... on y retournait.",
          clue: { id: "country", title: "Le cours de danse country", text: "Les Berbère se sont rencontrés à un cours de danse country. Ils y dansent encore ensemble tous les samedis. Personne ne veut lâcher le cours." },
          choices: [
            { text: "Un homme qui danse bien, madame, ça ne se divorce pas. Ça se négocie.", effects: { confiance: 10, interet: 5, agacement: -5 }, next: "n8" },
            { text: "L'andouille est un plat qui se mange froid. La vôtre a l'air tiède, encore.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n8" }
          ]
        },
        "n8": {
          speaker: "client",
          text: "Bon. Votre assurance, là. « Divorce Express ». Elle fait quoi, concrètement ?",
          choices: [
            { text: "Rapide, sans frais cachés, et elle couvre même la garde alternée des labradors de plus de 25 kilos. Tout est prévu.", effects: { confiance: 10, interet: 15, agacement: -5 }, next: "n9", requiresClue: "medor", lockedText: "Vous ne savez rien du fameux chien…" },
            { text: "Rapide. En 48 h, c'est plié. Sans réfléchir, sans danser, sans retour possible.", effects: { confiance: -5, interet: -5, agacement: 10 }, next: "n10" },
            { text: "Elle prévoit un volet « réconciliation » : si vous retournez au cours de country ensemble, on vous rembourse un mois.", effects: { confiance: 15, interet: 10, agacement: -10 }, next: "n11", requiresClue: "country", lockedText: "Il vous manque un souvenir commun à ce couple…" }
          ]
        },
        "n9": {
          speaker: "client",
          text: "LA VOIX D'HOMME, HURLANT DU SALON : « ELLE GARDE MÉDOR ET LA CLÔTURE ÉLECTRIQUE ?! JAMAIS ! » — Ta clôture, tu la gardes ! Et tes panneaux solaires avec !",
          choices: [
            { text: "Madame, médiation express : Médor la semaine, la clôture le week-end. Chacun son électricité.", effects: { confiance: 5, interet: 10, agacement: -5 }, next: "n11" },
            { text: "Monsieur a raison, une clôture électrique, ça ne se partage pas. C'est dangereux et c'est beau.", effects: { confiance: -10, interet: 0, agacement: 15 }, next: "n10" }
          ]
        },
        "n10": {
          speaker: "client",
          text: "Vous me bousculez, jeune homme. Mon avocat me déconseille de signer sous le coup de l'énervement. Et je suis énervée TOUT LE TEMPS.",
          choices: [
            { text: "Alors on ne signe rien aujourd'hui. On signe quand VOUS déciderez. Voilà. C'est dit, et c'est sincère.", effects: { confiance: 15, interet: 5, agacement: -10 }, next: "n11" },
            { text: "Votre avocat vous déconseille aussi les cours de country, ou il a encore un peu de cœur ?", effects: { confiance: 10, interet: 15, agacement: -5 }, next: "n11", requiresClue: "country", lockedText: "Vous ne connaissez pas le point faible de ce couple…" },
            { text: "L'énervement, c'est gratuit. Profitez-en, signez !", effects: { confiance: -10, interet: 0, agacement: 20 }, hangup: true }
          ]
        },
        "n11": {
          speaker: "client",
          text: "Vous savez quoi, jeune homme ? Je signe votre assurance. Et si ça se passe bien... ou mal... je vous invite au cours de country de samedi. Venez avec des bottes.",
          next: "n12"
        },
        "n12": {
          speaker: "narrator",
          text: "Au loin, M. Berbère marmonne « elle signe rien sans moi »... puis demande, très fort, s'il existe une formule duo. Médor aboie une fois. Démocratiquement."
        }
      }
    },
    {
      id: 5,
      title: "Jour 5 — Le Pigeon Piraté",
      briefing: "Gilbert. La direction a innové. On vend désormais la Cyber-Assurance pour Pigeon Voyageur. Ne me demande pas ce que ça veut dire, personne ne le sait, pas même le comité. Le client du jour est colombophile, très connecté, et légèrement... surveillé, d'après lui. Sois précis, sois calme, et surtout : ne ris pas. Même quand c'est très dur. CONCLU !",
      objective: { name: "Cyber-Assurance pour Pigeon Voyageur — formule Vol Sécurisé", description: "Pare-feu anti-pie, perte de GPS interne et détournement de vol couverts.", price: "24,99 €/mois" },
      difficulty: 4,
      client: { name: "M. Pigeonneau", subtitle: "Colombophile très connecté, légèrement surveillé", emoji: "🐦" },
      startConfiance: 20, startInteret: 15, startAgacement: 25,
      winThresholds: { confiance: 70, interet: 64, maxAgacement: 65 },
      start: "n1",
      nodes: {
        "n1": {
          speaker: "narrator",
          text: "Trois sonneries. Un roucoulement répond. Puis une voix, essoufflée, qui chuchote comme si les murs avaient des plumes.",
          next: "n2"
        },
        "n2": {
          speaker: "client",
          text: "Oui ?! Si c'est le FBI des oiseaux, je nie tout ! ... Pardon. Réflexe. C'est qui ?",
          choices: [
            { text: "Gilbert Vendeur, Assur'Tout. On m'a dit que vous éleviez des pigeons remarquables.", effects: { confiance: 5, interet: 5, agacement: 0 }, next: "n3" },
            { text: "Le FBI des oiseaux n'existe pas, monsieur. Enfin... pas officiellement.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n3" },
            { text: "Dites « tout » et on en reparle.", effects: { confiance: -5, interet: 0, agacement: 10 }, next: "n3" }
          ]
        },
        "n3": {
          speaker: "client",
          text: "Des pigeons VOYAGEURS, monsieur. Quarante-trois têtes. Et au sommet de la pyramide : Wifi, mon champion. Triple médaillé d'or au Marathon des Cieux.",
          clue: { id: "wifi", title: "Wifi, le pigeon champion", text: "Wifi, pigeon vedette de M. Pigeonneau, triple médaillé d'or au Marathon des Cieux. La fierté absolue de son maître." },
          next: "n4"
        },
        "n4": {
          speaker: "client",
          text: "Mais depuis mardi, catastrophe : Wifi ne rentre plus au pigeonnier. Il tourne en rond au-dessus du Carrefour. On l'a PIRATÉ, monsieur ! Son GPS interne est compromis !",
          clue: { id: "pirate", title: "Le piratage de Wifi", text: "Wifi ne rentre plus au pigeonnier et tourne en rond au-dessus du Carrefour. M. Pigeonneau est persuadé qu'on a piraté son « GPS interne »." },
          choices: [
            { text: "Piraté ?! Un pigeon ?! Qui voudrait faire une chose pareille ?", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n5" },
            { text: "Il est peut-être juste devenu fan des promotions du jeudi.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n5" },
            { text: "Monsieur, un pigeon, ça n'a pas de Wi-Fi. Ah. Pardon. Continuez.", effects: { confiance: 5, interet: 5, agacement: 5 }, next: "n5" }
          ]
        },
        "n5": {
          speaker: "client",
          text: "La pie, monsieur ! LA PIE ! Elle le nargue depuis le lampadaire d'en face ! Elle a trouvé la faille de sécurité, je le SAIS. Je l'ai vue ricaner.",
          clue: { id: "pie", title: "La pie rivale", text: "Une pie locale nargue Wifi depuis le lampadaire d'en face. M. Pigeonneau la tient pour responsable du piratage. Elle ricane, paraît-il." },
          next: "n6"
        },
        "n6": {
          speaker: "client",
          text: "Alors, votre cyber-assurance, là. Elle fait QUOI pour mon Wifi ? Et ne me parlez pas en jargon, je suis un homme de terrain.",
          choices: [
            { text: "Pare-feu anti-pie inclus : détournement de vol, perte de GPS interne et harcèlement de volatile, tout est couvert.", effects: { confiance: 10, interet: 15, agacement: -5 }, next: "n7", requiresClue: "pie", lockedText: "Il vous manque le nom de l'ennemie à plumes…" },
            { text: "Elle couvre tout. Enfin, tout ce qui est écrit dans les conditions. Que je n'ai pas sous les yeux.", effects: { confiance: -5, interet: 0, agacement: 10 }, next: "n8" },
            { text: "Elle protège les champions, monsieur. Un triple médaillé ne finit pas sa carrière au-dessus d'un supermarché.", effects: { confiance: 15, interet: 10, agacement: -5 }, next: "n7", requiresClue: "wifi", lockedText: "Vous ne connaissez pas encore le palmarès du pigeon…" }
          ]
        },
        "n7": {
          speaker: "client",
          text: "Et les mises à jour, elles sont comprises ? Parce que Wifi tourne encore sous l'ancien firmware. La version 2023. La bonne.",
          choices: [
            { text: "Mises à jour de navigation incluses, plus une hotline ornithologique 7j/7. Tenue par de vrais humains, promis.", effects: { confiance: 10, interet: 10, agacement: -5 }, next: "n9" },
            { text: "La version 2023 reste la meilleure. On ne touche à rien : on sécurise, voilà tout.", effects: { confiance: 10, interet: 5, agacement: 0 }, next: "n9" }
          ]
        },
        "n8": {
          speaker: "client",
          text: "« Pas sous les yeux » ? Mon arrière-grand-père disait : celui qui ne lit pas le contrat finit DANS le contrat.",
          choices: [
            { text: "Votre arrière-grand-père était un sage. Je vous lis les conditions, article par article. J'ai tout mon temps.", effects: { confiance: 15, interet: 5, agacement: -10 }, next: "n9" },
            { text: "Il disait ça avant ou après avoir signé, votre arrière-grand-père ?", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n9" },
            { text: "Les contrats, c'est pour les méfiants, monsieur.", effects: { confiance: -10, interet: 0, agacement: 20 }, hangup: true }
          ]
        },
        "n9": {
          speaker: "client",
          text: "Bien. Et la pie ? Vous faites QUOI pour la pie ?!",
          choices: [
            { text: "Formule complète : une équipe de dé-piratage se déplace, et la pie reçoit une mise en demeure. Recommandé avec accu-réception.", effects: { confiance: 5, interet: 15, agacement: -5 }, next: "n10" },
            { text: "Rien, monsieur. La pie est hors de notre juridiction. Elle le sait. C'est pour ça qu'elle ricane.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n10" }
          ]
        },
        "n10": {
          speaker: "client",
          text: "Bon. 24,99, vous avez dit ? Pour Wifi, je signerais n'importe quoi. Enfin... lisez-moi quand même le n'importe quoi.",
          choices: [
            { text: "Article premier : Wifi est champion. Article 2 : il le restera. Le reste est technique, mais je vous l'épelle si vous voulez.", effects: { confiance: 15, interet: 10, agacement: -5 }, next: "n11", requiresClue: "wifi", lockedText: "Vous avez oublié le nom du champion…" },
            { text: "Parfait, je lance la signature électronique. Ne bougez pas. Ne roucoulez pas.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n11" },
            { text: "Allez, signez d'abord, on lira après. Comme tout le monde.", effects: { confiance: -10, interet: 0, agacement: 20 }, hangup: true }
          ]
        },
        "n11": {
          speaker: "client",
          text: "C'est conclu ! Attendez... Wifi revient ! WIFI REVIENT ! Il a dû sentir la signature !",
          next: "n12"
        },
        "n12": {
          speaker: "narrator",
          text: "Par la fenêtre du bureau de Gilbert, un pigeon passe, tourne en rond au-dessus du parking, puis repart vers l'horizon. Gilbert choisit de ne jamais raconter ça à personne."
        }
      }
    },
    {
      id: 6,
      title: "Jour 6 — L'Inspecteur",
      briefing: "Gilbert. Je ne vais pas y aller par quatre chemins : aujourd'hui, tu appelles l'inspection générale. Oui. L'INSPECTION. Le produit du jour, c'est l'Assurance Tout-Risque Existentiel, et le client te TESTE. Chaque mot compte, chaque mensonge sera noté dans un carnet, et ce carnet a fait tomber des dynasties de commerciaux. Une seule consigne : sois un bon commercial. Le reste... CONCLU.",
      objective: { name: "Assurance Tout-Risque Existentiel — formule Grand Vide", description: "Couvre le doute, le vide, l'angoisse du dimanche soir et les repas de famille.", price: "99,99 €/mois" },
      difficulty: 5,
      client: { name: "Inspecteur Froidure", subtitle: "Contrôleur des assurances. Il teste Gilbert.", emoji: "🕵️" },
      startConfiance: 10, startInteret: 5, startAgacement: 40,
      winThresholds: { confiance: 75, interet: 70, maxAgacement: 60 },
      start: "n1",
      nodes: {
        "n1": {
          speaker: "narrator",
          text: "Dernier dossier du fichier. Une seule ligne : « FROIDURE, G. — Ne pas rater cet appel. » Derrière la vitre, le chef d'agence essuie ses lunettes. Deux fois.",
          next: "n2"
        },
        "n2": {
          speaker: "client",
          text: "Gilbert Vendeur ? Georges Froidure, inspection générale des assurances. Ne vous dérangez pas : je connais déjà votre dossier. TOUT votre dossier.",
          clue: { id: "controle", title: "C'est un test", text: "L'inspecteur Froidure n'appelle jamais par hasard : il évalue les commerciaux. Chaque mot de Gilbert est noté dans un carnet." },
          next: "n3"
        },
        "n3": {
          speaker: "client",
          text: "Jouons. Je suis un « client potentiel ». Vous avez trois minutes pour me vendre votre produit du jour. Chronomètre lancé. Top.",
          choices: [
            { text: "Monsieur Froidure, avant de vendre, une question : qu'attendez-vous d'un BON commercial ?", effects: { confiance: 15, interet: 5, agacement: -5 }, next: "n4" },
            { text: "Trois minutes ? Il m'en faut deux : c'est le MEILLEUR produit du marché !", effects: { confiance: -5, interet: 5, agacement: 10 }, next: "n5" },
            { text: "Mon chronomètre, c'est votre patience. Parlez-moi de vous d'abord.", effects: { confiance: 10, interet: 5, agacement: 0 }, next: "n4" }
          ]
        },
        "n4": {
          speaker: "client",
          text: "Hmm. Une question avant le discours. C'est... inhabituel. Très bien, je réponds : j'attends l'honnêteté. J'ai vu trop de vendeurs promettre la lune, avec option balcon.",
          next: "n6"
        },
        "n5": {
          speaker: "client",
          text: "« Le meilleur » ! Vous vous entendez, Vendeur ? Mon café s'est renversé d'indignation. Noir, 6h12 précises, tous les matins, et voilà ce qu'il devient.",
          clue: { id: "cafe", title: "Le café de 6h12", text: "M. Froidure boit un café noir à 6h12 précises chaque matin. Rituel immuable. Un homme d'habitudes, et de précision." },
          next: "n6"
        },
        "n6": {
          speaker: "client",
          text: "Alors, ce produit. Combien ? Et je vous préviens : certains mots me font raccrocher. Instantanément.",
          clue: { id: "gratuit", title: "Le mot interdit", text: "Le mot « gratuit » fait raccrocher M. Froidure instantanément. « Rien n'est gratuit, jeune homme. Surtout le gratuit. »" },
          choices: [
            { text: "99,99 € par mois. Tout est dit, rien n'est caché. Voilà le prix, et il ne bougera pas.", effects: { confiance: 15, interet: 5, agacement: -5 }, next: "n7" },
            { text: "Premier mois GRATUIT, monsieur ! C'est cadeau !", effects: { confiance: 0, interet: 0, agacement: 10 }, hangup: true },
            { text: "On verra le prix ensemble, ligne par ligne. Café noir à la main, si vous en tenez un.", effects: { confiance: 15, interet: 10, agacement: -5 }, next: "n7", requiresClue: "cafe", lockedText: "Vous ne connaissez pas encore les rituels de cet homme…" }
          ]
        },
        "n7": {
          speaker: "client",
          text: "Le prix est le prix. Bien. Maintenant : que couvre votre « Assurance Tout-Risque Existentiel » ? Exactement.",
          choices: [
            { text: "Je vais être franc : personne ne sait vraiment. Même la direction. Mais elle couvre l'angoisse du dimanche soir, et ça n'a pas de prix. Enfin si : 99,99.", effects: { confiance: 10, interet: 15, agacement: 0 }, next: "n8" },
            { text: "Tout ! Absolument TOUT ! Sans AUCUNE exception !", effects: { confiance: -10, interet: 0, agacement: 15 }, next: "n9" },
            { text: "Elle couvre les risques que les autres n'osent pas nommer : le doute, le vide, les repas de famille.", effects: { confiance: 5, interet: 15, agacement: 0 }, next: "n8" }
          ]
        },
        "n8": {
          speaker: "client",
          text: "Réponse... acceptable. Continuez, Vendeur. Vous êtes moins mauvais que la moyenne. C'est presque un compliment, profitez-en.",
          next: "n10"
        },
        "n9": {
          speaker: "client",
          text: "« Tout ». « Sans exception ». Vous réalisez que vous venez de promettre l'impossible à un INSPECTEUR ?",
          choices: [
            { text: "Vous avez raison. Je retire : pas tout. Mais beaucoup. Et honnêtement. C'est déjà rare, non ?", effects: { confiance: 15, interet: 5, agacement: -10 }, next: "n10" },
            { text: "L'impossible, c'est notre spécialité chez Assur'Tout !", effects: { confiance: -10, interet: 0, agacement: 15 }, hangup: true },
            { text: "Je corrige : tout, sauf la pluie, les pigeons piratés et les divorces express.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n10" }
          ]
        },
        "n10": {
          speaker: "client",
          text: "Dernière question, Vendeur. Une cliente vous appelle en pleurs pour un cornflake renversé. Que faites-vous ?",
          choices: [
            { text: "Je l'écoute. D'abord. Le contrat vient après. Toujours après.", effects: { confiance: 15, interet: 10, agacement: -5 }, next: "n11" },
            { text: "Je lui vends la formule Premium. La tristesse se monétise, monsieur l'inspecteur.", effects: { confiance: -15, interet: 0, agacement: 20 }, hangup: true },
            { text: "Je lui rappelle qu'elle est assurée. Un cornflake assuré est un cornflake heureux.", effects: { confiance: 5, interet: 10, agacement: 0 }, next: "n11" }
          ]
        },
        "n11": {
          speaker: "client",
          text: "Hmm. Je note. Vous savez que je note tout, Vendeur ? TOUJOURS. Ce carnet a fait tomber des dynasties de commerciaux.",
          choices: [
            { text: "Alors notez ceci : Gilbert Vendeur écoute avant de vendre, et il a conclu sa semaine sans un seul mensonge.", effects: { confiance: 15, interet: 15, agacement: -5 }, next: "n12", requiresClue: "controle", lockedText: "Vous n'avez pas encore compris qui vous avez au bout du fil…" },
            { text: "Notez aussi : demain, 6h12, le café est pour moi. Noir. Deux sucres de sympathie.", effects: { confiance: 10, interet: 10, agacement: -5 }, next: "n12", requiresClue: "cafe", lockedText: "Il vous manque un détail sur les habitudes de l'inspecteur…" },
            { text: "Ce carnet a de beaux yeux, vous savez.", effects: { confiance: -5, interet: 5, agacement: 5 }, next: "n12" }
          ]
        },
        "n12": {
          speaker: "client",
          text: "Bien joué, Vendeur. Contre toute attente : CONCLU. Je signe. Et je mets un bon mot dans votre dossier. Le premier de ma carrière, savourez.",
          next: "n13"
        },
        "n13": {
          speaker: "narrator",
          text: "Le chef d'agence applaudit seul dans l'open space. Quelqu'un met la musique d'attente à fond pour fêter ça. Gilbert savoure. Demain, on lui confiera peut-être l'Assurance Contre les Revenge Calls. Mais ça, c'est une autre saison."
        }
      }
    }
  ]
};
window.GAME_DATA = GAME_DATA;
