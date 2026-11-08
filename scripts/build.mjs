import { readFile, writeFile, mkdir, cp, rm, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { build, transform } from 'esbuild';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
// Only this known generated directory may be cleared; never remove source files.
if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('Destino inseguro');
await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets', 'fonts'), { recursive: true });
await mkdir(path.join(dist, 'assets', 'slides'), { recursive: true });
await mkdir(path.join(dist, 'licenses'), { recursive: true });
const read = async file => (await readFile(path.join(root, file), 'utf8')).replace(/\r\n/g, '\n');
const config = JSON.parse(await read('site.config.json'));
const site = new URL(process.env.SITE_URL || config.url);
if (site.protocol !== 'https:' || site.search || site.hash || site.username || site.password) throw new Error('SITE_URL debe ser una URL HTTPS sin credenciales ni parámetros');
if (!site.pathname.endsWith('/')) site.pathname += '/';
const hash = data => createHash('sha256').update(data).digest('hex').slice(0, 12);
const mapping = {};
async function asset(file, contents) {
  const extension = path.extname(file);
  const destination = `${file.slice(0, -extension.length)}.${hash(contents)}${extension}`;
  await writeFile(path.join(dist, destination), contents);
  mapping[file] = destination;
}

const html = await read('index.html');
const runtimeFiles = ['assets/original-runtime.js', 'assets/original-form.js', 'assets/original-polish.js'];
const runtime = await Promise.all(runtimeFiles.map(read));
// Scan complete class names in both markup and runtime UI states.
const tailwindOutput = await postcss([tailwind({
  content: [html, ...runtime].map(raw => ({ raw, extension: 'html' })),
  theme: { extend: {} }, plugins: []
})]).process('@tailwind base;\n@tailwind components;\n@tailwind utilities;', { from: undefined });
await asset('assets/tailwind.css', (await transform(tailwindOutput.css, { loader: 'css', minify: true })).code);

// Keep the existing global event handlers: HTML onclick and the navigation use them.
for (let index = 0; index < runtimeFiles.length; index++) {
  const result = await transform(runtime[index], {
    loader: 'js', target: 'es2020', minifyWhitespace: true, minifySyntax: true, minifyIdentifiers: false
  });
  await asset(runtimeFiles[index], result.code);
}

const iconNames = [...new Set([...html.matchAll(/data-lucide="([\w-]+)"/g)].map(match => match[1]))];
const iconExports = iconNames.map(name => name.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(''));
const require = createRequire(import.meta.url);
const lucide = require('lucide');
for (const name of iconExports) if (!lucide[name]) throw new Error(`Icono no disponible: ${name}`);
const icons = await build({
  stdin: {
    contents: `import {createIcons,${iconExports.join(',')}} from 'lucide';\nwindow.lucide={createIcons:()=>createIcons({icons:{${iconExports.join(',')}}})};`,
    resolveDir: root, sourcefile: 'icons-entry.js'
  }, bundle: true, write: false, format: 'iife', target: 'es2020', minify: true, legalComments: 'none'
});
await asset('assets/icons.js', icons.outputFiles[0].text);

// Self-host only the Latin subsets used by these Spanish-language designs.
let fonts = '';
for (const family of ['inter', 'manrope', 'dm-sans', 'newsreader']) {
  const folder = path.join(root, 'node_modules', '@fontsource-variable', family);
  const styles = family === 'newsreader' ? ['index.css', 'wght-italic.css'] : ['index.css'];
  for (const style of styles) {
    const css = await readFile(path.join(folder, style), 'utf8');
    for (const face of css.matchAll(/@font-face\s*\{[^}]+\}/g)) {
      if (!new RegExp(`${family}-latin(?:-ext)?-wght-`).test(face[0])) continue;
      const file = face[0].match(/url\(\.\/files\/([^\)]+)\)/)[1];
      await cp(path.join(folder, 'files', file), path.join(dist, 'assets', 'fonts', file));
      fonts += face[0].replace(/ Variable'/g, "'").replace('./files/', 'fonts/') + '\n';
    }
  }
  await cp(path.join(folder, 'LICENSE'), path.join(dist, 'licenses', `${family}.txt`));
}
await asset('assets/fonts.css', (await transform(fonts, { loader: 'css', minify: true })).code);
for (const file of ['assets/original-base.css', 'assets/original-polish.css', 'comparativa/comparador.css', 'comparativa/disenos.css']) {
  await mkdir(path.dirname(path.join(dist, file)), { recursive: true });
  await asset(file, (await transform(await read(file), { loader: 'css', minify: true })).code);
}
for (const file of ['comparativa/comparador.js', 'comparativa/disenos.js']) {
  const result = await transform(await read(file), { minify: true, target: 'es2020' });
  await asset(file, result.code);
}

