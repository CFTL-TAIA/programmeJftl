# GitHub Actions et GitHub Pages

## Statut

Cette documentation reste disponible pour l'historique du projet, mais la cible recommandee pour une vraie API est desormais Vercel serverless.

## Objectif

Publier automatiquement le projet API TAIA sur GitHub Pages a chaque push sur la branche principale.

## Fonctionnement retenu

1. GitHub Actions installe Node.js
2. Le workflow lance `npm ci`
3. Le workflow execute `npm run build`
4. Le contenu du dossier `dist/` est publie sur GitHub Pages

## Fichier de workflow

Le workflow principal est :

- `.github/workflows/deploy-pages.yml`

## Prerequis GitHub

1. Activer GitHub Pages sur le depot
2. Choisir la source `GitHub Actions`
3. Verifier que la branche par defaut est bien celle ciblee par le workflow

## Limite technique importante

Information fiable : GitHub Pages ne fait qu'heberger des fichiers statiques.

Conclusion : une API Node.js serveur ne peut pas tourner directement sur GitHub Pages.

Le montage de ce projet repose donc sur :

- un build Node.js
- un front statique
- un service worker qui simule les endpoints API

## Resultat attendu apres deploiement

- la page d'accueil affiche API test TAIA avec navigation Conference / Speakers / Salles
- les endpoints `GET /api/conference`, `GET /api/speaker` et `GET /api/salle` repondent en JSON `200`
- Swagger est disponible sous `docs/Swagger/`

## Evolution retenue

Le projet a maintenant une documentation dediee a Vercel dans `docs/Vercel.md`.