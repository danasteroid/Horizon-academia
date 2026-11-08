# Verificación del carrusel fotográfico — 8 de noviembre de 2026

**final result: passed**

## Referencia y alcance

- Opción 3 elegida explícitamente por el usuario: fotografía integrada en el fondo del banner.
- Referencia visual: `design/slide-photo-reference.png` (copia sin alterar del resultado seleccionado; original en `C:/Users/user/.codex/generated_images/01a1801e-a43f-7c30-88ee-1f7200efef9f/exec-2957679b-2ece-4721-ae61-1335103ba48f.png`).
- Estado de comparación: primer slide, carrusel pausado y animaciones de entrada terminadas.
- Sitio local revisado: `http://127.0.0.1:4174/Horizon-academia/`.
- Se conserva el resto de la página, incluida misión y visión, navegación y consultas.

## Capturas y normalización

- Referencia: 1764 × 892 píxeles; composición equivalente a 1339 × 677 píxeles CSS.
- Vista de escritorio: viewport de 1339 × 1000 CSS; captura del navegador de 1324 × 989 píxeles. Se normalizó uniformemente a 1339 píxeles de ancho antes de extraer el componente desde y=231, de 1339 × 677. Esta diferencia de densidad/captura no se consideró un defecto visual.
- Captura de escritorio con contexto: `comparativa/capturas/slides-foto-desktop-full.png`.
- Componente normalizado: `comparativa/capturas/slides-foto-desktop.png`.
- Comparación conjunta: `design/slide-photo-comparison.png` (referencia arriba, implementación abajo).
- Comparación enfocada de datos: `design/slide-photo-details-comparison.png` (referencia a la izquierda, implementación a la derecha).
- Celular: `comparativa/capturas/slides-foto-movil.png` y `comparativa/capturas/slides-foto-movil-datos.png`, viewport 390 × 844. También se comprobó la geometría a 320 × 740 y a 768 × 1024.

## Historial de correcciones

1. **P1 corregido — estructura del carrusel.** En la primera vista local, el contenedor de pestañas quedó dentro de la fila de slides y reducía el ancho del banner. Se corrigió el cierre del contenedor. El DOM final contiene únicamente los tres slides dentro de `#slider-viewport`; las pestañas quedan debajo.
2. **P2 corregido — fondo limitado al ancho del contenido.** La foto inicial terminaba antes del borde de la sección y parecía un panel. Se extendió a `100vw`, con recorte exterior en la sección, sin generar desbordamiento horizontal.
3. **P2 corregido — encuadre de celular.** Se ajustó el punto de interés al 90% horizontal en la vista apilada, conservando los rostros visibles y colocando la lectura debajo de la fotografía.
4. **P2 corregido — variaciones de altura.** Los tres slides comparten una celda de cuadrícula y reservan la altura del contenido más alto. Medición a 390 píxeles: 894.09375 píxeles en los tres estados, sin saltos al navegar. En escritorio: 480.265625 píxeles.

Las capturas finales y las comparaciones indicadas arriba son la evidencia posterior a estas correcciones. No quedan hallazgos P0, P1 o P2 abiertos.

## Superficies de fidelidad revisadas

- **Tipografía:** Manrope para títulos e Inter para lectura y controles; se mantienen las fuentes locales del diseño aprobado. Se conservaron sus métricas originales en vez de reproducir diferencias de renderizado del mock generado. Menú de escritorio: seis enlaces de 11 píxeles y altura uniforme. Textos y botones son HTML, no parte de la foto.
- **Espaciado y composición:** texto a la izquierda, fotografía integrada a todo el fondo, franja inferior de datos y tres pestañas por debajo. En celular, foto arriba y contenido/datos apilados. No se detectó desbordamiento a 320, 390, 768 o 1339 píxeles.
- **Colores y contraste:** se conserva la paleta azul/índigo; el degradado oscurece la zona de lectura y la franja tiene un fondo opaco. Se mantienen los estados de foco y la preferencia de movimiento reducido del sitio.
- **Calidad de imagen:** tres recursos fotográficos individuales generados con composición y luz coherentes, sin textos ni interfaz incrustados. Cada uno tiene variantes WebP de 640, 1024 y 1600 píxeles. Las nueve variantes suman aproximadamente 437 KB. Se comprobó la carga de los tres recursos y sus rutas adaptables.
- **Contenido:** se conservan títulos, mensajes, llamadas a la acción, fechas y datos de cada slide. Los antiguos encabezados repetidos de las tarjetas dejan espacio a las fotos. Se conservan los párrafos explicativos bajo la franja; por eso su posición es algo más alta que en el mock. Las imágenes se identifican como “Fotografía referencial”.

## Interacciones y comprobaciones

- Tres pestañas: alternan imagen, contenido, contador y estado seleccionado.
- Teclado: flecha izquierda desde el primer slide cambia al tercero y actualiza el contador a 03.
- Pausa manual y estados de entrada conservados.
- Solo un slide visible; los demás permanecen ocultos visualmente y fuera del foco mediante `visibility`.
- Fotografías cargadas y sin desbordamiento de datos a 320 píxeles.
- CTA del primer slide lleva al formulario. Preparación de consulta y enlace de WhatsApp comprobados con datos ficticios, sin enviar mensajes.
- Consola del navegador: sin errores ni advertencias en la sesión de prueba.
- `npm run verify`: 55 archivos públicos, 70 referencias locales, sintaxis y rutas correctas; CSS comprimido 12.1 KB y JavaScript 6.7 KB.
- Auditoría de dependencias realizada tras añadir el optimizador: sin vulnerabilidades conocidas reportadas.

## Diferencias intencionales y pendientes

- Las fotografías son referencias temporales y no retratan personas ni instalaciones reales de Horizon Academia. Pendiente sustituirlas por los archivos del cliente y revisar sus nuevos puntos de interés.
- Los controles superiores de novedades y la cabecera del sitio original se mantienen fuera del recorte del mock.
- Se conservan los párrafos explicativos para no perder contenido confirmado; el mock mostraba únicamente la franja de datos.
- La miniatura histórica del comparador puede renovarse en una revisión posterior; el iframe del original carga la versión actual.
- No se han realizado nuevas pruebas en dispositivos físicos; las comprobaciones adaptables usan el navegador.

## Lista de implementación

- [x] Resolver la propuesta seleccionada y conservar su composición.
- [x] Integrar tres fotos individuales y rotular su carácter referencial.
- [x] Optimizar variantes de imagen y comprobar `srcset` y presupuesto de transferencia.
- [x] Comparar referencia e implementación normalizadas, incluyendo la región de datos.
- [x] Corregir estructura, anchura del fondo, encuadre y estabilidad de altura.
- [x] Probar carrusel, teclado y consulta por WhatsApp.
- [ ] Sustituir las referencias por las fotografías reales cuando las entregue el cliente.
