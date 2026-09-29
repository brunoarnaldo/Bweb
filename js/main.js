(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Header: fondo al hacer scroll ── */
  var header = document.getElementById('site-header');
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  /* ── Link activo del menú según la sección visible ── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav .nav-link[href^="#"]'));
  var navSections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function updateActiveNav() {
    if (!navSections.length) return;
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = '';
    navSections.forEach(function (sec) {
      if (sec.offsetTop <= y) current = '#' + sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === current);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateHeader();
      updateActiveNav();
      ticking = false;
    });
  }, { passive: true });
  updateHeader();
  updateActiveNav();

  /* ── Menú móvil ── */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  var isOpen = false;

  function setMenu(open) {
    isOpen = open;
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
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

  /* ── Índice de la página de preguntas: grupo activo ── */
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

  /* ── Formulario de contacto (Web3Forms) ── */
  var form = document.getElementById('contact-form');
  if (form) {
    var success = document.getElementById('form-success');
    var error = document.getElementById('form-error');
    var btn = form.querySelector('.submit-btn');
    var btnHTML = btn.innerHTML;

    function showAlert(el, html) {
      el.innerHTML = html;
      el.style.display = 'block';
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      error.style.display = 'none';
      success.style.display = 'none';

      var nombre = form.querySelector('[name="nombre"]').value.trim();
      var email = form.querySelector('[name="email"]').value.trim();
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nombre || !email || !re.test(email)) {
        showAlert(error, '<i class="bi bi-exclamation-circle-fill"></i> Por favor completá tu nombre y un email válido.');
        return;
      }

      /* Sin clave de Web3Forms configurada: la consulta se envía por WhatsApp */
      var key = form.querySelector('[name="access_key"]').value;
      if (!key || key.indexOf('YOUR_') === 0) {
        var empresa = form.querySelector('[name="empresa"]').value.trim();
        var servicio = form.querySelector('[name="servicio"]').value;
        var mensaje = form.querySelector('[name="mensaje"]').value.trim();
        var texto = 'Hola Bweb! Soy ' + nombre + (empresa ? ' (' + empresa + ')' : '') + '.' +
          (servicio ? '\nNecesito: ' + servicio : '') +
          (mensaje ? '\n' + mensaje : '') +
          '\nMi email: ' + email;
        window.open('https://wa.me/59899788934?text=' + encodeURIComponent(texto), '_blank', 'noopener');
        showAlert(success, '<i class="bi bi-whatsapp"></i> Te abrimos WhatsApp con tu consulta lista para enviar.');
        return;
      }

      btn.textContent = 'Enviando…';
      btn.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data.success) throw new Error(data.message || 'Envío rechazado');
          form.reset();
          showAlert(success, '<i class="bi bi-check-circle-fill"></i> ¡Perfecto! Te contactamos en menos de 24 horas.');
        })
        .catch(function () {
          showAlert(error, '<i class="bi bi-exclamation-circle-fill"></i> No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp.');
        })
        .finally(function () {
          btn.innerHTML = btnHTML;
          btn.disabled = false;
        });
    });
  }
})();
