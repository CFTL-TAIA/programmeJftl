# Handoff - Projet API TAIA

## Perimetre courant

- Front moderne avec une page d'accueil programme JFTL 2026
- Un espace API separe pour documenter les endpoints
- Des pages separees pour conferences, speakers, salles et entreprises
- Vraie API locale et serverless compatible Vercel
- Zone BDD JSON a la racine du projet
- Endpoints `GET /api/conference`, `GET /api/speaker`, `GET /api/salle` et `GET /api/entreprise`
- Endpoints d'admin `GET /api/admin/token` et `POST /api/admin/token`
- Endpoints ecriture `POST`, `PUT`, `DELETE` sur conference, speaker, salle et entreprise
- Documentation Swagger interactive
- Configuration Vercel pour deploiement serverless

## Architecture retenue

- Node.js est utilise pour construire le site statique et pour executer l'API localement
- Vercel expose les routes `/api/*` comme fonctions serverless reelles
- Les reponses API sont construites depuis des fichiers de donnees JSON versionnes dans `BDD/`
- Le serveur local `scripts/preview.mjs` reutilise la meme logique que les fonctions serverless
- Le Swagger consomme le fichier OpenAPI genere et peut executer des requetes vers la vraie API sur le meme site
- Le filtre `etage` sur les speakers est deduit des salles associees a leurs conferences
- Les speakers portent maintenant un rattachement `entreprise` et le front reconstruit les liaisons conference > entreprise depuis les speakers ou les titres de demo
- Les conferences portent maintenant un champ `type` persiste dans `BDD/Conference.json`
- L'admin repose sur un JWT quotidien a scopes : `editor` pour modifier, `admin-plus` pour creer et supprimer en plus
- Les mots de passe admin sont exclusivement attendus via variables d'environnement cote serveur

## Sources principales

- `src/api/routes.mjs` : source de verite des endpoints
- `api/` : fonctions serverless Vercel
- `lib/api-service.mjs` : logique de lecture et de filtrage partagee
- `lib/openapi.mjs` : generation OpenAPI partagee
- `BDD/` : donnees JSON servant de base aux reponses et emplacement des photos et logos
- `scripts/build.mjs` : generation du site et du fichier OpenAPI
- `src/site/` : front programme, espace API et pages detaillees
- `docs/Swagger/index.html` : interface Swagger
- `vercel.json` : configuration de build et de runtime

## Commandes utiles

```bash
npm run build
npm run free-local-port
npm run dev
```

## Points d'attention

- Toute nouvelle route doit etre ajoutee dans `src/api/routes.mjs`, puis implementee ou branchee dans `api/`
- Toute evolution de l'admin doit conserver l'absence de secret dans le code, Swagger et les docs versionnees
- Toute modification durable de la BDD via API necessitera une persistance externe, car les fichiers locaux sur Vercel ne sont pas fiables pour l'ecriture persistante
- Les JSON de `BDD/` sont adaptes pour la lecture et pour les tests locaux
- Les ecritures API locales sont maintenant validees cote serveur avant persistance des fichiers JSON
- Le programme source correspond a la JFTL du 9 juin 2026 au Beffroi de Montrouge, reconstruit depuis `docs/Programme-JFTL26.pdf` puis consolide avec la page officielle CFTL
- Les liaisons conferences > speakers > salles sont a jour dans les trois fichiers JSON de `BDD/`
- Les liaisons speakers > entreprises sont presentes dans `BDD/Speakers.json` et `BDD/Entreprise.json`
- Une partie des medias de `BDD/photos/` et `BDD/logos/` a ete remplacee par des assets verifies issus du site CFTL JFTL ; les entrees non confirmees restent en placeholders et peuvent etre remplacees unitairement sans modifier les IDs
- Les contenances de salles sont des valeurs de travail conservees dans `Salle.json`, car absentes du PDF source
- En local, un ancien service worker navigateur peut polluer les tests tant qu'il n'est pas desinscrit ; le front et Swagger declenchent maintenant ce nettoyage automatiquement
- En local, `npm run dev` tente d'abord de liberer le port `8080` si un ancien serveur Node TAIA y est encore attache
- En local comme sur Vercel, les variables `TAIA_ADMIN_EDITOR_PASSWORD` et `TAIA_ADMIN_SUPER_PASSWORD` doivent etre configurees pour utiliser l'admin
- En local, `.env.local` est auto-charge par `scripts/build.mjs`, `scripts/preview.mjs` et `scripts/print-admin-token.mjs` ; `.env.local.example` sert de modele et `.env.local` est ignore par Git
- Le site CFTL JFTL peut servir de source fiable de decouverte pour les photos de speakers et certains logos d'entreprises, car les assets sont publies en URLs directes dans le HTML WordPress ; garder toutefois une vigilance sur les droits d'usage et sur le choix de la variante canonique parmi `srcset` et fichiers `-scaled`

## Prochaines etapes pertinentes

- Brancher une persistance distante si l'admin doit ecrire de maniere fiable sur Vercel
- Ajouter des tests automatiques de filtrage, d'authentification et de scopes admin
- Ajouter des tests de navigation front pour les pages programme, conferences, speakers, salles, entreprises et admin