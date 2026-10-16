(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WHATSAPP = '59899788934';
  // Las páginas de /en/ tienen <html lang="en">: ahí los textos que arma este archivo salen en inglés
  var EN = /^en/i.test(document.documentElement.lang);

  /* ── Píxel de Meta ──
     Pegá acá el ID del píxel (Administrador de eventos de Meta → tu píxel → Configuración).
     Mientras esté vacío, el píxel no se carga y no se mide nada. */
  var META_PIXEL_ID = '1099627716298995';

  if (META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // Manda un evento al píxel si está cargado
  var track = function (evento, datos) {
    if (window.fbq) window.fbq('track', evento, datos || {});
  };

  /* ── Medición de los botones de WhatsApp ──
     Cada toque cuenta como contacto. Los mensajes que hablan de una web («una web» o «website») van como diseño web. */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href^="https://wa.me/' + WHATSAPP + '"]');
    if (!link) return;
    var texto = '';
    try { texto = new URL(link.href).searchParams.get('text') || ''; } catch (err) { /* link sin texto */ }
    // \bweb: «una web» o «website» cuentan como diseño web, pero no el «Bweb» del saludo
    track('Contact', { content_category: /\bweb/i.test(texto) ? 'Diseño web' : 'General' });
  });

  /* ── Idioma: aviso para ver la página en el otro idioma ──
     Cada página en español tiene su versión en inglés en /en/ (y al revés), marcadas con <link rel="alternate" hreflang>.
     Si el navegador está en inglés y la página en español (o al revés), arriba aparece un aviso con el link.
     No redirige solo: así Google, que visita desde EE. UU. y en inglés, sigue viendo e indexando las dos versiones.
     Lo que elige la persona (el selector ES/EN, el link del aviso o cerrarlo) se recuerda en este navegador. */
  var LANG_KEY = 'bweb-lang';
  var idioma = EN ? 'en' : 'es';
  var otroIdioma = EN ? 'es' : 'en';
  var guardarIdioma = function (valor) {
    try { localStorage.setItem(LANG_KEY, valor); } catch (err) { /* sin almacenamiento: el aviso vuelve a salir */ }
  };
  var elegido = null;
  try { elegido = localStorage.getItem(LANG_KEY); } catch (err) { /* sin almacenamiento */ }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[data-lang]');
    if (link) guardarIdioma(link.dataset.lang);
  });

  var alterna = document.querySelector('link[rel="alternate"][hreflang="' + otroIdioma + '"]');
  var primero = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
  if (alterna && elegido !== idioma && (elegido === otroIdioma || primero.indexOf(otroIdioma) === 0)) {
    var aviso = EN
      ? { texto: 'Esta página también está en español.', link: 'Ver en español', cerrar: 'Cerrar' }
      : { texto: 'This page is also available in English.', link: 'Read in English', cerrar: 'Close' };
    // Solo la ruta (sin bweb.uy), para que también funcione en las vistas previas
    var destino = new URL(alterna.href).pathname + location.hash;
    var bar = document.createElement('div');
    bar.className = 'lang-bar';
    bar.lang = otroIdioma;
    bar.innerHTML = '<div class="container lang-bar-inner">' +
      '<p><i class="bi bi-translate" aria-hidden="true"></i> ' + aviso.texto + '</p>' +
      '<a href="' + destino + '" hreflang="' + otroIdioma + '" data-lang="' + otroIdioma + '">' + aviso.link + ' <i class="bi bi-arrow-right"></i></a>' +
      '<button class="lang-bar-close" type="button" aria-label="' + aviso.cerrar + '"><i class="bi bi-x-lg"></i></button>' +
      '</div>';
    bar.querySelector('button').addEventListener('click', function () {
      guardarIdioma(idioma);
      bar.remove();
    });
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* ── Header: fondo al hacer scroll ── */
  var header = document.getElementById('site-header');
  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ── Menú móvil ── */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  var isOpen = false;

  function setMenu(open) {
    isOpen = open;
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', EN ? (open ? 'Close menu' : 'Open menu') : (open ? 'Cerrar menú' : 'Abrir menú'));
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (header) header.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () { setMenu(!isOpen); });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (isOpen && window.innerWidth > 960) setMenu(false);
    });
  }

  /* ── Aparición al hacer scroll ── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── Preguntas frecuentes: tema activo en el índice ── */
  var faqNavLinks = Array.prototype.slice.call(document.querySelectorAll('.faq-nav a[href^="#"]'));
  if (faqNavLinks.length && 'IntersectionObserver' in window) {
    var groupObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        faqNavLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    faqNavLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) groupObserver.observe(target);
    });
  }

  /* ── Formulario de contacto: se envía con Web3Forms y llega por email ── */
  var leadForm = document.getElementById('lead-form');
  if (leadForm && window.fetch && window.FormData) {
    var leadBtn = leadForm.querySelector('button[type="submit"]');
    var leadBtnHtml = leadBtn.innerHTML;
    var leadStatus = leadForm.querySelector('.lead-status');
    var setStatus = function (tipo, texto) {
      leadStatus.className = 'lead-status' + (tipo ? ' is-' + tipo : '');
      leadStatus.textContent = texto;
    };

    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var datos = new FormData(leadForm);
      var necesita = datos.get('Necesita');
      // El asunto del email dice qué necesita y de qué negocio es, para ordenar los presupuestos.
      // Las opciones del formulario en inglés mandan el mismo texto en español; el asunto avisa que hay que responder en inglés.
      datos.set('subject', (EN ? 'Consulta web (en inglés): ' : 'Consulta web: ') + necesita + ' · ' + datos.get('Negocio'));
      leadBtn.disabled = true;
      leadBtn.textContent = EN ? 'Sending…' : 'Enviando…';
      setStatus('', '');

      fetch(leadForm.action, { method: 'POST', body: datos, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message);
          track('Lead', { content_category: 'Diseño web', content_name: necesita });
          leadForm.reset();
          setStatus('ok', EN
            ? 'Done! We got your message and will get back to you within 24 hours.'
            : '¡Listo! Recibimos tu consulta. Te escribimos por WhatsApp en menos de 24 horas.');
        })
        .catch(function () {
          setStatus('error', EN
            ? 'We couldn’t send it. Please try again or message us on WhatsApp.'
            : 'No se pudo enviar. Probá de nuevo o escribinos por WhatsApp.');
        })
        .then(function () {
          leadBtn.disabled = false;
          leadBtn.innerHTML = leadBtnHtml;
        });
    });
  }
})();
