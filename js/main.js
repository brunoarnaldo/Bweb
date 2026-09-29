(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WHATSAPP = '59899788934';
  var PRECIO = 1200;

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

  /* ── Tienda: galería de fotos ── */
  var galleryImg = document.getElementById('gallery-img');
  var thumbs = document.querySelectorAll('.gallery-thumbs button');
  thumbs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      thumbs.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      galleryImg.src = btn.dataset.src;
      galleryImg.alt = btn.dataset.alt;
      galleryImg.classList.toggle('is-full', btn.dataset.full === 'true');
    });
  });

  /* ── Tienda: cantidad, total y mensaje de WhatsApp ── */
  var qtyInput = document.getElementById('qty');
  if (qtyInput) {
    var totalEl = document.getElementById('qty-total');
    var minus = document.querySelector('[data-qty-step="-1"]');
    var buyLinks = document.querySelectorAll('[data-buy-link]');
    var formato = function (n) { return '$' + n.toLocaleString('es-UY'); };

    var update = function () {
      var n = parseInt(qtyInput.value, 10);
      if (isNaN(n) || n < 1) n = 1;
      if (n > 99) n = 99;
      qtyInput.value = n;
      minus.disabled = n <= 1;
      totalEl.textContent = formato(n * PRECIO);
      var texto = n === 1
        ? 'Hola Bweb! Quiero comprar 1 cartel NFC de reseñas de Google ($1.200) programado con el link de mi negocio. Mi negocio es: '
        : 'Hola Bweb! Quiero comprar ' + n + ' carteles NFC de reseñas de Google (' + n + ' x $1.200 = ' + formato(n * PRECIO) + ') programados con el link de mi negocio. Mi negocio es: ';
      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
      buyLinks.forEach(function (a) { a.href = url; });
    };

    document.querySelectorAll('[data-qty-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + parseInt(btn.dataset.qtyStep, 10);
        update();
      });
    });
    qtyInput.addEventListener('change', update);
    qtyInput.addEventListener('input', function () { if (qtyInput.value !== '') update(); });
    update();
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
      // El asunto del email dice qué necesita y de qué negocio es, para ordenar los presupuestos
      datos.set('subject', 'Consulta web: ' + datos.get('Necesita') + ' · ' + datos.get('Negocio'));
      leadBtn.disabled = true;
      leadBtn.textContent = 'Enviando…';
      setStatus('', '');

      fetch(leadForm.action, { method: 'POST', body: datos, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message);
          leadForm.reset();
          setStatus('ok', '¡Listo! Recibimos tu consulta. Te escribimos por WhatsApp en menos de 24 horas.');
        })
        .catch(function () {
          setStatus('error', 'No se pudo enviar. Probá de nuevo o escribinos por WhatsApp.');
        })
        .then(function () {
          leadBtn.disabled = false;
          leadBtn.innerHTML = leadBtnHtml;
        });
    });
  }
})();
