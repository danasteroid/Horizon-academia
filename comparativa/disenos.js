const design = document.body.dataset.design;
const variants = {
  institucional: {
    eyebrow: 'HUARAZ · PREPARACIÓN PEDAGÓGICA',
    title: 'Tu vocación de enseñar <em>comienza aquí.</em>',
    intro: 'Prepárate para el examen de conocimientos y la entrevista personal del Pedagógico de Huaraz. Una meta clara, una preparación enfocada.',
    cta: 'Conoce nuestros ciclos', secondary: 'Conoce nuestro método',
    cycleTitle: 'Elige cómo dar<br>tu siguiente paso.',
    methodTitle: 'Prepararte bien es<br>entender lo que viene.',
  },
  editorial: {
    eyebrow: 'HORIZON ACADEMIA / ADMISIÓN 2027',
    title: 'Enseñar es tu vocación.<br><em>Prepararte es el primer paso.</em>',
    intro: 'Tu camino al Pedagógico de Huaraz merece una preparación que entienda lo que quieres lograr. Trabajamos contigo el examen y la entrevista personal.',
    cta: 'Hablemos de tu ingreso', secondary: 'Explora la preparación',
    cycleTitle: 'Cada punto de partida<br>tiene su propio ciclo.',
    methodTitle: 'Una preparación pensada<br>para futuros docentes.',
  },
  esencial: {
    eyebrow: 'ADMISIÓN 2027 · PEDAGÓGICO DE HUARAZ',
    title: 'Prepárate para el examen.<br><em>Destaca en la entrevista.</em>',
    intro: 'Preparación enfocada en tu ingreso al Pedagógico de Huaraz. Conocimientos, práctica y acompañamiento para llegar con más confianza.',
    cta: 'Quiero prepararme', secondary: 'Explorar ciclos',
    cycleTitle: 'Un ciclo para cada momento<br>de tu preparación.',
    methodTitle: 'La diferencia está<br>en cómo te preparas.',
  },
};
const v = variants[design];
const wa = 'https://wa.me/51989949451';
const cycles = [
  {id:'base', name:'Ciclo base', label:'CONSTRUYE TUS BASES', desc:'Para comenzar con una base sólida y avanzar paso a paso en tu preparación.', items:['Teoría desde cero','Material teórico y práctico','Simulacros quincenales','Acceso a la plataforma']},
  {id:'intensivo', name:'Ciclo intensivo', label:'ENTRENA CON PREGUNTAS', desc:'Una preparación práctica con bancos de preguntas de exámenes anteriores.', items:['Trabajo con exámenes pasados','Simulacros con ranking','Práctica enfocada en la evaluación']},
  {id:'repaso', name:'Ciclo repaso', label:'AFINA TU PREPARACIÓN', desc:'Refuerza lo aprendido en las últimas semanas antes del examen.', items:['Repaso de preguntas clave','Simulacros de conocimientos','Práctica de entrevista personal']},
];
const methods = [
  ['Preparación enfocada', 'Trabajamos el temario de admisión al pedagógico, con clases orientadas a lo que necesitas preparar.'],
  ['Entrevistas y debate', 'Practica cómo expresar tus ideas, participar en grupo y comunicarte con claridad frente a otros postulantes.'],
  ['Corrección en vivo', 'Recibe comentarios del docente después de intervenir y comprende cómo mejorar tus respuestas.'],
  ['Simulacros de admisión', 'Familiarízate con la estructura y el tiempo de evaluación. Aprende a manejar los nervios y el reloj.'],
  ['Progreso con propósito', 'Cada clase, material y evaluación tiene un objetivo: ayudarte a avanzar en tu preparación.'],
];
const faqs = [
  ['¿Para qué instituto me prepara Horizon?', 'Nuestra preparación está enfocada en el Instituto de Educación Superior Pedagógico Público Huaraz y contempla el examen de conocimientos y la entrevista personal.'],
  ['¿Puedo estudiar a distancia?', 'Sí. Horizon ofrece preparación presencial y a distancia. Consulta con el equipo qué ciclos y turnos están disponibles para cada modalidad.'],
  ['¿Cuándo comienzan las clases?', 'El inicio de clases del ciclo 2027 está previsto para el lunes 11 de enero. Hay turnos de mañana y tarde; consulta los horarios específicos de tu ciclo.'],
  ['¿Dónde son las clases presenciales?', 'La sede indicada es el Colegio Juan Kepler, en Nicrupampa, Av. Manco Cápac. Escríbenos para recibir las indicaciones de llegada.'],
  ['¿Cómo consulto los precios y la matrícula?', 'Escríbenos por WhatsApp para conocer precios, horarios, medios de pago y vacantes del ciclo que te interesa. El equipo te orientará antes de matricularte.'],
];
const prospectus = design === 'editorial' ? `
  <aside class="prospectus" aria-label="Información de admisión">
    <div class="prospectus-top"><span>HORIZON / CUADERNO DE ADMISIÓN</span><span>HUARAZ, PERÚ</span></div>
    <p class="prospectus-kicker">Tu próximo capítulo</p><p class="year">2027<span>PREPARACIÓN PEDAGÓGICA</span></p>
    <div class="prospectus-bottom"><p>El conocimiento se estudia.<br>La confianza también se practica.</p><a href="#metodo">Descubre el método</a></div>
  </aside>` : `
  <aside class="prospectus" aria-label="Preparación para admisión 2027">
    <div class="prospectus-top"><span>HORIZON ACADEMIA</span><span>HUARAZ · PERÚ</span></div>
    <p class="prospectus-kicker">${design === 'esencial' ? 'ADMISIÓN' : 'PREPARACIÓN PEDAGÓGICA'}</p>
    <p class="year">2027</p>
    <div class="preparation-line"><span>01</span><p>Examen de<br><strong>conocimientos</strong></p></div>
    <div class="preparation-line"><span>02</span><p>Entrevista<br><strong>personal</strong></p></div>
    <p class="prospectus-note">Dos etapas. Una preparación integral.</p>
  </aside>`;
