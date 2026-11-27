import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const host = '0.0.0.0';
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const requested = decodeURIComponent(url.pathname);
  const requestedFile = requested === '/manus-routes.json'
    ? 'public/manus-routes.json'
    : (requested.startsWith('/assets/') ? `public${requested}` : (requested === '/' ? 'index.html' : requested));
  const candidate = normalize(join(root, requestedFile));
  const safeCandidate = candidate.startsWith(root) ? candidate : join(root, 'index.html');
  let file = safeCandidate;
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
  } catch {
    file = join(root, 'index.html');
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-cache');
  createReadStream(file).pipe(res);
});

server.listen(port, host, () => console.log(`FindBack running at http://${host}:${port}`));
