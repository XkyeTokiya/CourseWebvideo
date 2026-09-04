import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535) {
  throw new Error(`Invalid port: ${options.port}`);
}
if (!existsSync(options.statusDir) || !statSync(options.statusDir).isDirectory()) {
  throw new Error(`Status data directory does not exist: ${options.statusDir}`);
}

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

const server = createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method ?? '')) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? options.host}`);
  if (url.pathname === '/health') {
    sendJson(response, 200, {
      root: options.root,
      statusDir: options.statusDir,
      dashboard: '/production-status/dashboard.html',
    });
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