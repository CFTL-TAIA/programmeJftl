import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const envFilePath = join(rootDir, '.env.local');

function stripInlineComment(value) {
  let result = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (character === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      result += character;
      continue;
    }

    if (character === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      result += character;
      continue;
    }

    if (character === '#' && !inSingleQuote && !inDoubleQuote) {
      break;
    }

    result += character;
  }

  return result.trim();
}

function normalizeValue(rawValue) {
  const value = stripInlineComment(rawValue);

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function loadLocalEnvFile() {
  if (!existsSync(envFilePath)) {
    return false;
  }

  const lines = readFileSync(envFilePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1);

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = normalizeValue(rawValue);
  }

  return true;
}

loadLocalEnvFile();