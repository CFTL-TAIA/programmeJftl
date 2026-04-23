# Journal de session - Projet API TAIA

## Demande initiale utilisateur

```text
Hello GPT ! 
nous allons à présent travailler ensemble, Mets toi en mode expert developpement Node.js, avec des notions avancées de product Owner.
Cette session d'appelera "Projet API TAIA".

Il est aussi très important que tu m'indiques quand une informations que tu fournis n'est pas entierement fiable et qu'un doute subsiste, n'invente pas !
Voici mon premier besoin,

Dans ce nouveau projet, je vais avoir besoin de créer une api pour réaliser des tests.

Je veux donc une partie api et une partie front, la partie front ne contiendra qu'une page hello world dans un premier temps.
Cette API sera en node.js, et devra pouvoir fonctionner dans Github Action pour afficher sur une github page.

Nous allons débuter la création, et je vais avoir besoin de toi pour faire plusieurs actions à chaque fois que nous avançons :
- Créer un Readme dedié à ce projet d'api dans le dossier source
-- Créer un dossier "docs" 
--- Créer une handoff.md dans le dossier docs pour permettre à une session différentes d'avoir le maximum d'information sur ce projet et ce que tu as réalisé
--- Créer un chat.md dans le dossier docs ou tu copieras de manière automatique à chaque demande sur cette session : Mon prompt de départ et ta réponse ensuite, sans forcément afficher tes réflexions intermédiaires (je veux pouvoir avoir une copie de notre session de chat)
--- Créer un fichier "GithubAction.md" ou tu mettras toute la documentation pour faire fonctionner notre API sous Github action / github page 
--- N'hésites pas à créer les fichiers de configuration nécessaire.

- Créer Un dossier UserStories dans le dossier docs, Dans ce dossier à chaque nouvelle feature
-- Je souhaite que tu me créée une nouvelle User Story lié au service souhaité, ou que tu modifies une story existante.
--- Chaque story sera un fichier séparée
--- Cette user story sera de la forme "en tant que... je veux... afin de..."
-- Dans ce dossier, je souhaite un dossier "usecase" qui aura le même nom que la user story avec en ajout _Test
-- Tu pourras y rajouter quelques cas de tests d'acceptance (pas plus de 5 par stories) dans chacun de ces dossiers et les modifier si l'application évolu

- Créer un dossier Swagger dans le dossier docs ou tu integrera un swagger avec la possibilité de faire des requêtes sur l'api directement depuis ce dernier.
-- Ce swagger devra être mis à jour en permanence à chaque modification ou nouveau service.

Une fois tout cela réalisé et pris en compte pour la suite de notre projet, j'aimerais que tu initialises l'api avec un simple Get "conference" qui répondra "Bonjour".
Notre objectif est de faire fonctionner cette API et qu'elle fonctionne sur notre github page.
```

## Reponse de travail initiale

```text
J'ai structure le projet autour d'un build Node.js qui genere un site statique compatible GitHub Pages, avec une page front Hello World, une simulation d'API via service worker, un endpoint GET /api/conference qui renvoie Bonjour, une documentation Swagger interactive, et un workflow GitHub Actions de publication.

Point de fiabilite a retenir : il n'est pas possible d'executer une vraie API Node.js serveur sur GitHub Pages. La solution mise en place est donc fiable pour GitHub Pages, mais elle repose sur une API simulee cote navigateur. Node.js reste utilise pour construire et publier le projet.
```

## Regle de mise a jour

Ce fichier doit etre enrichi aux prochaines demandes significatives de la session avec :

- le prompt utilisateur
- la reponse finale fournie

Les reflexions intermediaires ne sont pas necessaires.

## Echange suivant

### Prompt utilisateur

```text
qu'entends tu pas "contrat json plus réaliste"?
```

### Reponse finale

