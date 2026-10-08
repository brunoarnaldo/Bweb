/* Generador de link de reseñas de Google (página /link-resenas-google) */
(function () {
  'use strict';

  /* Clave de Google Maps Platform para buscar el negocio por nombre.
     Vacía = la búsqueda queda oculta y solo se puede pegar el link o el Place ID.
     Cómo sacarla y restringirla a bweb.uy: ver el README. */
  var GOOGLE_MAPS_KEY = '';
  var WHATSAPP = '59899788934';

  var $ = function (id) { return document.getElementById(id); };
  var pasteForm = $('tool-paste');
  if (!pasteForm) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var track = window.bwebTrack || function () {};
  var entrada = $('tool-entrada');
  var msg = $('tool-msg');
  var result = $('tool-result');
  var linkOut = $('tool-link');
  var nombreOut = $('tool-nombre');
  var copiar = $('tool-copiar');
  var copiarHtml = copiar.innerHTML;
  var qrBox = $('tool-qr-box');
  var qrCanvas = $('tool-qr');
  var busquedaActiva = false;

  var waBweb = function (texto) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto); };
  var linkDesdePlaceId = function (id) { return 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(id); };
  var PLACE_ID = /^[A-Za-z0-9_-]{20,}$/;

  /* ── Leer lo que pegó la persona: devuelve { link } o { error } ── */
  function interpretar(valor) {
    var v = valor.trim();
    if (!v) return { error: 'vacio' };
    if (PLACE_ID.test(v)) return { link: linkDesdePlaceId(v) };

    var url;
    try { url = new URL(/^https?:\/\//i.test(v) ? v : 'https://' + v); } catch (e) { return { error: 'invalido' }; }
    var host = url.hostname.toLowerCase().replace(/^www\./, '');

    // Links que ya traen el Place ID: writereview?placeid=, reviews?placeid=, ?q=place_id:
    var placeId = url.searchParams.get('placeid') || url.searchParams.get('place_id') || '';
    var q = url.searchParams.get('q') || '';
    if (!placeId && q.indexOf('place_id:') === 0) placeId = q.slice(9);
    if (PLACE_ID.test(placeId)) return { link: linkDesdePlaceId(placeId) };

    // Link oficial de «Pedir reseñas»: g.page/r/CODIGO/review
    var partes = url.pathname.split('/').filter(Boolean);
    if (host === 'g.page') {
      if (partes[0] === 'r' && /^[A-Za-z0-9_-]+$/.test(partes[1] || '')) return { link: 'https://g.page/r/' + partes[1] + '/review' };
      if (partes.length === 2 && partes[1] === 'review') return { link: 'https://g.page/' + partes[0] + '/review' };
    }

    // Links de Google Maps: llevan al negocio, no a la ventana de reseña
    if (host === 'g.page' || host === 'maps.app.goo.gl' || host === 'goo.gl' || /(^|\.)google\.[a-z.]+$/.test(host)) return { error: 'mapa' };
    return { error: 'invalido' };
  }

  /* ── Mensajes de ayuda debajo del campo ── */
  function avisar(tipo) {
    msg.textContent = '';
    msg.hidden = !tipo;
    if (!tipo) return;
    var textos = {
      vacio: 'Pegá el link de «Pedir reseñas» o el Place ID de tu negocio.',
      invalido: 'No reconocimos ese link. Tiene que ser el de «Pedir reseñas» (empieza con g.page/r/) o un Place ID (empieza con ChIJ).',
      mapa: 'Ese es el link de tu negocio en Google Maps: sirve para encontrarte, pero no abre la ventana de reseña. ' +
        (busquedaActiva ? 'Buscá tu negocio por nombre arriba, ' : 'Seguí los 3 pasos de abajo, ') + 'o '
    };
    msg.appendChild(document.createTextNode(textos[tipo]));
    if (tipo === 'mapa') {
      var a = document.createElement('a');
      a.href = waBweb('Hola Bweb, ¿me ayudan a sacar el link de reseñas de mi negocio? Este es mi link de Google Maps: ' + entrada.value.trim());
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'mandanos el link por WhatsApp';
      msg.appendChild(a);
      msg.appendChild(document.createTextNode(' y te lo armamos.'));
    }
  }

  /* ── Código QR en el canvas (PNG de ~1000 px, nítido para imprimir) ── */
  function dibujarQR(texto) {
    if (!window.qrcode) { qrBox.hidden = true; return; }
    var qr = window.qrcode(0, 'M');
    qr.addData(texto);
    qr.make();
    var modulos = qr.getModuleCount();
    var margen = 4;
    var escala = Math.max(1, Math.floor(1000 / (modulos + margen * 2)));
    var lado = (modulos + margen * 2) * escala;
    qrCanvas.width = lado;
    qrCanvas.height = lado;
    var ctx = qrCanvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, lado, lado);
    ctx.fillStyle = '#0B1220';
    for (var r = 0; r < modulos; r++) {
      for (var c = 0; c < modulos; c++) {
        if (qr.isDark(r, c)) ctx.fillRect((c + margen) * escala, (r + margen) * escala, escala, escala);
      }
    }
    qrBox.hidden = false;
  }

  /* ── Mostrar el resultado ── */
  function mostrar(link, nombre, metodo) {
    linkOut.value = link;
    nombreOut.textContent = nombre || 'Listo para compartir';
    copiar.innerHTML = copiarHtml;
    $('tool-probar').href = link;
    $('tool-compartir').href = 'https://wa.me/?text=' + encodeURIComponent('¡Gracias por elegirnos! ¿Nos dejás una reseña en Google? Te lleva un minuto: ' + link);
    $('tool-cartel').href = waBweb('Hola Bweb! Quiero comprar 1 cartel NFC de reseñas de Google ($1.200) programado con este link: ' + link + ' . Mi negocio es: ' + (nombre || ''));
    dibujarQR(link);
    result.hidden = false;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    track('LinkResenasGenerado', { metodo: metodo }, true);
  }

  pasteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var r = interpretar(entrada.value);
    avisar(r.error);
    if (r.link) mostrar(r.link, '', 'link');
  });

  /* ── Copiar y descargar ── */
  copiar.addEventListener('click', function () {
    var listo = function () {
      copiar.innerHTML = '<i class="bi bi-check-lg"></i> Copiado';
      setTimeout(function () { copiar.innerHTML = copiarHtml; }, 2000);
    };
    var aMano = function () {
      linkOut.select();
      try { if (document.execCommand('copy')) listo(); } catch (err) { /* queda seleccionado para copiar a mano */ }
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(linkOut.value).then(listo, aMano);
    else aMano();
  });

  $('tool-descargar').addEventListener('click', function () {
    qrCanvas.toBlob(function (blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'qr-resenas-google.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }, 'image/png');
  });

  /* ── Búsqueda por nombre con Google Places (solo si hay clave) ── */
  if (!GOOGLE_MAPS_KEY) return;

  var searchForm = $('tool-search');
  var q = $('tool-q');
  var lista = $('tool-sugerencias');
  var places = null;
  var token = null;
  var cargando = null;
  var timer = null;
  var pedido = 0;
  var items = [];
  var activo = -1;

  busquedaActiva = true;
  searchForm.hidden = false;
  $('tool-or').hidden = false;

  // Si la clave falla (vencida, sin facturación o sin permiso para este dominio), se vuelve a pegar el link
  function apagar() {
    busquedaActiva = false;
    searchForm.hidden = true;
    $('tool-or').hidden = true;
  }
  window.gm_authFailure = apagar;

  function cargar() {
    if (!cargando) {
      cargando = new Promise(function (resolve, reject) {
        window.bwebMapsListo = resolve;
        var s = document.createElement('script');
        s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(GOOGLE_MAPS_KEY) + '&loading=async&language=es&callback=bwebMapsListo';
        s.async = true;
        s.onerror = reject;
        document.head.appendChild(s);
      }).then(function () {
        return window.google.maps.importLibrary('places');
      }).then(function (lib) {
        places = lib;
        token = new lib.AutocompleteSessionToken();
      });
      cargando.catch(apagar);
    }
    return cargando;
  }

  function cerrar() {
    lista.hidden = true;
    q.setAttribute('aria-expanded', 'false');
    q.removeAttribute('aria-activedescendant');
    activo = -1;
  }

  function marcar(i) {
    var opciones = lista.querySelectorAll('[role="option"]');
    if (!opciones.length) return;
    activo = (i + opciones.length) % opciones.length;
    opciones.forEach(function (op, n) { op.setAttribute('aria-selected', n === activo ? 'true' : 'false'); });
    q.setAttribute('aria-activedescendant', opciones[activo].id);
    opciones[activo].scrollIntoView({ block: 'nearest' });
  }

  function elegir(i) {
    var it = items[i];
    if (!it) return;
    q.value = it.nombre;
    cerrar();
    token = new places.AutocompleteSessionToken();
    mostrar(linkDesdePlaceId(it.id), it.nombre, 'busqueda');
  }

  function pintar() {
    lista.textContent = '';
    activo = -1;
    if (!items.length) {
      var vacio = document.createElement('li');
      vacio.className = 'is-empty';
      vacio.textContent = 'No encontramos ese negocio. Probá agregando la ciudad.';
      lista.appendChild(vacio);
    }
    items.forEach(function (it, i) {
      var li = document.createElement('li');
      li.id = 'tool-op-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      var nombre = document.createElement('strong');
      nombre.textContent = it.nombre;
      var zona = document.createElement('span');
      zona.textContent = it.zona;
      li.appendChild(nombre);
      li.appendChild(zona);
      li.addEventListener('mousedown', function (e) { e.preventDefault(); }); // que el campo no pierda el foco
      li.addEventListener('click', function () { elegir(i); });
      lista.appendChild(li);
    });
    lista.hidden = false;
    q.setAttribute('aria-expanded', 'true');
  }

  function buscar() {
    var texto = q.value.trim();
    if (texto.length < 3) { cerrar(); return; }
    var este = ++pedido;
    cargar().then(function () {
      return places.AutocompleteSuggestion.fetchAutocompleteSuggestions({ input: texto, sessionToken: token });
    }).then(function (res) {
      if (este !== pedido) return; // llegó una respuesta vieja
      items = (res.suggestions || []).filter(function (s) { return s.placePrediction; }).map(function (s) {
        var p = s.placePrediction;
        return {
          id: p.placeId,
          nombre: p.mainText ? p.mainText.text : p.text.text,
          zona: p.secondaryText ? p.secondaryText.text : ''
        };
      });
      pintar();
    }).catch(apagar);
  }

  q.addEventListener('focus', function () { cargar().catch(function () {}); }, { once: true });
  q.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(buscar, 250);
  });
  q.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (lista.hidden) return;
      e.preventDefault();
      var paso = e.key === 'ArrowDown' ? 1 : -1;
      // Sin opción marcada: ↓ va a la primera y ↑ a la última
      marcar(activo < 0 ? (paso === 1 ? 0 : -1) : activo + paso);
    } else if (e.key === 'Escape') {
      cerrar();
    }
  });
  q.addEventListener('blur', cerrar);
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!lista.hidden && items.length) elegir(activo >= 0 ? activo : 0);
  });
})();
