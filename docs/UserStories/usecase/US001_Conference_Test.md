# US001_Conference_Test

## Cas de tests d'acceptance

1. En ouvrant la page d'accueil, le front affiche API test TAIA.
2. En appelant `GET /api/conference`, la reponse HTTP est `200`.
3. En appelant `GET /api/conference?nom=API`, la reponse ne retourne que les conferences correspondant au filtre.
4. En ouvrant Swagger, le endpoint `GET /api/conference` est visible avec ses query params.
5. En executant le endpoint depuis Swagger, la reponse affiche une collection JSON de conferences.