document.body.innerHTML = `
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <div class="announcement"><div class="wrap"><span>ADMISIÓN 2027 <span class="announcement-separator">/</span> Matrículas abiertas</span><a href="${wa}" target="_blank" rel="noopener noreferrer">Informes: 989 949 451</a></div></div>
  <header class="site-header"><div class="wrap header-inner">
    <a class="brand" href="#inicio" aria-label="Horizon Academia, inicio"><img src="../assets/${design === 'esencial' ? 'logo-brand.png' : 'logo-dark.png'}" alt="Horizon Academia" width="820" height="295"></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="navigation">Menú</button>
    <nav id="navigation" aria-label="Navegación principal"><a href="#ciclos">Ciclos</a><a href="#metodo">Nuestro método</a><a href="#academia">La academia</a><a href="#preguntas">Preguntas</a><a class="nav-cta" href="#contacto">Solicitar información</a></nav>
  </div></header>
  <main id="contenido">
    <section class="hero" id="inicio"><div class="wrap hero-grid"><div class="hero-copy">
      <p class="eyebrow">${v.eyebrow}</p><h1>${v.title}</h1><p class="intro">${v.intro}</p>
      <div class="hero-actions"><a class="button" href="${design === 'institucional' ? '#ciclos' : '#contacto'}">${v.cta}</a><a class="text-link" href="${design === 'institucional' ? '#metodo' : '#ciclos'}">${v.secondary}</a></div>
      <p class="hero-footnote">Presencial y a distancia <span>·</span> Mañana y tarde</p>
    </div>${prospectus}</div></section>
    <div class="facts"><div class="wrap facts-grid"><div><span>INICIO DE CLASES</span><strong>11 de enero de 2027</strong></div><div><span>TURNOS</span><strong>Mañana y tarde</strong></div><div><span>MODALIDADES</span><strong>Presencial y a distancia</strong></div><div><span>SEDE PRESENCIAL</span><strong>Nicrupampa, Huaraz</strong></div></div></div>
    <section class="cycles section" id="ciclos"><div class="wrap">
      <div class="section-heading"><div><p class="eyebrow">01 / NUESTROS CICLOS</p><h2>${v.cycleTitle}</h2></div><p>Empieza desde las bases, intensifica la práctica o refuerza lo aprendido. Te orientamos para elegir.</p></div>
      <div class="cycle-list">${cycles.map((c,i)=>`<article class="cycle" data-cycle="${c.id}"><div class="cycle-number">0${i+1}</div><div class="cycle-name"><p class="eyebrow">${c.label}</p><h3>${c.name}</h3><p>${c.desc}</p></div><ul>${c.items.map(x=>`<li>${x}</li>`).join('')}</ul><a class="cycle-action" href="#contacto" data-select-cycle="${c.name}">Consultar este ciclo<span class="sr-only">: ${c.name}</span></a></article>`).join('')}</div>
    </div></section>
    <section class="method section" id="metodo"><div class="wrap">
      <div class="section-heading"><div><p class="eyebrow">02 / EL MÉTODO HORIZON</p><h2>${v.methodTitle}</h2></div><p>Conocer la respuesta es parte del camino. Aprender a explicarla también.</p></div>
      <div class="method-layout"><div class="method-lead"><p class="method-lead-label">EXAMEN + ENTREVISTA</p><h3>Estudia.<br>Practica.<br>Exprésate.</h3><p>Entrenamos conocimientos y comunicación, con práctica y comentarios que te ayudan a mejorar.</p><a class="text-link" href="#contacto">Conversemos sobre tu preparación</a></div>
      <ol class="method-list">${methods.map((m,i)=>`<li><span>0${i+1}</span><div><h3>${m[0]}</h3><p>${m[1]}</p></div></li>`).join('')}</ol></div>
      <div class="practice-strip"><div><span class="eyebrow">PRACTICA CON EL TIEMPO A TU FAVOR</span><p>Nuestros simulacros de conocimientos</p></div><div><strong>50</strong><span>preguntas</span></div><div><strong>90</strong><span>minutos</span></div><a class="text-link" href="#contacto">Consultar el próximo simulacro</a></div>
    </div></section>
    <section class="academy section" id="academia"><div class="wrap academy-grid"><div><p class="eyebrow">03 / CONOCE HORIZON</p><h2>Una meta compartida:<br><em>tu siguiente paso.</em></h2><p class="academy-intro">Somos una academia de preparación enfocada en quienes quieren formarse como docentes en Huaraz.</p><div class="experience"><strong>3</strong><span>años de experiencia<br>en preparación académica</span></div></div><div class="founder"><p class="eyebrow">UNA PREPARACIÓN CON PROPÓSITO</p><blockquote>“En Horizon nos enfocamos en el examen de admisión del pedagógico. Te preparamos con método y estrategia, trabajando tanto la prueba de conocimientos como la entrevista personal.”</blockquote><div class="founder-sign"><strong>Sebastian Pichí Barreto</strong><span>Fundador de Horizon Academia</span></div><p class="institute-note">Preparación orientada al Instituto de Educación Superior Pedagógico Público Huaraz.</p></div></div></section>
    <section class="faq section" id="preguntas"><div class="wrap faq-grid"><div><p class="eyebrow">04 / ANTES DE EMPEZAR</p><h2>Hablemos<br>con claridad.</h2><p>Si te queda alguna duda, estamos a un mensaje de distancia.</p><a class="text-link" href="${wa}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div><div>${faqs.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div></div></section>
    <section class="contact section" id="contacto"><div class="wrap contact-grid"><div><p class="eyebrow">TU SIGUIENTE PASO</p><h2>Mira hacia<br><em>tu horizonte.</em></h2><p>Cuéntanos qué necesitas y te ayudamos a encontrar el ciclo para ti.</p><a class="contact-phone" href="${wa}" target="_blank" rel="noopener noreferrer">989 949 451</a><p class="contact-hours">Atención: lunes a viernes, de 9 a. m. a 9 p. m.<br>Vacantes limitadas por aula.</p></div>
      <form id="information-form"><h3>Solicita información</h3><p>Prepara tu consulta y continúa por WhatsApp.</p><label for="name">¿Cómo te llamas?</label><input id="name" name="name" autocomplete="given-name" maxlength="80" placeholder="Tu nombre" required>
      <label for="cycle">¿Qué ciclo te interesa?</label><select id="cycle" name="cycle"><option>Necesito orientación</option>${cycles.map(c=>`<option>${c.name}</option>`).join('')}</select>
      <fieldset><legend>¿Cómo prefieres estudiar?</legend><div class="modality-options"><label><input type="radio" name="modality" value="Presencial" checked><span>Presencial</span></label><label><input type="radio" name="modality" value="A distancia"><span>A distancia</span></label></div></fieldset>
      <button class="button" type="submit">Preparar mi consulta</button><p class="form-note">Revisarás tu mensaje antes de abrir WhatsApp. No se envía ni se almacena desde esta página.</p>
      <div class="form-result" hidden aria-live="polite"><strong>Tu consulta está lista</strong><p class="message-preview"></p><a class="button" target="_blank" rel="noopener noreferrer">Continuar en WhatsApp</a><span>Puedes revisar y enviar el mensaje en WhatsApp.</span></div></form>
    </div></section>
  </main>
  <footer><div class="wrap"><div class="footer-grid"><div><a class="brand" href="#inicio"><img src="../assets/logo-brand.png" alt="Horizon Academia" width="820" height="295" loading="lazy"></a><p>Tu vocación, un horizonte.<br>Huaraz, Áncash, Perú.</p></div><div><h3>Visítanos</h3><p>Colegio Juan Kepler, Nicrupampa<br>Av. Manco Cápac, Huaraz</p><a href="mailto:sebaxsosozozo@gmail.com">sebaxsosozozo@gmail.com</a></div><div><h3>Encuéntranos</h3><a href="https://www.facebook.com/share/18LuZxsCVW/" target="_blank" rel="noopener noreferrer">Facebook</a><a href="https://www.instagram.com/horizon_academia24/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.tiktok.com/@horizon_academia69" target="_blank" rel="noopener noreferrer">TikTok</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Horizon Academia</span><span>Academia de preparación independiente.</span><a href="./">Comparar los 4 diseños</a></div></div></footer>`;

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => { const expanded = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!expanded)); nav.classList.toggle('is-open', !expanded); });
nav.addEventListener('click', e => {if(e.target.closest('a')) {menu.setAttribute('aria-expanded','false'); nav.classList.remove('is-open');}});
document.querySelectorAll('[data-select-cycle]').forEach(a => a.addEventListener('click', () => {document.querySelector('#cycle').value = a.dataset.selectCycle; resetResult();}));
const form = document.querySelector('#information-form');
function resetResult(){document.querySelector('.form-result').hidden=true;}
form.addEventListener('input', resetResult);
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  if(!name){document.querySelector('#name').setCustomValidity('Escribe tu nombre para continuar.');document.querySelector('#name').reportValidity();return;}
  const message = `Hola, Horizon Academia. Soy ${name}. Me interesa la preparación para admisión 2027 al Pedagógico de Huaraz. Ciclo: ${data.get('cycle')}. Modalidad: ${data.get('modality')}. ¿Podrían informarme sobre horarios, precios y matrícula?`;
  const result = document.querySelector('.form-result');
  result.querySelector('.message-preview').textContent = message;
  result.querySelector('a').href = `${wa}?text=${encodeURIComponent(message)}`;
  result.hidden=false;
});
document.querySelector('#name').addEventListener('input',e=>e.target.setCustomValidity(''));

// The content remains visible if animation support is unavailable.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const animated = document.querySelectorAll('.section-heading, .cycle, .method-lead, .method-list li, .academy-grid > div, .faq-grid > div, .contact-grid > div, .contact form, .practice-strip');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}
  }), {threshold:0.08});
  animated.forEach(element=>{element.classList.add('will-reveal');observer.observe(element);});
}
