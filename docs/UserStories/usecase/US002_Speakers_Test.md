# US002_Speakers_Test

## Cas de tests d'acceptance

1. En appelant `GET /api/speaker`, la reponse HTTP est `200`.
2. En appelant `GET /api/speaker?nom=Camille`, le speaker Camille Renaud est retourne.
3. En appelant `GET /api/speaker?id=spk-002`, seul le speaker attendu est retourne.
4. En appelant `GET /api/speaker?etage=1`, seuls les speakers lies a des conferences en salle d'etage 1 sont retournes.
5. En ouvrant Swagger, le endpoint `GET /api/speaker` est visible avec ses filtres.