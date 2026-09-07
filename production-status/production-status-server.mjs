import { createServer } from 'node:http';
import { createReadStream, existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APPROVAL_KEYS, emptyApproval, loadApprovalStore, saveApprovalStore } from './approval-store.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaults = {
  host: '127.0.0.1',
  port: 8765,
  root: path.resolve(scriptDir, '..'),
};

function readOptions(argv) {
  const options = { ...defaults };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--host') options.host = argv[++index];
    if (value === '--port') options.port = Number(argv[++index]);
    if (value === '--root') options.root = path.resolve(argv[++index]);
    if (value === '--status-dir') options.statusDir = path.resolve(argv[++index]);
  }
  options.statusDir ??= path.join(options.root, 'production-status');
  return options;
}

const options = readOptions(process.argv.slice(2));
const SERVICE_ID = 'coursewebvideo-production-status';
if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535) {
  throw new Error(`Invalid port: ${options.port}`);
}
if (!existsSync(options.statusDir) || !statSync(options.statusDir).isDirectory()) {
  throw new Error(`Status data directory does not exist: ${options.statusDir}`);
}

function regenerateStatus() {
  const result = spawnSync(process.execPath, [path.join(options.root, 'production-status', 'production-status.mjs'), 'sync'], {
    cwd: options.root,
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'failed to generate production status');
}

regenerateStatus();

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

let indexCache = null;
let indexSignature = '';
const scanRuns = new Map();
let activeScanId = null;

function resolveRequestPath(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const candidate = path.resolve(options.root, `.${decodedPath}`);
  return candidate === options.root || candidate.startsWith(`${options.root}${path.sep}`)
    ? candidate
    : null;
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body, null, 2));
}

function requestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', chunk => { body += chunk; if (body.length > 10000) reject(new Error('request body too large')); });
    request.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('invalid JSON body')); } });
    request.on('error', reject);
  });
}
function startScan(payload = {}) {
  if (activeScanId) return { conflict: true, run: scanRuns.get(activeScanId) };
  const episode = payload.episode == null || payload.episode === '' ? null : String(payload.episode);
  if (episode && !/^episode-\d{2}$/.test(episode)) throw new Error('invalid episode');
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const run = { id: runId, status: 'running', episode, startedAt: new Date().toISOString(), finishedAt: null, exitCode: null, output: '', error: null };
  scanRuns.set(runId, run); activeScanId = runId;
  const args = [path.join(options.root, 'production-status', 'production-status.mjs'), 'scan', '--build'];
  if (episode) args.push('--episode', episode);
  const child = spawn(process.execPath, args, { cwd: options.root, windowsHide: true });
  child.stdout.on('data', chunk => { run.output = `${run.output}${chunk}`.slice(-12000); });
  child.stderr.on('data', chunk => { run.error = `${run.error || ''}${chunk}`.slice(-12000); });
  child.on('error', error => { run.status = 'failed'; run.error = String(error.message || error); run.finishedAt = new Date().toISOString(); activeScanId = null; indexCache = null; });
  child.on('close', code => { run.exitCode = code; run.status = code === 0 ? 'passed' : 'failed'; run.finishedAt = new Date().toISOString(); activeScanId = null; indexCache = null; });
  return { conflict: false, run };
}

function recordApproval(payload = {}) {
  const episode = String(payload.episode ?? '');
  const gate = String(payload.gate ?? '');
  const status = String(payload.status ?? 'approved');
  if (!/^episode-\d{2}$/.test(episode)) throw new Error('invalid episode');
  if (!APPROVAL_KEYS.includes(gate)) throw new Error('invalid approval gate');
  if (!['approved', 'unrecorded'].includes(status)) throw new Error('invalid approval status');
  if (activeScanId) return { conflict: true, run: scanRuns.get(activeScanId) };
  const store = loadApprovalStore(options.statusDir);
  store.episodes[episode] ??= {};
  const approval = status === 'approved'
    ? { status, decidedAt: new Date().toISOString(), decidedBy: String(payload.decidedBy || 'workbench'), evidence: null, note: String(payload.note || '') }
    : emptyApproval();
  if (status === 'approved') store.episodes[episode][gate] = approval;
  else {
    delete store.episodes[episode][gate];
    if (!Object.keys(store.episodes[episode]).length) delete store.episodes[episode];
  }
  saveApprovalStore(options.statusDir, store);
  const scan = startScan({ episode });
  return { conflict: false, approval, run: scan.run };
}

