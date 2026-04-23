import './load-local-env.mjs';
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import conferenceHandler from '../api/conference.js';
import adminMediaHandler from '../api/admin-media.js';
import adminTokenHandler from '../api/admin-token.js';
import entrepriseHandler from '../api/entreprise.js';
import speakerHandler from '../api/speaker.js';
import salleHandler from '../api/salle.js';

const port = Number(process.env.PORT || 8080);
const root = normalize(join(process.cwd(), 'dist'));

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

function resolveFilePath(urlPath) {
  const cleaned = urlPath === '/' ? '/index.html' : urlPath;
  const candidate = normalize(join(root, cleaned));

  if (!candidate.startsWith(root)) {
    return null;
  }

  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate;
  }

  const indexCandidate = normalize(join(candidate, 'index.html'));
  if (existsSync(indexCandidate)) {
    return indexCandidate;
  }

  return null;
}

const apiHandlers = new Map([
  ['/api/admin/media', adminMediaHandler],
  ['/api/admin/token', adminTokenHandler],
  ['/api/conference', conferenceHandler],
  ['/api/entreprise', entrepriseHandler],
  ['/api/speaker', speakerHandler],
  ['/api/salle', salleHandler]
]);

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const apiHandler = apiHandlers.get(requestUrl.pathname);

  if (apiHandler) {
    apiHandler(request, response);
    return;
  }

  const filePath = resolveFilePath(requestUrl.pathname);

  if (!filePath) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream'
  });

  createReadStream(filePath).pipe(response);
});

server.once('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} deja occupe. Lancez d'abord npm run free-local-port ou fermez le processus qui utilise ce port.`);
  }

  throw error;
});

server.listen(port, () => {
  console.log(`Preview disponible sur http://localhost:${port}`);
});