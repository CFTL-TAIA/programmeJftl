import crypto from 'node:crypto';

const scopeDefinitions = {
  editor: {
    envVar: 'TAIA_ADMIN_EDITOR_PASSWORD',
    permissions: ['read', 'update']
  },
  'admin-plus': {
    envVar: 'TAIA_ADMIN_SUPER_PASSWORD',
    permissions: ['read', 'update', 'create', 'delete']
  }
};

function getConfiguredPassword(scope) {
  const definition = scopeDefinitions[scope];

  if (!definition) {
    throw new Error(`Scope admin inconnu: ${scope}.`);
  }

  const password = process.env[definition.envVar]?.trim();

  if (!password) {
    throw new Error(`Configuration admin absente: variable ${definition.envVar} requise.`);
  }

  return password;
}

function getScopePermissions(scope) {
  const definition = scopeDefinitions[scope];

  if (!definition) {
    throw new Error(`Scope admin inconnu: ${scope}.`);
  }

  return definition.permissions;
}

function resolveScopeFromPassword(password) {
  for (const scope of ['admin-plus', 'editor']) {
    if (password === getConfiguredPassword(scope)) {
      return scope;
    }
  }

  throw new Error('Mot de passe admin invalide.');
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_');
}

function base64UrlDecode(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, 'base64').toString('utf8');
}

function getDateStamp(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function signSegment(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function getDailySecret(scope, dateStamp = getDateStamp()) {
  return `${getConfiguredPassword(scope)}:${scope}:${dateStamp}`;
}

export function createDailyAdminToken(scope = 'editor', dateStamp = getDateStamp()) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: 'taia-admin',
    scope,
    permissions: getScopePermissions(scope),
    date: dateStamp,
    iat: Math.floor(Date.now() / 1000)
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signSegment(`${encodedHeader}.${encodedPayload}`, getDailySecret(scope, dateStamp));
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function issueAdminToken(password) {
  const scope = resolveScopeFromPassword(password);
  const dateStamp = getDateStamp();

  return {
    token: createDailyAdminToken(scope, dateStamp),
    dateStamp,
    scope,
    permissions: getScopePermissions(scope)
  };
}

export function verifyAdminToken(token) {
  if (!token) {
    throw new Error('Token JWT manquant.');
  }

  const [encodedHeader, encodedPayload, signature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error('Format JWT invalide.');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const expectedSignature = signSegment(`${encodedHeader}.${encodedPayload}`, getDailySecret(payload.scope, getDateStamp()));

  if (signature !== expectedSignature) {
    throw new Error('Signature JWT invalide ou token expire pour la journee.');
  }

  if (!scopeDefinitions[payload.scope] || payload.date !== getDateStamp()) {
    throw new Error('Token JWT invalide pour la date du jour.');
  }

  return payload;
}

export function requireAdminPermission(tokenPayload, permission) {
  if (!tokenPayload?.permissions?.includes(permission)) {
    throw new Error(`Permission admin insuffisante: ${permission} requise.`);
  }

  return tokenPayload;
}

export function getBearerToken(request) {
  const authorizationHeader = request.headers.authorization;
  const value = Array.isArray(authorizationHeader) ? authorizationHeader[0] : authorizationHeader;

  if (!value?.startsWith('Bearer ')) {
    return null;
  }

  return value.slice('Bearer '.length).trim();
}

export function getAdminPasswordHint() {
  return {
    dateStamp: getDateStamp(),
    generationRule: 'Le JWT est signe chaque jour avec la date du jour Europe/Paris et un mot de passe configure cote serveur.',
    scopes: [
      {
        name: 'editor',
        permissions: getScopePermissions('editor'),
        unlocks: ['modifier']
      },
      {
        name: 'admin-plus',
        permissions: getScopePermissions('admin-plus'),
        unlocks: ['modifier', 'creer', 'supprimer']
      }
    ],
    helperCommand: 'npm run admin-token',
    requiredEnvironment: Object.values(scopeDefinitions).map((definition) => definition.envVar)
  };
}