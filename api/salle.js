import { handleResourceRequest } from '../lib/resource-http-handler.mjs';

export default async function handler(request, response) {
  await handleResourceRequest(request, response, 'salle', 'getSalles', '/api/salle');
}