/* bweb · visor y modo export compartido.
   Cada pieza es un HTML con:
     <body data-name="slide" data-seconds="8" data-still="start|end" data-title="...">
       <div class="viewer"> ... <div class="track" id="track"> <section class="page" data-file="..." data-label="..."> ...
   ?export=N muestra solo la página N a tamaño real (lo usa recursos/render.js). */
(function () {
  var SPRITE = '' +
  '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
  '<linearGradient id="gLupaRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#DCE2EC"/><stop offset="1" stop-color="#8793A8"/></linearGradient>' +
  '<radialGradient id="gLupaGlass" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#E9F2FF" stop-opacity=".95"/><stop offset=".55" stop-color="#9DB4F0" stop-opacity=".7"/><stop offset="1" stop-color="#5B7BD5" stop-opacity=".75"/></radialGradient>' +
  '<linearGradient id="gHandle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3A4E73"/><stop offset=".5" stop-color="#22355A"/><stop offset="1" stop-color="#101B30"/></linearGradient>' +
  '<linearGradient id="gPin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFA274"/><stop offset=".55" stop-color="#FF6B35"/><stop offset="1" stop-color="#D24A18"/></linearGradient>' +
  '<linearGradient id="gShield" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7DEBAA"/><stop offset=".5" stop-color="#22C55E"/><stop offset="1" stop-color="#128A42"/></linearGradient>' +
  '<linearGradient id="gBubble" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFA274"/><stop offset=".6" stop-color="#FF6B35"/><stop offset="1" stop-color="#D24A18"/></linearGradient>' +
  '<linearGradient id="gBubbleC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6D8C6"/></linearGradient>' +
  '<linearGradient id="gWarn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD27A"/><stop offset=".55" stop-color="#FFB547"/><stop offset="1" stop-color="#E08A12"/></linearGradient>' +
  '<linearGradient id="gShell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB08A"/><stop offset=".5" stop-color="#FF6B35"/><stop offset="1" stop-color="#C94A1B"/></linearGradient>' +
  '<linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3E4"/><stop offset="1" stop-color="#E8CFB2"/></linearGradient>' +
  '<symbol id="logo" viewBox="0 0 512 512"><rect width="512" height="512" rx="110" fill="#FF6B35"/><path fill="#1A1A1A" stroke="#1A1A1A" stroke-width="34" stroke-linejoin="round" stroke-linecap="round" d="M168 158 L356 232 L286 262 L356 292 L168 366 Z"/><path fill="#FF6B35" d="M216 195 L262 218 L216 241 Z"/><path fill="#FF6B35" d="M216 285 L262 308 L216 331 Z"/></symbol>' +
  '<symbol id="logo-mark" viewBox="0 0 512 512"><path fill="#1A1A1A" stroke="#1A1A1A" stroke-width="34" stroke-linejoin="round" stroke-linecap="round" d="M168 158 L356 232 L286 262 L356 292 L168 366 Z"/><path fill="#FF6B35" d="M216 195 L262 218 L216 241 Z"/><path fill="#FF6B35" d="M216 285 L262 308 L216 331 Z"/></symbol>' +
  '<symbol id="i-spark" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C12.8 6.4 17.6 11.2 24 12 17.6 12.8 12.8 17.6 12 24 11.2 17.6 6.4 12.8 0 12 6.4 11.2 11.2 6.4 12 0Z"/></symbol>' +
  '<symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.3l2.95 6.1 6.7.8-4.95 4.6 1.3 6.6L12 17.2 6 20.4l1.3-6.6-4.95-4.6 6.7-.8z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></symbol>' +
  '<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></symbol>' +
  '<symbol id="i-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15M6 13l6 6 6-6"/></symbol>' +
  '<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>' +
  '<symbol id="i-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></symbol>' +
  '<symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></symbol>' +
  '<symbol id="i-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></symbol>' +
  '<symbol id="i-pin" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22s7-6.3 7-12.2A7 7 0 0 0 5 9.8C5 15.7 12 22 12 22z"/><circle cx="12" cy="9.8" r="2.6" fill="#fff"/></symbol>' +
  '<symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>' +
  '<symbol id="i-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3-8.7 8.7z"/><circle cx="8.2" cy="8.2" r="1.6" fill="currentColor" stroke="none"/></symbol>' +
  '<symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></symbol>' +
  '<symbol id="i-bolt" viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 1.5L4 13.6h6.6L9.4 22.5 20 9.6h-6.7z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></symbol>' +
  '<symbol id="i-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></symbol>' +
  '<symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M4 5.5h16v10H9.5L5 19.5v-4H4z"/></symbol>' +
  '<symbol id="i-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3L3 10.5l7.2 3.3L13.5 21z"/><path d="M10.2 13.8L21 3"/></symbol>' +
  '<symbol id="i-layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 17l9 5 9-5"/></symbol>' +
  '<symbol id="i-cog" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></symbol>' +
  '<symbol id="i-image" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9.5" r="1.8" fill="currentColor" stroke="none"/><path d="M3.5 17l5-5 4 4 3-3 5 5"/></symbol>' +
  '<symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/></symbol>' +
  '<symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><rect x="6.5" y="2.5" width="11" height="19" rx="2.8"/><path d="M10.5 18.3h3" stroke-linecap="round"/></symbol>' +
  '<symbol id="i-alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 7.5v6"/><circle cx="12" cy="17" r="1.3" fill="currentColor" stroke="none"/></symbol>' +
  '<symbol id="i-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5" stroke-linecap="round"/></symbol>' +
  '<symbol id="i-code" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/></symbol>' +
  '</defs></svg>';
  document.body.insertAdjacentHTML('afterbegin', SPRITE);

  var root = document.documentElement;
  var cs = getComputedStyle(root);
  var W = parseFloat(cs.getPropertyValue('--W')) || 1080;
  var H = parseFloat(cs.getPropertyValue('--H')) || 1350;
  var track = document.getElementById('track');
  var pages = Array.prototype.slice.call(track.querySelectorAll('.page'));
  track.style.width = (W * pages.length) + 'px';

  var params = new URLSearchParams(location.search);
  var exp = parseInt(params.get('export'), 10);
  if (exp >= 1 && exp <= pages.length) {
    root.classList.add('export');
    pages.forEach(function (p, i) { if (i !== exp - 1) p.style.display = 'none'; });
    return;
  }

  var i = 0;
  var dots = document.getElementById('dots');
  var label = document.getElementById('vlabel');
  pages.forEach(function (_, k) {
    var d = document.createElement('i');
    d.addEventListener('click', function () { go(k); });
    dots.appendChild(d);
  });

  function fit() {
    var sc = Math.min((window.innerWidth - 32) / W, (window.innerHeight - 140) / H, 1);
    sc = Math.max(sc, .15);
    root.style.setProperty('--sc', sc);
    root.style.setProperty('--vw', (W * sc) + 'px');
    root.style.setProperty('--vh', (H * sc) + 'px');
  }
  function replay(p) {
    (p.getAnimations ? p.getAnimations({ subtree: true }) : []).forEach(function (a) { a.cancel(); a.play(); });
  }
  function go(k) {
    i = Math.max(0, Math.min(pages.length - 1, k));
    track.style.transform = 'translateX(' + (-i * W) + 'px)';
    Array.prototype.forEach.call(dots.children, function (d, n) { d.classList.toggle('on', n === i); });
    if (label) label.textContent = (pages[i].dataset.label || '') + '  ·  ' + (i + 1) + ' / ' + pages.length;
    document.getElementById('prev').disabled = i === 0;
    document.getElementById('next').disabled = i === pages.length - 1;
    if (document.body.dataset.replay !== 'no') replay(pages[i]);
  }
  document.getElementById('prev').onclick = function () { go(i - 1); };
  document.getElementById('next').onclick = function () { go(i + 1); };
  var rp = document.getElementById('replay');
  if (rp) rp.onclick = function () { replay(pages[i]); };
  var sf = document.getElementById('safe');
  if (sf) sf.onclick = function () { pages.forEach(function (p) { p.classList.toggle('show-safe'); }); };
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(i + 1);
    if (e.key === 'ArrowLeft') go(i - 1);
  });
  var x0 = null, fw = document.getElementById('frameWrap');
  fw.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
  fw.addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
  });
  window.addEventListener('resize', fit);
  fit(); go(0);
})();
