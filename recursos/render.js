// Exporta cualquier pieza hecha con recursos/bweb.js a PNG + MP4.
//
// Uso (desde la raíz del repo):
//   node recursos/render.js carrusel/precios            -> PNG + MP4 de todas las páginas
//   node recursos/render.js historias/semana-28-sep --png
//   node recursos/render.js historias/semana-28-sep --only 2,3
//
// Lee del <body>: data-name (prefijo de archivo), data-seconds (duración del video),
// data-still ("start" = primer cuadro, "end" = último cuadro, para el PNG).
// Cada <section class="page"> puede tener data-file con el nombre de archivo.
// Requiere Playwright (Chromium) y ffmpeg con libx264 (variable FFMPEG si no está en el PATH).

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let playwright;
try { playwright = require('playwright'); }
catch (e) { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const FPS = 30;
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const args = process.argv.slice(2);
const dir = path.resolve(args[0] || '.');
const pngOnly = args.includes('--png');
const oi = args.indexOf('--only');
const only = oi >= 0 ? args[oi + 1].split(',').map(Number) : null;

function seek(page, ms) {
  return page.evaluate(t => {
    document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; });
  }, ms);
}

(async () => {
  const url = 'file://' + path.join(dir, 'index.html');
  const browser = await playwright.chromium.launch();
  const probe = await browser.newPage();
  await probe.goto(url);
  const info = await probe.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      w: parseFloat(cs.getPropertyValue('--W')), h: parseFloat(cs.getPropertyValue('--H')),
      name: document.body.dataset.name || 'pieza',
      seconds: parseFloat(document.body.dataset.seconds || '8'),
      still: document.body.dataset.still || 'start',
      files: [...document.querySelectorAll('#track .page')].map(p => p.dataset.file || ''),
    };
  });
  await probe.close();

  const outPng = path.join(dir, 'export', 'png');
  const outMp4 = path.join(dir, 'export', 'mp4');
  fs.mkdirSync(outPng, { recursive: true });
  if (!pngOnly) fs.mkdirSync(outMp4, { recursive: true });

  const page = await browser.newPage({ viewport: { width: info.w, height: info.h }, deviceScaleFactor: 1 });
  for (let n = 1; n <= info.files.length; n++) {
    if (only && !only.includes(n)) continue;
    const base = info.files[n - 1] || `${info.name}-${String(n).padStart(2, '0')}`;
    await page.goto(url + '?export=' + n);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))));
    await page.waitForTimeout(150);

    await seek(page, info.still === 'end' ? info.seconds * 1000 - 100 : 0);
    await page.screenshot({ path: path.join(outPng, base + '.png') });

    if (!pngOnly) {
      const ff = spawn(FFMPEG, [
        '-y', '-loglevel', 'error',
        '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
        '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
        '-map', '0:v', '-map', '1:a', '-shortest',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', String(FPS),
        '-c:a', 'aac', '-b:a', '64k',
        '-movflags', '+faststart', path.join(outMp4, base + '.mp4'),
      ], { stdio: ['pipe', 'inherit', 'inherit'] });
      const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
      const frames = Math.round(FPS * info.seconds);
      for (let f = 0; f < frames; f++) {
        await seek(page, (f * 1000) / FPS);
        const buf = await page.screenshot({ type: 'png' });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      }
      ff.stdin.end();
      await done;
    }
    console.log(base + ' listo');
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
