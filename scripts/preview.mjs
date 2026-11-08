import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const base = new URL(process.env.SITE_URL || config.url).pathname.replace(/\/?$/, '/');
const port = Number(process.env.PORT || 4174);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    if (pathname === '/' && base !== '/') { res.writeHead(302, { Location: base }); res.end(); return; }
    if (!pathname.startsWith(base)) throw new Error('Ruta externa');
    const relative = pathname.slice(base.length);
    let file = path.resolve(dist, relative || 'index.html');
    if (!file.startsWith(dist + path.sep)) throw new Error('Ruta externa');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const contents = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : contents);
  } catch {
    res.writeHead(404, { 'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store' });
    res.end(await readFile(path.join(dist, '404.html')));
  }
}).listen(port, '127.0.0.1', () => console.log(`Vista de producción: http://127.0.0.1:${port}${base}`));
