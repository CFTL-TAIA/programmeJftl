import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const rootDir = join(process.cwd());
const uploadTargets = {
  photo: {
    sourceDir: join(rootDir, 'BDD', 'photos'),
    distDir: join(rootDir, 'dist', 'BDD', 'photos'),
    publicBase: '/BDD/photos'
  },
  logo: {
    sourceDir: join(rootDir, 'BDD', 'logos'),
    distDir: join(rootDir, 'dist', 'BDD', 'logos'),
    publicBase: '/BDD/logos'
  }
};

const extensionByMime = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/webp': 'webp'
};

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replaceAll(/[\u0000-\u001f\u007f-\u009f]/g, '')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
}

function parseDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(String(dataUrl || ''));
  if (!match) {
    throw new Error('Image encodée invalide.');
  }

  const mimeType = match[1];
  const extension = extensionByMime[mimeType];
  if (!extension) {
    throw new Error(`Format d'image non supporté: ${mimeType}.`);
  }

  return {
    extension,
    buffer: Buffer.from(match[2], 'base64')
  };
}

function getUploadTarget(fieldName) {
  const target = uploadTargets[fieldName];
  if (!target) {
    throw new Error(`Champ média non supporté: ${fieldName}.`);
  }

  return target;
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function writeCopies(target, fileName, buffer) {
  ensureDir(target.sourceDir);
  ensureDir(target.distDir);
  writeFileSync(join(target.sourceDir, fileName), buffer);
  writeFileSync(join(target.distDir, fileName), buffer);
}

function deleteCopies(target, fileName) {
  for (const dir of [target.sourceDir, target.distDir]) {
    const filePath = join(dir, fileName);
    if (existsSync(filePath)) {
      rmSync(filePath, { force: true });
    }
  }
}

export function saveAdminMedia({ fieldName, currentPath, fileNameStem, dataUrl }) {
  const target = getUploadTarget(fieldName);
  const { extension, buffer } = parseDataUrl(dataUrl);
  const currentFileName = currentPath ? basename(currentPath) : '';
  const currentStem = currentFileName ? basename(currentFileName, extname(currentFileName)) : '';
  const nextStem = currentStem || slugify(fileNameStem);

  if (!nextStem) {
    throw new Error('Impossible de déterminer un nom de fichier pour le média.');
  }

  const nextFileName = `${nextStem}.${extension}`;
  if (currentFileName && currentFileName !== nextFileName) {
    deleteCopies(target, currentFileName);
  }

  writeCopies(target, nextFileName, buffer);

  const publicPath = `${target.publicBase}/${nextFileName}`;
  return {
    publicPath,
    requiresResourceSave: Boolean(currentPath && currentPath !== publicPath),
    message: currentPath && currentPath !== publicPath
      ? 'Image chargée. Enregistrez maintenant la ressource pour mettre à jour l’URL.'
      : 'Image chargée avec succès.'
  };
}