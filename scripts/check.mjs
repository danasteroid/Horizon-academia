import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { gzipSync } from 'node:zlib';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const info = JSON.parse(await readFile(path.join(root, 'build-info.json'), 'utf8'));
const base = new URL(info.url);
const entries = await readdir(root, { recursive: true });
const files = [];
for (const file of entries) if ((await stat(path.join(root, file))).isFile()) files.push(file.replaceAll('\\', '/'));
const exists = file => files.includes(file);
const read = file => readFile(path.join(root, file), 'utf8');
let references = 0;
for (const file of files) {
  assert(!/\.(?:docx|md|env|map)$|respaldo|node_modules|package-lock|\.git\//i.test(file), `Archivo privado o de desarrollo en producción: ${file}`);
  if (file.endsWith('.js')) new vm.Script(await read(file), { filename: file });
  if (file.endsWith('.css')) {
    const css = await read(file);
    assert(!/@import[^;]*https?:/i.test(css), `Fuente o CSS externos en ${file}`);
    for (const match of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
      if (match[1].startsWith('data:')) continue;
      assert(exists(path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]))), `Recurso CSS ausente: ${match[1]}`);
    }
  }
  if (!file.endsWith('.html')) continue;
  const html = await read(file);
  assert(!/cdn\.tailwindcss|unpkg\.com|fonts\.googleapis|fonts\.gstatic|@latest/i.test(html), `CDN de desarrollo en ${file}`);
  assert(!/<(?:script|link|img)\b[^>]*\b(?:src|href)="https?:\/\//i.test(html.replace(/<link rel="canonical"[^>]+>/g, '')), `Recurso de ejecución externo en ${file}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `IDs duplicados: ${file}`);
  if (file.startsWith('comparativa/')) assert(/name="robots" content="noindex, follow"/.test(html), `Alternativa indexable: ${file}`);
  for (const match of html.matchAll(/\b(?:src|href)="([^"]*)"/g)) {
    const reference = match[1];
    if (!reference || /^(?:https?:|mailto:|tel:|data:|about:)/.test(reference)) continue;
    const url = new URL(reference, new URL(file, base));
    assert(url.pathname.startsWith(base.pathname), `Enlace fuera de la ruta de publicación: ${reference}`);
    let target = decodeURIComponent(url.pathname.slice(base.pathname.length));
    if (!target || target.endsWith('/')) target += 'index.html';
    assert(exists(target), `Enlace local roto en ${file}: ${reference}`);
    const route = file === 'comparativa/index.html' && /^#(?:comparar|original|institucional|editorial|esencial)$/.test(url.hash);
    if (url.hash && target === file && !route) assert(ids.includes(decodeURIComponent(url.hash.slice(1))), `Ancla ausente en ${file}: ${reference}`);
    references++;
  }
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const reference = candidate.trim().split(/\s+/)[0];
      const url = new URL(reference, new URL(file, base));
      assert.equal(url.origin, base.origin, 'La imagen adaptable debe ser local');
      assert(url.pathname.startsWith(base.pathname), 'Imagen fuera de la ruta de publicación');
      assert(exists(decodeURIComponent(url.pathname.slice(base.pathname.length))), `Imagen adaptable ausente: ${reference}`);
      references++;
    }
  }
  if (file === 'index.html') {
    assert(html.includes(`<link rel="canonical" href="${base.href}">`), 'URL canónica incorrecta');
    assert(html.includes('property="og:image"'), 'Falta vista previa social');
    assert(html.includes('aria-live="polite"'), 'El resultado del formulario debe anunciarse');
  }
}
assert((await read('sitemap.xml')).includes(`<loc>${base.href}</loc>`), 'Sitemap incorrecto');
assert((await read('robots.txt')).includes(new URL('sitemap.xml', base).href), 'Robots incorrecto');
assert(exists('favicon.svg') && exists('404.html'), 'Faltan favicon o página 404');
const weights = {};
for (const extension of ['css', 'js']) {
  let bytes = 0;
  for (const file of files.filter(file => file.startsWith('assets/') && file.endsWith(`.${extension}`))) bytes += gzipSync(await read(file)).length;
  weights[extension] = Math.round(bytes / 1024 * 10) / 10;
}
assert(weights.css < 50 && weights.js < 60, 'Los recursos principales superan el presupuesto de carga');
let imageBytes = 0;
for (const file of files.filter(file => file.startsWith('assets/slides/') && file.endsWith('.webp'))) imageBytes += (await stat(path.join(root, file))).size;
assert(imageBytes < 900 * 1024, 'Las imágenes de los slides superan el presupuesto de 900 KB');
console.log(`Validación correcta: ${files.length} archivos públicos y ${references} referencias locales.\nRecursos principales comprimidos: CSS ${weights.css} KB; JavaScript ${weights.js} KB.\nSintaxis, fuentes, rutas, anclas y metadatos correctos.`);
console.log(`Fotografías adaptables: ${Math.round(imageBytes / 1024)} KB en total.`);
