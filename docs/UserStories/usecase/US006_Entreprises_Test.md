# US006_Entreprises_Test

## Cas de tests d'acceptance

1. En appelant `GET /api/entreprise`, la reponse HTTP est `200` et retourne une collection JSON.
2. En appelant `GET /api/entreprise?nomEntreprise=Open`, la reponse retourne l'entreprise correspondante.
3. En appelant `GET /api/entreprise?speakerId=spk-bruno-legeard`, la reponse retourne l'entreprise du speaker.
4. En ouvrant la page `entreprises`, un clic sur une carte ouvre la vue detaillee contextualisee.
5. Depuis la page d'une entreprise, les speakers et conferences affiches sont cliquables.