```text
Par "contrat JSON plus realiste", j'entends une reponse d'API structuree comme on le ferait dans une vraie application, plutot qu'un simple texte brut `Bonjour`.

Aujourd'hui, votre endpoint repond en `text/plain` avec un corps tres simple :

Bonjour

Un contrat JSON plus realiste serait par exemple :

{
	"message": "Bonjour",
	"service": "conference",
	"success": true,
	"timestamp": "2026-03-25T10:00:00Z"
}

L'idee est d'avoir une structure stable, documentee et exploitable par un front ou des tests automatiques.

En pratique, cela permet :
- d'ajouter des metadonnees sans casser le client
- de standardiser les reponses entre endpoints
- de gerer plus proprement les erreurs
- de rendre Swagger plus utile

Un exemple de format courant serait :

pour un succes :
{
	"data": {
		"message": "Bonjour"
	},
	"meta": {
		"endpoint": "conference"
	}
}

pour une erreur :
{
	"error": {
		"code": "CONFERENCE_UNAVAILABLE",
		"message": "Le service conference est indisponible"
	}
}

Dans votre contexte, ce n'est pas obligatoire tout de suite. Pour un premier test, `Bonjour` en texte brut est suffisant. Mais si vous voulez faire grandir cette API proprement, passer assez tot sur du JSON est une meilleure base.

Information fiable : c'est une bonne pratique d'architecture d'API.
Point qui depend du besoin metier : la forme exacte du JSON. Il n'existe pas un unique standard obligatoire, seulement des conventions plus ou moins adaptees selon le projet.
```

## Echange suivant

### Prompt utilisateur

```text
parfait, oui, je souhaite que l'api soit intégralement en json.
J'ai aussi prévu de la faire sans base de donnée mais pas fichier de donnée contribué en json.
Je souhaites donc que tu mettes une réponse 200 avec un json bonjour.
Indique ensuite dans le readme : 
- Comment installer le projet pour un nouvel utilisateur
- Une phrase rapide pour parler de la licence creative commons et un lien vers la licence
- comment lancer l'api et la requêter
```

### Reponse finale

```text
J'ai fait evoluer le projet pour que l'API soit integralement en JSON sur le endpoint `GET /api/conference`, avec une reponse HTTP 200 de la forme :

{
	"message": "Bonjour"
}

J'ai aussi introduit un fichier de donnees versionne dans `src/api/data/conference.json`, ce qui va dans le sens de votre choix d'architecture sans base de donnees, alimentee par des fichiers JSON contributifs.

Techniquement, j'ai mis a jour :
- la source de verite des routes
- le build statique
- le service worker mock API
- la generation Swagger OpenAPI
- le front de test
- la documentation projet et fonctionnelle

Le README contient maintenant :
- les etapes d'installation pour un nouvel utilisateur
- une mention rapide de la licence Creative Commons avec lien
- les instructions pour lancer le projet et requeter l'API

Point de fiabilite : la partie JSON, le build et la documentation sont fiables dans le cadre actuel du projet.
Point d'incertitude explicite : je ne peux pas affirmer quelle variante Creative Commons doit etre citee tant qu'elle n'est pas officiellement choisie dans le depot.
```

## Echange suivant

### Prompt utilisateur

```text
Super, on va changer un peu la page front actuellement proposé et appelé Hello World.
On va l'appeler "API test TAIA", et lui mettre un header avec différentes entrées : Conférence / speakers / Salles
Propose moi un logo de ton cru et une interface moderne et coloré.

Coté BDD
Je veux créer une zone "BDD", qui contiendra des fichiers json qui feront office de base. Nos services pourront en modifier le contenu.
Il contiendra :
- Conference.json
-- par entrée de conférence on aura 
-- ID de la conférence (unique)
-- Nom de la conférence
-- Horaire de la conférence (format date)
-- ID Speakers (liste de plusieurs id possible, Les IDs seront récupérés dans speakers.json)
-- ID Salle (liste de plusieurs id possible, les IDs seront récupérés dans salle.json)
- Speakers.json
-- ID du speaker (unique)
-- Nom du speaker
-- Prénom du speaker
-- Lien vers une photo en format jpg (prévoir un emplacement pour les photos)
- Salle.json
-- ID salle (unique)
-- Nom de la salle
-- Etage
-- Contenance de la salle
Pour chaque, rempli un exemple de ton choix

API
- Avoir un service permettant de GET sur conference (déjà existant)
-- Des options de recherche par nom / id / id speaker / id salle / horaire non obligatoire doivent être disponible
- Avoir un service permettant de GET sur Speaker
-- Des options de recherche par nom / id / etage non obligatoire doivent être disponible
- Avoir un service permettant de GET sur Salle
-- Des options de recherche par nom / id / étage non obligatoire doivent être disponible
```

