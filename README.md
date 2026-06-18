# حكي جديد — Hakî Jdîd

Ton site personnel de révision d'arabe jordanien (dialecte levantin), généré à partir de tes cours LACC Amman + un module de vocabulaire infirmier + un quiz.

> 🔒 **Important sur la confidentialité** : GitHub Pages gratuit héberge uniquement des dépôts **publics**. Le mot de passe ci-dessous est une barrière simple (il évite qu'un visiteur tombe sur le contenu par hasard), mais ce n'est **pas** une vraie sécurité — quelqu'un de déterminé qui regarde le code source du dépôt pourrait y accéder. Si tu veux une vraie confidentialité, il faudrait un compte GitHub payant (Pro) avec un dépôt privé + Pages.

---

## 1. Mettre le site en ligne (GitHub Pages)

1. Crée un compte GitHub si tu n'en as pas déjà un : [github.com](https://github.com)
2. Crée un **nouveau dépôt** (bouton vert "New repository") :
   - Nom au choix (ex. `mes-cours-arabe`)
   - Laisse-le en **Public** (obligatoire pour Pages gratuit)
   - Ne coche pas "Add a README" (on en a déjà un)
3. Sur la page du dépôt vide, clique sur **"uploading an existing file"** et glisse-dépose **tout le contenu de ce dossier** (pas le dossier lui-même, son contenu : `index.html`, `css/`, `js/`, `audio/`, `img/`, `README.md`)
4. Clique sur **Commit changes**
5. Va dans **Settings → Pages** (menu de gauche)
6. Sous "Build and deployment", choisis **Branch: main**, dossier **/ (root)**, puis **Save**
7. Patiente 1-2 minutes, puis ton site sera visible à une adresse du type :
   `https://ton-pseudo.github.io/mes-cours-arabe/`

C'est tout ! Pas de build, pas d'installation, pas de ligne de commande nécessaire.

---

## 2. Le mot de passe

Le mot de passe actuel est : **`jordanie2025`**

### Pour le changer :
1. Ouvre ton site dans le navigateur
2. Appuie sur **F12** (ouvre les outils développeur), va dans l'onglet **Console**
3. Tape cette ligne et appuie sur Entrée :
   ```js
   await sha256("ton-nouveau-mot-de-passe")
   ```
4. Une longue chaîne de lettres/chiffres apparaît — copie-la
5. Ouvre le fichier `js/auth.js` sur GitHub (clique sur le fichier, puis le crayon ✏️ pour éditer)
6. Remplace la valeur de `PASSWORD_HASH` par celle que tu viens de copier
7. Commit les changements

---

## 3. Ajouter les fichiers audio de tes cours

Dépose simplement tes fichiers `.mp3` dans le dossier `/audio/` du dépôt (glisser-déposer via l'interface GitHub, comme à l'étape 1), **en respectant exactement ces noms de fichiers** :

### Cours d'arabe
| Fichier à déposer | Cours |
|---|---|
| `sheet1.mp3` | Cours 1 — Pronoms personnels & verbe manger |
| `sheet2.mp3` | Cours 2 — Famille, salutations & vaisselle |
| `sheet3.mp3` | Cours 3 — Transport, verbes d'action & mobilier |
| `sheet4.mp3` | Cours 4 — Fruits, légumes & prépositions de lieu |
| `sheet5.mp3` | Cours 5 — Directions & verbes (donner, prendre, mettre) |
| `sheet6.mp3` | Cours 6 — La maison & ses pièces |
| `sheet7.mp3` | Cours 7 — Verbes du quotidien, animaux & nature |
| `sheet8.mp3` | Cours 8 — Argent & monnaie jordanienne |
| `sheet9.mp3` | Cours 9 — Ménage, électroménager & le temps |
| `sheet10.mp3` | Cours 10 — Le visage & les parties du corps |
| `sheet11.mp3` | Cours 11 — La tête, le corps & les membres |
| `sheet12.mp3` | Cours 12 — La famille élargie |
| `sheet13.mp3` | Cours 13 — Grands-parents, cousins & couples |

### Vocabulaire infirmier
| Fichier à déposer | Fiche |
|---|---|
| `nurse1.mp3` | Accueillir le patient |
| `nurse2.mp3` | Rassurer le patient |
| `nurse3.mp3` | Questions de base sur l'état |
| `nurse4.mp3` | Évaluer la douleur |
| `nurse5.mp3` | Donner des instructions simples |
| `nurse6.mp3` | Formules de politesse en soins |

Dès qu'un fichier portant le bon nom est présent dans `/audio/`, le lecteur audio apparaît automatiquement sur la page du cours correspondant — rien d'autre à faire.

---

## 4. Les illustrations (à venir)

Comme convenu, cette première version **n'a pas d'illustrations**. Le dossier `/img/` est prêt à les recevoir plus tard. Quand tu voudras t'y attaquer, reviens vers Claude avec ce dépôt et on ajoutera des pictogrammes simples (SVG, légers) pour chaque mot.

---

## 5. Le vocabulaire infirmier — ⚠️ à faire vérifier

Les phrases de la section "Infirmier" sont des **constructions originales** de Claude, basées sur les structures grammaticales déjà vues dans tes cours — elles n'ont **pas été validées par un·e professeur·e natif·ve**. Avant de les utiliser en stage, montre-les à Leen, Motea ou Ziena pour :
- Confirmer que la prononciation/transcription est correcte
- Vérifier que le registre est adapté (formel/poli) pour un contexte de soin

Tu peux ensuite me redonner les corrections et je mettrai à jour le fichier `js/nursing-data.js`.

---

## 6. Compléter les mots manquants

212 mots ont été importés depuis ton fichier Excel, mais **36 d'entre eux** (cours 11, 12, 13 surtout) n'avaient pas encore de transcription/traduction — probablement des mots vus en cours mais pas encore notés. Ils apparaissent sur le site avec un badge **"✏️ à compléter"**.

Pour les compléter : note les infos manquantes (avec ta prof ou tes enregistrements), puis redonne-les à Claude avec la référence du cours (ex. "Cours 12, mot #3 : ظهر = dhahar = le dos") et je mettrai à jour le site.

---

## 7. Comment fonctionne le suivi de progression et le quiz

- Sur chaque mot, tu peux cliquer **✓ Je connais** ou **↻ À revoir** — c'est sauvegardé localement dans ton navigateur (pas besoin de compte).
- Le quiz priorise légèrement les mots marqués "à revoir" et ceux jamais vus.
- ⚠️ Cette progression est stockée **dans le navigateur** (localStorage). Si tu vides le cache ou changes d'appareil/navigateur, elle repart à zéro. C'est une limite des sites statiques sans base de données — fais-moi signe si tu veux qu'on ajoute une vraie sauvegarde plus tard.

Bon courage pour la reprise en septembre ! 🌿
