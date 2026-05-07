import { createServer } from 'node:http';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_ROOT = path.join(__dirname, 'dist');
const SETTINGS_FILE = process.env.ADMIN_SETTINGS_PATH ?? '/data/admin-settings.json';
const PORT = Number.parseInt(process.env.PORT ?? '80', 10);

const DEFAULT_SETTINGS = {
  activeFeed: 'A',
  feedName: '',
  timerMinutes: 5,
  showConditionA: true,
  showConditionB: true,
};

function normalizeSettings(input) {
  const value = input && typeof input === 'object' ? input : {};
  const parsedTimerMinutes = typeof value.timerMinutes === 'number'
    ? value.timerMinutes
    : typeof value.timerMinutes === 'string'
      ? Number.parseInt(value.timerMinutes, 10)
      : NaN;

  return {
    activeFeed: value.activeFeed === 'B' ? 'B' : 'A',
    feedName: typeof value.feedName === 'string' ? value.feedName : '',
    timerMinutes: Number.isFinite(parsedTimerMinutes)
      ? Math.max(1, Math.min(60, Math.round(parsedTimerMinutes)))
      : DEFAULT_SETTINGS.timerMinutes,
    showConditionA: value.showConditionA === false ? false : true,
    showConditionB: value.showConditionB === false ? false : true,
  };
}

async function readSettingsFile() {
  try {
    const raw = await readFile(SETTINGS_FILE, 'utf8');
    return normalizeSettings(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

async function writeSettingsFile(settings) {
  await mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  const tempFile = `${SETTINGS_FILE}.tmp`;
  await writeFile(tempFile, `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
  await rename(tempFile, SETTINGS_FILE);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(message);
}

function getContentType(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
    case '.mjs':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.ico':
      return 'image/x-icon';
    case '.webp':
      return 'image/webp';
    case '.woff':
      return 'font/woff';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
}

function getCacheControl(filePath) {
  if (path.extname(filePath).toLowerCase() === '.html') {
    return 'no-cache';
  }

  return 'public, max-age=31536000, immutable';
}

async function sendFile(res, filePath) {
  const data = await readFile(filePath);
  res.writeHead(200, {
    'Content-Type': getContentType(filePath),
    'Cache-Control': getCacheControl(filePath),
  });
  res.end(data);
}

async function serveStaticRequest(res, requestPath) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(requestPath);
  } catch {
    sendText(res, 400, 'Bad request');
    return;
  }

  const normalizedPath = path.normalize(decodedPath).replace(/^\/+/, '');
  const resolvedPath = path.resolve(STATIC_ROOT, normalizedPath || 'index.html');
  const relativePath = path.relative(STATIC_ROOT, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    sendText(res, 404, 'Not found');
    return;
  }

  try {
    const fileStat = await stat(resolvedPath);
    if (fileStat.isFile()) {
      await sendFile(res, resolvedPath);
      return;
    }

    if (fileStat.isDirectory()) {
      const directoryIndex = path.join(resolvedPath, 'index.html');
      try {
        const indexStat = await stat(directoryIndex);
        if (indexStat.isFile()) {
          await sendFile(res, directoryIndex);
          return;
        }
      } catch {
        sendText(res, 404, 'Not found');
        return;
      }
    }
  } catch {
    if (path.extname(normalizedPath)) {
      sendText(res, 404, 'Not found');
      return;
    }

    await sendFile(res, path.join(STATIC_ROOT, 'index.html'));
    return;
  }

  sendText(res, 404, 'Not found');
}

async function readRequestBody(req) {
  return await new Promise((resolve, reject) => {
    let body = '';

    req.setEncoding('utf8');
    req.on('data', chunk => {
      body += chunk;

      if (body.length > 65536) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (requestUrl.pathname === '/api/admin-settings') {
    if (req.method === 'GET') {
      const settings = await readSettingsFile();
      sendJson(res, 200, settings);
      return;
    }

    if (req.method === 'PUT') {
      try {
        const rawBody = await readRequestBody(req);
        const parsedBody = rawBody ? JSON.parse(rawBody) : {};
        const settings = normalizeSettings(parsedBody);
        await writeSettingsFile(settings);
        sendJson(res, 200, settings);
      } catch (error) {
        const tooLarge = error instanceof Error && error.message === 'Request body too large';
        sendText(res, tooLarge ? 413 : 400, tooLarge ? 'Request body too large' : 'Invalid settings payload');
      }

      return;
    }

    sendText(res, 405, 'Method not allowed');
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendText(res, 405, 'Method not allowed');
    return;
  }

  await serveStaticRequest(res, requestUrl.pathname);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Feed app server listening on http://0.0.0.0:${PORT}`);
});