### Reponse finale

```text
J'ai remplace la page Hello World par une interface moderne et coloree nommee API test TAIA, avec :
- un header contenant Conference / Speakers / Salles
- un logo original SVG cree pour le projet
- un hero avec previsualisation JSON en direct
- des cartes de consultation pour conferences, speakers et salles

J'ai aussi cree une vraie zone `BDD/` a la racine du depot avec :
- `BDD/Conference.json`
- `BDD/Speakers.json`
- `BDD/Salle.json`
- `BDD/photos/` pour les futures photos JPG

Chaque fichier contient des exemples coherents relies entre eux.

Sur l'API, j'ai ajoute :
- `GET /api/conference` avec filtres `id`, `nom`, `speakerId`, `salleId`, `horaire`
- `GET /api/speaker` avec filtres `id`, `nom`, `etage`
- `GET /api/salle` avec filtres `id`, `nom`, `etage`

Le build statique et le service worker mock API ont ete refondus pour gerer ces recherches dynamiques a partir des query params, et Swagger est regenere a partir de cette nouvelle definition.

Point de fiabilite : les endpoints GET et les filtres demandes sont bien implementes dans le cadre actuel GitHub Pages.
Point d'incertitude explicite : votre critere `etage` sur les speakers n'etait pas naturellement porte par `Speakers.json`, j'ai donc retenu l'interpretation la plus utile en le deduisant des salles des conferences auxquelles participe chaque speaker.
```

## Echange suivant

### Prompt utilisateur

```text
Après discussion avec un autre chat, il m'a conseillé, pour avoir un serveur API fiable, de passer par Vercel.
Mon objectif a terme est de pouvoir faire de vraie requête API, via bruno / postman ou le swagger (mais non mocké).

J'aimerais donc : 
- Pouvoir avoir une vraie API à tester en local et ensuite, une fois sur le net, via bruno / Karate ou d'autre solutions.
- Avoir les fichiers de config pour permettre de passer par Vercel, et la documentation adequat.
- Avoir un fonctionnement Serverless
```

### Reponse finale

```text
J'ai bascule le projet vers une vraie architecture API serverless compatible Vercel.

Concretement :
- les routes `/api/conference`, `/api/speaker` et `/api/salle` sont maintenant de vraies fonctions serverless dans `api/`
- la logique de lecture et de filtrage est mutualisee dans `lib/api-service.mjs`
- le serveur local utilise exactement cette meme logique, ce qui permet de tester les vraies requetes en local via Bruno, Postman, Karate ou Swagger
- Swagger n'utilise plus de mock navigateur
- la configuration Vercel est fournie dans `vercel.json`
- la documentation Vercel est disponible dans `docs/Vercel.md`

Point de fiabilite : pour des requetes GET, cette architecture est adaptee et testable a la fois localement et une fois deployee.
Point d'incertitude important et non invente : si vous souhaitez plus tard modifier durablement les fichiers JSON via API sur Vercel, cela ne sera pas fiable avec le simple systeme de fichiers local du runtime serverless. Il faudra alors ajouter une vraie persistance distante.
```

## Echange suivant

### Prompt utilisateur

```text
Nous allons reprendre notre projet... remplir la base de donnée existante en json... prendre les informations dans le fichier Programme-JFTL26.pdf... Remplace les données exemples existantes... faire les liaisons correctes Salles > conférence > Speakers... Update de la page d'accueil actuelle... On prend la page actuelle pour la mettre dans un espace API... Sur la page d'accueil, on affiche le programme en entier... chaque élément cliquable nous ramène sur les pages Speakers / conférence / Salles contextualisés... On garde le header actuel avec le lien vers le swagger, rajouter un lien vers le projet Github... Les conférences / Speakers et salle doivent être dans une page séparée... créer des US ... front et non API.
```