function statusIndex() {
  const episodesDir = path.join(options.statusDir, 'episodes');
  const files = readdirSync(episodesDir)
    .filter(name => /^episode-\d{2}\.json$/i.test(name))
    .sort();
  const signature = files.map(name => `${name}:${statSync(path.join(episodesDir, name)).mtimeMs}`).join('|');
  if (indexCache && signature === indexSignature) return indexCache;
  const episodes = [];
  for (const name of files) {
    try {
      episodes.push(compactEpisode(JSON.parse(readFileSync(path.join(episodesDir, name), 'utf8'))));
    } catch {
      // Keep a malformed file out of the index; the health payload reports the count.
    }
  }
  indexSignature = signature;
  indexCache = {
    schemaVersion: 'coursewebvideo/episode-production-status/index/v1',
    generatedAt: new Date().toISOString(),
    count: episodes.length,
    episodes,
  };
  return indexCache;
}

function compactEpisode(doc) {
  return {
    schemaVersion: doc.schemaVersion,
    episodeId: doc.episodeId,
    title: doc.title,
    workflow: doc.workflow,
    summary: doc.summary,
    readiness: doc.readiness,
    automation: doc.automation,
    approvals: doc.approvals,
    coordination: doc.coordination,
    stages: doc.stages,
    updatedAt: doc.updatedAt,
    updatedBy: doc.updatedBy,
    observations: {
      delivery: doc.observations?.delivery ?? {
        recording: { status: 'not-observed', paths: [] },
        finalVideo: { status: 'not-observed', paths: [] },
      },
    },
  };
}

const server = createServer((request, response) => {
  if (!['GET', 'HEAD', 'POST'].includes(request.method ?? '')) {
    response.writeHead(405, { Allow: 'GET, HEAD, POST' });
    response.end();
    return;
  }

  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? options.host}`);
  if (url.pathname === '/health') {
    sendJson(response, 200, {
      service: SERVICE_ID,
      serviceScript: path.join(options.root, 'production-status', 'production-status-server.mjs'),
      root: options.root,
      statusDir: options.statusDir,
      dashboard: '/production-status/dashboard.html',
    });
    return;
  }

  if (url.pathname === '/production-status/index.json' || url.pathname === '/api/production-status/index') {
    sendJson(response, 200, statusIndex());
    return;
  }

  if (url.pathname === '/api/production-status/scan' && request.method === 'POST') {
    requestBody(request).then(payload => {
      try {
        const result = startScan(payload);
        sendJson(response, result.conflict ? 409 : 202, result.run);
      } catch (error) {
        sendJson(response, 400, { error: error.message || String(error) });
      }
    }).catch(error => sendJson(response, 400, { error: error.message || String(error) }));
    return;
  }
  if (url.pathname === '/api/production-status/approval' && request.method === 'POST') {
    requestBody(request).then(payload => {
      try {
        const result = recordApproval(payload);
        sendJson(response, result.conflict ? 409 : 202, result);
      } catch (error) {
        sendJson(response, 400, { error: error.message || String(error) });
      }
    }).catch(error => sendJson(response, 400, { error: error.message || String(error) }));
    return;
  }
  if (url.pathname === '/api/production-status/scan' && request.method === 'GET') {
    const run = url.searchParams.get('run');
    if (run) {
      const status = scanRuns.get(run);
      if (!status) return sendJson(response, 404, { error: 'scan run not found' });
      return sendJson(response, 200, status);
    }
    return sendJson(response, 200, activeScanId ? scanRuns.get(activeScanId) : { status: 'idle' });
  }
  if (request.method === 'POST') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  const pathname = url.pathname === '/' ? '/production-status/dashboard.html' : url.pathname;
  let filePath;
  try {
    filePath = resolveRequestPath(pathname);
  } catch {
    response.writeHead(400);
    response.end('Invalid path');
    return;
  }

  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
  });
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
});

server.listen(options.port, options.host, () => {
  console.log(`Production status service: http://${options.host}:${options.port}/production-status/dashboard.html`);
  console.log(`Workspace root: ${options.root}`);
  console.log(`Status data directory: ${options.statusDir}`);
});
