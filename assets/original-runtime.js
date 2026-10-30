// Inicializar íconos Lucide
    if (window.lucide) lucide.createIcons();

    // Barra de progreso de lectura y botón flotante de volver arriba
    const progressBar = document.getElementById('scroll-progress-bar');
    const backToTopBtn = document.getElementById('btn-back-to-top');

    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }

      if (backToTopBtn) {
        if (scrollTop > 320) {
          backToTopBtn.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
          backToTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
          backToTopBtn.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
          backToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Sistema de animación Scroll Reveal con IntersectionObserver
    let scrollObserver;
    function initScrollReveal() {
      if (scrollObserver) {
        scrollObserver.disconnect();
      }

      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
      }

      scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            scrollObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => {
        el.classList.add('reveal-ready');
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 30) {
          el.classList.add('revealed');
        } else {
          el.classList.remove('revealed');
          scrollObserver.observe(el);
        }
      });
    }

    // Modal Aula Virtual
    function openAulaModal() {
      document.getElementById('modal-aula').classList.remove('hidden');
    }
    function closeAulaModal() {
      document.getElementById('modal-aula').classList.add('hidden');
    }

    // =========================================================================
    // MOTOR DINÁMICO DEL SLIDER DE NOTICIAS (PARTE 1)
    // =========================================================================
    const TOTAL_SLIDES = 3;
    const SLIDE_DURATION = 6000; // 6 segundos
    const PROGRESS_INTERVAL = 60; // Actualización fluida cada 60ms

    let currentNewsSlide = 0;
    let slideTimer = null;
    let slideProgress = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isSliderPaused = reducedMotion.matches;
    let isSliderHovered = false;
    let isSliderFocused = false;

    function updateSliderUI() {
      // 1. Visibilidad y animación de los slides
      const slides = document.querySelectorAll('.news-slide');
      slides.forEach((slide, idx) => {
        if (idx === currentNewsSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // 2. Contador numérico
      const currNum = document.getElementById('slide-current-num');
      if (currNum) {
        currNum.textContent = String(currentNewsSlide + 1).padStart(2, '0');
      }

      // 3. Pestañas inferiores dinámicas
      for (let i = 0; i < TOTAL_SLIDES; i++) {
        const tab = document.getElementById(`slider-tab-${i}`);
        const prog = document.getElementById(`tab-progress-${i}`);
        if (tab) {
          tab.setAttribute('aria-pressed', String(i === currentNewsSlide));
          if (i === currentNewsSlide) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        }
        if (prog && i !== currentNewsSlide) {
          prog.style.width = '0%';
        }
      }

      // Refrescar iconos
      if (window.lucide) lucide.createIcons();
    }

    function resetSlideProgress() {
      slideProgress = 0;
      const prog = document.getElementById(`tab-progress-${currentNewsSlide}`);
      if (prog) prog.style.width = '0%';
    }

    function goToSlide(index) {
      currentNewsSlide = (index + TOTAL_SLIDES) % TOTAL_SLIDES;
      resetSlideProgress();
      updateSliderUI();
    }

    function nextSlide() {
      goToSlide(currentNewsSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentNewsSlide - 1);
    }

    // Temporizador continuo para el avance de la barra de progreso
    function startSliderEngine() {
      if (slideTimer) clearInterval(slideTimer);
      slideTimer = setInterval(() => {
        if (isSliderPaused || isSliderHovered || isSliderFocused || document.hidden) return;

        slideProgress += (PROGRESS_INTERVAL / SLIDE_DURATION) * 100;
        const prog = document.getElementById(`tab-progress-${currentNewsSlide}`);
        if (prog) {
          prog.style.width = `${Math.min(100, slideProgress)}%`;
        }

        if (slideProgress >= 100) {
          nextSlide();
        }
      }, PROGRESS_INTERVAL);
    }

    function toggleSliderAutoPlay() {
      isSliderPaused = !isSliderPaused;
      updatePauseUI();
    }

    function updatePauseUI() {
      const icon = document.getElementById('slider-status-icon');
      const text = document.getElementById('slider-status-text');
      document.getElementById('slider-pause-btn').setAttribute('aria-pressed', String(isSliderPaused));
      document.getElementById('slider-pause-btn').setAttribute('aria-label', isSliderPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
      if (icon && text) {
        if (isSliderPaused) {
          icon.className = 'w-2 h-2 rounded-full bg-sky-400';
          text.textContent = 'Reanudar';
        } else {
          icon.className = 'w-2 h-2 rounded-full bg-emerald-400';
          text.textContent = 'Pausar';
        }
      }
    }

    // Configurar eventos de hover para pausar suavemente
    const sliderSection = document.getElementById('d2-noticias');
    if (sliderSection) {
      sliderSection.addEventListener('mouseenter', () => {
        isSliderHovered = true;
      });
      sliderSection.addEventListener('mouseleave', () => {
        isSliderHovered = false;
      });

      sliderSection.addEventListener('focusin', () => { isSliderFocused = true; });
      sliderSection.addEventListener('focusout', e => { isSliderFocused = sliderSection.contains(e.relatedTarget); });

      // Soporte táctil en móviles (Swipe)
      let touchStartX = 0;
      let touchEndX = 0;
      sliderSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      sliderSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff < 0) nextSlide();
          else prevSlide();
        }
      }, { passive: true });
    }

    // Navegación con teclado (Flechas ◄ ►)
    window.addEventListener('keydown', (e) => {
      if (!sliderSection.contains(e.target) || e.target.closest('input, select, textarea, [contenteditable]')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    });

    // =========================================================================
    // Selector de Pestañas de Modalidad en el Formulario (Parte 2)
    // =========================================================================
    function selectFormModality(btn, modality) {
      const tabBtns = document.querySelectorAll('.modality-tab-btn');
      tabBtns.forEach(b => {
        b.setAttribute('aria-pressed', String(b === btn));
        b.className = 'modality-tab-btn py-2 text-xs font-bold rounded-lg transition-all text-slate-600 hover:text-slate-900';
      });
      btn.className = 'modality-tab-btn py-2 text-xs font-black rounded-lg transition-all bg-[#1e1b4b] text-white shadow';
      const hiddenInput = document.getElementById('selected-modality-input');
      if (hiddenInput) {
        hiddenInput.value = modality;
      }
    }

    // Inicializaciones al cargar el DOM
    window.addEventListener('DOMContentLoaded', () => {
      handleScroll();
      initScrollReveal();
      updateSliderUI();
      updatePauseUI();
      startSliderEngine();
    });