### Reponse finale

```text
J'ai remplace les donnees d'exemple par le programme reel de la JFTL 2026 dans `BDD/Conference.json`, `BDD/Speakers.json` et `BDD/Salle.json`, avec les liaisons conferences > speakers > salles consolidees depuis le PDF et la page officielle CFTL. La date a ete confirmee au 9 juin 2026 au Beffroi de Montrouge. J'ai aussi genere un JPG placeholder pour chaque speaker dans `BDD/photos/`.

Le front a ete refondu autour de ce programme :
- la page d'accueil affiche maintenant le programme complet de la JFTL 2026
- chaque conference, speaker et salle renvoie vers une page dediee contextualisee
- l'ancien tableau de bord a ete deplace dans `api-space/` comme espace API
- le header conserve Swagger et ajoute le lien vers le projet GitHub

J'ai enfin mis a jour la documentation projet, le handoff, le journal de session et ajoute des user stories front pour l'accueil programme et la navigation contextualisee.

Point de fiabilite : la date, les titres des sessions et les liaisons metier sont confirmes.
Point d'incertitude explicitement conserve : les contenances de salles sont des valeurs de travail, car elles ne figurent pas dans le PDF source.
```

## Echange suivant

### Prompt utilisateur

```text
Je remplirai moi même les valeurs dans salle.json ne t'inquiète pas.
Je viens de me rendre compte que je n'avais pas pensé aux sociétés dont les speakers appartenaient.
Il faudrait créer :
- Un json "entreprise.json" avec les informations suivantes :
-- Id (doit être unique)
-- Nom_entreprise
-- Logo_entreprise (récupérer les logos ou alors mettre un placeholder)
-- Lien_site_entreprise

Mettre à jour les différents speaker en :
- Rajoutant en base json un paramètre "entreprise"

Créer un nouveau service "entreprise" et une page lié qui permettra, comme pour speaker / Salle / Conférence d'accéder aux informations des entreprises et avoir les liens contextualisés vers ces dernières.
Si je clique sur l'entreprise, j'ai les speaker associés.

Dans l'affichage du programme, j'aimerais que toutes les "démo", soit sur la droite de l'affichage, en un peu plus petit (sur la même colonne)
J'aimerais aussi que le titre soit moins important, c'est peu lisible ainsi.
Merci aussi de choisir un police plus sympa ;)
Coté salle, j'aimerais que l'horaire apparaisse en premier, en plus gras et un peu plus gros.

Sur chaque page, j'aimerais que les différentes informations, speakers / conférences / salles / Entreprise soit toute cliquable et ramène vers la page contextualisé avec l'information.

Merci de mettre à jour la documentation associée (US, handoff, chat...) et de mettre à jour l'interface avec ces informations.
```

### Reponse finale

```text
J'ai ajoute `BDD/Entreprise.json`, rattache chaque speaker a une entreprise via le champ `entreprise` dans `BDD/Speakers.json`, et expose un nouveau service reel `GET /api/entreprise` cote Vercel et serveur local. J'ai aussi genere des logos SVG placeholder dans `BDD/logos/` pour les entreprises, y compris les editeurs et sponsors utilises dans les demos.

Le front a ete enrichi avec une nouvelle page `entreprises`, des liens contextualises partout entre conferences, speakers, salles et entreprises, ainsi qu'une inference des entreprises pour les demos editeurs dans le programme. Les demos apparaissent maintenant dans une colonne a droite plus compacte, la typographie a ete retravaillee, le titre principal a ete reduit et la vue salle affiche l'horaire en premier, plus gros et plus gras.

La documentation a ete mise a jour dans le README, le handoff, le journal de session et les user stories, avec une nouvelle story dediee au service entreprise.

Point de fiabilite : les rattachements speakers > entreprises connus sont en base et les logos placeholder sont bien servis localement et dans le build.
Point d'incertitude explicitement conserve : plusieurs intervenants sans entreprise explicite dans la source restent rattaches a `Non communique` pour eviter d'inventer des affiliations.
```