// Explicit public-file list: client documents, backup copies and QA captures stay out.
for (const file of ['logo-brand.png', 'logo-dark.png', 'logo-white.png', 'logo.jpg']) {
  await cp(path.join(root, 'assets', file), path.join(dist, 'assets', file));
}
// Responsive, compressed copies only; reference originals stay in the source repo.
for (const slide of ['admision', 'simulacros', 'materiales']) {
  for (const width of [640, 1024, 1600]) {
    const photo = await sharp(path.join(root, 'assets', 'slides', `${slide}-reference.png`))
      .resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toBuffer();
    await asset(`assets/slides/${slide}-${width}.webp`, photo);
  }
}
await mkdir(path.join(dist, 'comparativa', 'capturas'), { recursive: true });
for (const design of ['original', 'institucional', 'editorial', 'esencial']) {
  await cp(path.join(root, 'comparativa', 'capturas', `${design}.png`), path.join(dist, 'comparativa', 'capturas', `${design}.png`));
}
await cp(path.join(root, 'node_modules', 'lucide', 'LICENSE'), path.join(dist, 'licenses', 'lucide.txt'));
await cp(path.join(root, 'node_modules', 'tailwindcss', 'LICENSE'), path.join(dist, 'licenses', 'tailwindcss.txt'));
const brand = (await readFile(path.join(root, 'assets', 'logo-brand.png'))).toString('base64');
// Use the supplied academy symbol, without redrawing or replacing the identity.
await writeFile(path.join(dist, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 370 340"><rect x="-20" y="-20" width="370" height="340" rx="65" fill="${config.themeColor}"/><svg width="330" height="299" viewBox="0 0 330 299"><image width="825" height="299" href="data:image/png;base64,${brand}"/></svg></svg>`);

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const title = html.match(/<title>([^<]+)<\/title>/)[1];
const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
const metadata = `
  <link rel="canonical" href="${site.href}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <meta name="theme-color" content="${config.themeColor}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${config.locale}">
  <meta property="og:site_name" content="${escape(config.name)}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${site.href}">
  <meta property="og:image" content="${new URL('assets/logo.jpg', site).href}">
  <meta property="og:image:width" content="1024"><meta property="og:image:height" content="682">
  <meta property="og:image:alt" content="Logo de Horizon Academia">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="${new URL('assets/logo.jpg', site).href}">
  <link rel="preload" href="assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>`;

function rewriteAssets(markup, file) {
  const current = path.posix.dirname(file);
  function rewrite(reference) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) return reference;
    const source = path.posix.normalize(path.posix.join(current, reference.split('?')[0]));
    return mapping[source] ? path.posix.relative(current, mapping[source]) : reference;
  }
  return markup.replace(/\b(src|href|srcset)="([^"]+)"/g, (match, attribute, reference) => {
    if (attribute !== 'srcset') return `${attribute}="${rewrite(reference)}"`;
    const candidates = reference.split(',').map(candidate => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);
      return [rewrite(url), ...descriptor].join(' ');
    });
    return `srcset="${candidates.join(', ')}"`;
  });
}
const pages = ['index.html', 'comparativa/index.html', 'comparativa/institucional.html', 'comparativa/editorial.html', 'comparativa/esencial.html'];
for (const file of pages) {
  const source = file === 'index.html' ? html.replace('<!-- site:metadata -->', metadata) : await read(file);
  const output = rewriteAssets(source, file).replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n/g, '\n');
  await writeFile(path.join(dist, file), output);
}
await writeFile(path.join(dist, '404.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Página no encontrada · Horizon Academia</title><link rel="icon" href="${site.pathname}favicon.svg"><style>body{margin:0;background:#080c16;color:#e2e8f0;font:17px/1.7 system-ui,sans-serif;display:grid;place-items:center;min-height:100svh}main{max-width:35rem;padding:32px}h1{font-size:2.2rem;line-height:1.2}a{color:#7dd3fc}a:focus-visible{outline:3px solid #38bdf8;outline-offset:5px}</style></head><body><main><p>HORIZON ACADEMIA · 404</p><h1>No encontramos esta página.</h1><p>El enlace puede haber cambiado. Puedes volver al inicio o consultar con el equipo de la academia.</p><p><a href="${site.pathname}">Volver a la página principal</a></p><p><a href="https://wa.me/51989949451" rel="noopener noreferrer">Consultar por WhatsApp</a></p></main></body></html>`);
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', site).href}\n`);
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.href}</loc></url></urlset>\n`);
const files = await readdir(dist, { recursive: true });
const fileHashes = [];
for (const file of files.map(file => file.replaceAll('\\', '/')).sort()) {
  const absolute = path.join(dist, file);
  if ((await stat(absolute)).isFile()) fileHashes.push([file.replaceAll('\\', '/'), hash(await readFile(absolute))]);
}
const fingerprint = hash(JSON.stringify(fileHashes));
await writeFile(path.join(dist, 'build-info.json'), JSON.stringify({
  version: JSON.parse(await read('package.json')).version,
  commit: process.env.GITHUB_SHA || null,
  fingerprint, url: site.href
}, null, 2) + '\n');
console.log(`Producción compilada: ${site.href}\n${files.length + 1} entradas; ${iconNames.length} iconos locales; revisión ${fingerprint}`);
