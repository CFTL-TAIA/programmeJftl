# Vercel - API serverless TAIA

## Objectif

Deployer le projet sur Vercel avec :

- un front statique genere dans `dist/`
- de vraies routes API serverless sous `/api/*`
- une documentation Swagger pointant vers les vrais endpoints
- un systeme admin base sur deux mots de passe fournis par variables d'environnement

## Configuration technique retenue

- `vercel.json` definit `npm run vercel-build` comme commande de build
- `dist/` est le repertoire de sortie du front
- `api/*.js` contient les fonctions serverless exposees publiquement
- `lib/` contient la logique partagee entre Vercel, le preview local et Swagger

## Premiere mise en place sur Vercel

1. Creer un projet Vercel connecte au depot GitHub.
2. Laisser Vercel detecter un projet Node.js.
3. Verifier les parametres suivants :
   - Build Command : `npm run vercel-build`
   - Output Directory : `dist`
4. Ouvrir le projet Vercel puis aller dans `Settings` > `Environment Variables`.
5. Ajouter les deux variables suivantes :
   - `TAIA_ADMIN_EDITOR_PASSWORD`
   - `TAIA_ADMIN_SUPER_PASSWORD`
6. Saisir vos vraies valeurs secretes pour chaque environnement cible.
7. Relancer un deploiement apres ajout ou modification des variables.

## Recommandation d'environnements

Pour un premier deploiement propre :

- definir les deux variables au minimum pour `Production`
- definir aussi les deux variables pour `Preview` si vous voulez tester l'admin sur les branches ou pull requests
- ne jamais mettre les vraies valeurs dans le depot, Swagger, README ou les user stories

## Verification apres deploiement

1. Ouvrir l'URL Vercel racine et verifier le chargement du programme.
2. Tester les endpoints publics :
   - `/api/conference`
   - `/api/speaker`
   - `/api/salle`
   - `/api/entreprise`
3. Ouvrir `/api/admin/token` et verifier que la reponse expose seulement :
   - `dateStamp`
   - `scopes`
   - `requiredEnvironment`
4. Ouvrir `/admin/`, saisir le mot de passe `editor`, puis verifier l'acces a `Modifier`.
5. Saisir le mot de passe `admin-plus`, puis verifier l'acces a `Modifier`, `Creer` et `Supprimer`.
6. Ouvrir `/docs/Swagger/` pour tester les routes avec la vraie API deployee.

## Utilisation avec Swagger sur Vercel

1. Generer un JWT depuis `/admin/` ou par `POST /api/admin/token`.
2. Copier uniquement la valeur du token.
3. Dans Swagger, utiliser `Authorize` avec `Bearer <token>`.
4. Tester ensuite `POST`, `PUT` et `DELETE` selon le scope obtenu.

## Notes sur le local

En local, le projet peut charger automatiquement `.env.local` a la racine.

Vercel ne lit pas ce fichier depuis le depot pour vos secrets runtime :

- les secrets locaux restent dans `.env.local`
- les secrets Vercel doivent etre configures dans le dashboard Vercel

## Limite technique importante

Information fiable : Vercel serverless permet de servir correctement les endpoints HTTP et convient bien a ce projet pour les lectures JSON et les tests d'API.

Contrainte produit a retenir : l'ecriture dans les fichiers JSON locaux n'est pas une persistance fiable sur Vercel, car le systeme de fichiers d'execution est ephemere.

Conclusion :

- lecture JSON : adaptee localement et sur Vercel
- ecriture JSON persistante sur Vercel : non fiable

Si vous souhaitez conserver durablement les creations, modifications et suppressions faites depuis l'admin sur Vercel, il faudra brancher une persistance distante comme Vercel KV, Postgres, Blob ou une autre base externe.

## Checklist rapide premier deploiement

1. `npm run build` passe localement
2. `npm run dev` fonctionne sur `http://localhost:8080`
3. `TAIA_ADMIN_EDITOR_PASSWORD` configure sur Vercel
4. `TAIA_ADMIN_SUPER_PASSWORD` configure sur Vercel
5. deploy relance apres ajout des variables
6. test de `/api/admin/token` effectue
7. test Swagger effectue sur l'URL Vercel