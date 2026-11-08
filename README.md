# Horizon Academia

Web institucional de preparación para el examen y la entrevista de admisión al Pedagógico de Huaraz.

- [Página publicada](https://danasteroid.github.io/Horizon-academia/)
- [Original y tres alternativas](https://danasteroid.github.io/Horizon-academia/comparativa/#original)
- [Lista para la reunión y el lanzamiento](PENDIENTES_LANZAMIENTO.md)

## Versión de producción

Se conserva el diseño original azul, Inter para lectura y Manrope para títulos. La compilación genera CSS de Tailwind 3, JavaScript reducido y solamente los iconos Lucide utilizados. Las fuentes variables se sirven desde el propio sitio, con sus licencias. La página no carga el compilador de Tailwind, Google Fonts ni bibliotecas desde CDN al abrirse.

Las versiones están fijadas en `package.json` y `package-lock.json`. Se requiere Node.js 22 o posterior y npm.

```sh
npm ci
npm run verify
npm run preview
```

La vista previa sirve **la carpeta compilada**, respetando la misma ruta que GitHub Pages: `http://127.0.0.1:4174/Horizon-academia/`.

No abrir el HTML fuente directamente ni servir la raíz como versión de producción: sus recursos compilados se generan dentro de `dist/`.

## Qué editar

- `index.html`: estructura y contenido del diseño elegido.
- `assets/original-base.css`: estilos y animaciones originales.
- `assets/original-polish.css`: tipografía, paleta y ajustes adaptables.
- `assets/original-runtime.js`: carrusel, movimiento y estados de interfaz.
- `assets/original-form.js`: preparación local de la consulta.
- `assets/original-polish.js`: menú móvil, selección de ciclos y accesibilidad del diálogo.
- `comparativa/`: comparador y alternativas conservadas. Incluyen `noindex` y no figuran en el sitemap oficial.
- `site.config.json`: dirección pública, nombre, idioma y color del navegador.

Después de editar, ejecutar `npm run verify`. Se revisan sintaxis, enlaces y anclas locales, fuentes, metadatos y presupuesto de carga. Los nombres de CSS/JS compilados incorporan una huella de su contenido para evitar recursos obsoletos en caché.

## Fotografías de los tres slides

Se implementa la opción elegida de fotografía integrada en el fondo, con una imagen distinta para admisión, simulacros y materiales. Los títulos, botones y datos permanecen como HTML. El fondo se oscurece en la zona del texto y se reencuadra al apilarse en celular. El carrusel reserva la altura de su slide más alto para evitar saltos entre imágenes.

Las tres fotos actuales son **referencias generadas**, identificadas en la página como “Fotografía referencial”; no representan alumnos, docentes ni instalaciones reales de la academia. Quedan pendientes los originales del cliente.

Fuentes de imagen: `assets/slides/admision-reference.png`, `simulacros-reference.png` y `materiales-reference.png`. La compilación con Sharp genera WebP de 640, 1024 y 1600 píxeles, conservando el encuadre completo del archivo; el navegador recibe la variante adecuada mediante `srcset`. Los originales PNG no se copian al paquete público. Los nombres de WebP incluyen una huella de contenido.

Cuando lleguen las fotos reales, sustituir los tres originales, revisar el punto de interés en `.slide-photo img` y los encuadres de celular, y retirar las etiquetas “Fotografía referencial” únicamente después de comprobar que todos los recursos corresponden a la academia. Los archivos se pueden renombrar entonces actualizando también la lista del compilador. Ejecutar `npm run verify` antes de publicar.

## Publicación

El flujo `.github/workflows/pages.yml` instala con `npm ci`, compila, valida y publica **únicamente `dist/`** al actualizar `main`. Las solicitudes de cambio también pasan comprobaciones, pero no publican. El origen de GitHub Pages debe estar en **GitHub Actions**.

El paquete público usa una lista explícita de archivos. No incluye Word, documentos de trabajo, respaldos, capturas de revisión, código del proceso de compilación ni dependencias de desarrollo. `build-info.json` permite comprobar la revisión desplegada.

Para deshacer una publicación, revertir el commit correspondiente en Git y actualizar `main`; el mismo flujo vuelve a compilar y publicar esa versión. No borrar el historial ni forzar la rama compartida.

Para otro dominio, cambiar `url` en `site.config.json` (HTTPS y barra final). También puede definirse `SITE_URL` al compilar. Esto actualiza canonical, metadatos sociales, sitemap, robots y 404. La compra del dominio, DNS y alta en el proveedor se hacen por separado cuando el cliente los decida.

Referencias: [flujos personalizados de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Tailwind CSS 3](https://v3.tailwindcss.com/docs/installation).

En la dirección actual, el sitio vive en una subcarpeta de GitHub Pages. El `robots.txt` generado queda preparado para el futuro dominio; los buscadores lo reconocen cuando se sirve en la raíz del host. Por ahora, enviar el sitemap directamente en Search Console. Las alternativas utilizan `noindex` en su propio HTML. [Ubicación de robots.txt según Google](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt).

## Consultas y datos

El formulario prepara un mensaje revisable y un enlace a WhatsApp. No almacena datos, envía mensajes por sí solo ni confirma matrículas. No hay base de datos, pagos, cuentas de estudiantes, analítica ni rastreadores añadidos. La plataforma de alumnos conserva su aviso informativo hasta que la academia facilite un acceso real.

El contenido principal sigue legible si JavaScript está desactivado. En ese caso se muestra un contacto directo por WhatsApp y el botón de preparación permanece deshabilitado. La interfaz respeta la preferencia de movimiento reducido.

La política de recursos de la página restringe conexiones y envíos de formularios. Se permiten los manejadores inline del diseño actual; no se presenta como una política CSP estricta. Antes de añadir servicios externos hay que revisar esta configuración, la privacidad y los permisos correspondientes.

## Estado editorial y operación

La preparación técnica no equivale a aprobación final del contenido ni a matrícula en línea. Los datos, afirmaciones, condiciones, dominio y responsables pendientes están en `PENDIENTES_LANZAMIENTO.md`.

GitHub Pages es el alojamiento actual. Antes de incorporar pagos, contratos o una operación centrada en transacciones, revisar la adecuación del proveedor y sus [límites de uso](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). La compilación es estática y portable a otro alojamiento.
