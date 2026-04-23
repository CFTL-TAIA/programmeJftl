import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const port = Number(process.env.PORT || 8080);

function unique(values) {
  return [...new Set(values)];
}

async function getWindowsListeningPids(targetPort) {
  const { stdout } = await execFileAsync('netstat', ['-ano', '-p', 'tcp']);
  const lines = stdout.split(/\r?\n/);
  const matches = lines
    .map((line) => line.trim())
    .filter((line) => line.includes('LISTENING'))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts.length >= 5)
    .filter((parts) => parts[1].endsWith(`:${targetPort}`))
    .map((parts) => Number(parts[4]))
    .filter((pid) => Number.isInteger(pid) && pid > 0);

  return unique(matches);
}

async function getWindowsProcessName(pid) {
  const { stdout } = await execFileAsync('tasklist', ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH']);
  const firstLine = stdout.split(/\r?\n/).find((line) => line.trim().length > 0);

  if (!firstLine || firstLine.startsWith('INFO:')) {
    return null;
  }

  const columns = firstLine
    .split('","')
    .map((part) => part.replace(/^"|"$/g, '').trim());

  return columns[0] || null;
}

async function killWindowsProcess(pid) {
  await execFileAsync('taskkill', ['/PID', String(pid), '/F']);
}

async function getUnixListeningPids(targetPort) {
  const { stdout } = await execFileAsync('lsof', ['-ti', `tcp:${targetPort}`]);
  return unique(
    stdout
      .split(/\r?\n/)
      .map((value) => Number(value.trim()))
      .filter((pid) => Number.isInteger(pid) && pid > 0)
  );
}

async function getUnixProcessName(pid) {
  const { stdout } = await execFileAsync('ps', ['-p', String(pid), '-o', 'comm=']);
  const value = stdout.trim();
  return value || null;
}

async function killUnixProcess(pid) {
  await execFileAsync('kill', ['-9', String(pid)]);
}

async function freePort(targetPort) {
  const isWindows = process.platform === 'win32';
  const getPids = isWindows ? getWindowsListeningPids : getUnixListeningPids;
  const getProcessName = isWindows ? getWindowsProcessName : getUnixProcessName;
  const killProcess = isWindows ? killWindowsProcess : killUnixProcess;

  let pids = [];

  try {
    pids = await getPids(targetPort);
  } catch (error) {
    console.warn(`Impossible d'inspecter le port ${targetPort}: ${error.message}`);
    return;
  }

  if (pids.length === 0) {
    console.log(`Port ${targetPort} libre.`);
    return;
  }

  for (const pid of pids) {
    const processName = (await getProcessName(pid)) || 'inconnu';
    const normalizedName = processName.toLowerCase();
    const isNodeProcess = normalizedName === 'node.exe' || normalizedName === 'node';

    if (!isNodeProcess) {
      throw new Error(`Le port ${targetPort} est utilise par le processus ${processName} (PID ${pid}). Liberation automatique annulee.`);
    }

    await killProcess(pid);
    console.log(`Ancien serveur Node local termine sur le port ${targetPort} (PID ${pid}).`);
  }
}

await freePort(port);