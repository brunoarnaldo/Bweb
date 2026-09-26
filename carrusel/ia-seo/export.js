// Exporta cada slide del carrusel a PNG (1080x1350) y MP4 en loop (8s, 30fps).
//
// Uso:
//   node export.js                 -> PNG + MP4 de los 7 slides
//   node export.js --png           -> solo PNG
//   node export.js --slides 1,3    -> solo esos slides
//
// Requiere Playwright (Chromium) y ffmpeg con libx264.
// Ruta de ffmpeg configurable con la variable FFMPEG.

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let playwright;
try { playwright = require('playwright'); }
catch (e) { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const W = 1080, H = 1350, FPS = 30, SECONDS = 8, TOTAL = 7;
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const OUT = path.join(__dirname, 'export');
const args = process.argv.slice(2);
const pngOnly = args.includes('--png');
const si = args.indexOf('--slides');
const slides = si >= 0 ? args[si + 1].split(',').map(Number) : [...Array(TOTAL)].map((_, i) => i + 1);

function seek(page, ms) {
  return page.evaluate(t => {
    document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; });
  }, ms);
}

function encoder(file) {
  const ff = spawn(FFMPEG, [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-map', '0:v', '-map', '1:a', '-shortest',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '64k',
    '-movflags', '+faststart', file,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
  return { ff, done };
}

(async () => {
  fs.mkdirSync(path.join(OUT, 'png'), { recursive: true });
  if (!pngOnly) fs.mkdirSync(path.join(OUT, 'mp4'), { recursive: true });

  const browser = await playwright.chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const url = 'file://' + path.join(__dirname, 'index.html');

  for (const n of slides) {
    const id = String(n).padStart(2, '0');
    await page.goto(url + '?export=' + n);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);

    await seek(page, 0);
    await page.screenshot({ path: path.join(OUT, 'png', `slide-${id}.png`) });

    if (!pngOnly) {
      const file = path.join(OUT, 'mp4', `slide-${id}.mp4`);
      const { ff, done } = encoder(file);
      const frames = FPS * SECONDS;
      for (let f = 0; f < frames; f++) {
        await seek(page, (f * 1000) / FPS);
        const buf = await page.screenshot({ type: 'png' });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      }
      ff.stdin.end();
      await done;
    }
    console.log(`slide ${id} listo`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
