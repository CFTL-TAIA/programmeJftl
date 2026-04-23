# US003_Salles_Test

## Cas de tests d'acceptance

1. En appelant `GET /api/salle`, la reponse HTTP est `200`.
2. En appelant `GET /api/salle?etage=2`, seules les salles de l'etage 2 sont retournees.
3. En appelant `GET /api/salle?id=sal-003`, seule la salle attendue est retournee.
4. En lisant la reponse JSON, chaque salle expose son `nom`, son `etage` et sa `contenance`.
5. En ouvrant Swagger, le endpoint `GET /api/salle` est visible avec ses filtres.