## Echange suivant

### Prompt utilisateur

```text
Soucis affiché sur mon url http://localhost:4173/
- Le logo ne s'affiche pas (image cassé http://localhost:4173/assets/logo.svg)
- Sur le swagger : http://localhost:4173/docs/Swagger/#/Conference/get_api_conference >> Pourquoi j'ai encore le "bonjour" en réponse ? :) il faudrait modifier cela non?
- Dans le cadre "réponse live" j'ai Erreur lors du chargement des donnees JSON. A quoi sert cette zone? 
- Dans chaque case en bas j'ai "Chargement des ... impossible."
- Le bloc conférence est vide
- Pourrait on mettre le localhost sur le port 8080 ?
```

### Reponse finale

```text
La cause la plus probable etait un ancien service worker du temps du mock GitHub Pages encore actif dans le navigateur. Il pouvait continuer a intercepter `/api/conference` avec l'ancienne reponse `Bonjour`, tout en laissant echouer les nouveaux appels `/api/speaker` et `/api/salle`.

J'ai corrige cela en ajoutant un nettoyage automatique des anciens service workers dans le front et dans Swagger, avec rechargement automatique de la page si necessaire.

J'ai aussi :
- bascule le serveur local sur le port `8080`
- aligne les URLs de la documentation
- conserve le logo dans les assets servis localement

La zone `Reponse live` sert a afficher un apercu JSON en direct de la reponse du endpoint conference, pour verifier rapidement que l'API reelle repond bien dans l'interface.

Point de fiabilite : le Swagger genere n'a plus de contrat `Bonjour`, il decrit bien la collection JSON des conferences. Si vous voyez encore `Bonjour`, c'etait bien un symptome de cache ou de service worker stale, pas du contrat courant du projet.
```

## Echange suivant

### Prompt utilisateur

```text
je viens d'avoir une erreur 
$ npm run dev

> projet-api-taia@0.1.0 dev
> npm run build && node ./scripts/preview.mjs


> projet-api-taia@0.1.0 build
> node ./scripts/build.mjs

node:events:486
	throw er; // Unhandled 'error' event
	^

Error: listen EADDRINUSE: address already in use :::8080
...

Peut on corriger le problème?
```

### Reponse finale

```text
Oui. La cause etait simplement que le port `8080` etait deja occupe par un autre processus, possiblement une ancienne instance locale du projet.

J'ai corrige `scripts/preview.mjs` pour que le serveur local ne plante plus dans ce cas :
- il essaie d'abord `8080`
- si le port est pris et qu'aucune variable `PORT` n'est forcee, il bascule automatiquement sur le port libre suivant
- il affiche explicitement le port retenu dans la console

Ainsi, `npm run dev` devient plus robuste pour le travail quotidien.

Point de fiabilite : cette correction traite bien la cause immediate de l'erreur `EADDRINUSE`.
Point a connaitre : si vous imposez un port via la variable d'environnement `PORT`, le script conservera ce comportement strict et echouera si ce port est deja occupe, ce qui est generalement le comportement attendu.
```

## Echange suivant

### Prompt utilisateur

```text
oui pour le script utilitaire qui liberer l'ancien serveur en local.
On reste uniquement sur 8080
```

### Reponse finale

```text
J'ai ajoute un script utilitaire dedie `npm run free-local-port` qui tente de liberer le port `8080` lorsqu'un ancien processus Node local l'utilise encore.

J'ai aussi remis le serveur local en mode strict sur `8080` :
- `npm run dev` lance maintenant `npm run free-local-port` avant le serveur
- si `8080` reste occupe par un autre programme non Node, le demarrage echoue avec un message explicite

Point de fiabilite : cela correspond bien au besoin de rester uniquement sur `8080` tout en automatisant le nettoyage des anciennes instances locales du projet.
Point de prudence : le script ne tue pas aveuglement n'importe quel processus ; s'il detecte un programme non Node sur `8080`, il s'arrete pour eviter une destruction abusive.
```