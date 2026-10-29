# Horizon Academia

Sitio web de Horizon Academia, con preparación para el examen de conocimientos y la entrevista de admisión al Pedagógico de Huaraz.

- **Página web:** [danasteroid.github.io/Horizon-academia](https://danasteroid.github.io/Horizon-academia/)
- **Comparador de diseños:** [original y tres alternativas](https://danasteroid.github.io/Horizon-academia/comparativa/#original)

## Diseño principal

`index.html` conserva el diseño original elegido, con el contenido de la academia adaptado para admisión 2027. Usa una paleta azul, títulos en Manrope y texto en Inter. Incluye navegación móvil, carrusel, información de ciclos, metodología, contactos y un formulario que prepara una consulta revisable para WhatsApp.

El formulario no almacena solicitudes, no envía mensajes automáticamente y no confirma matrículas.

Los ajustes visuales y de navegación del original están en `assets/original-polish.css` y `assets/original-polish.js`.

## Alternativas

La carpeta `comparativa/` contiene el comparador y las versiones Institucional, Editorial y Horizon esencial. Cada página se puede abrir de forma independiente.

## Tecnología y publicación

HTML, CSS y JavaScript sin un paso de compilación. El sitio utiliza Tailwind CSS y Lucide desde CDN, además de Google Fonts con fuentes de reserva.

GitHub Pages publica la raíz de la rama `main`. El archivo `.nojekyll` indica que se sirven los archivos estáticos directamente.

Para revisar el sitio localmente, abre `index.html` o sirve la carpeta con un servidor HTTP estático.
