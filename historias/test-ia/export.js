// Exporta la historia a MP4 (1080x1920, 10s, 30fps) y a PNG (último cuadro).
//
// Uso:
//   node export.js         -> PNG + MP4
//   node export.js --png   -> solo PNG
//
// Requiere Playwright (Chromium) y ffmpeg con libx264 (variable FFMPEG si no está en el PATH).

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let playwright;
try { playwright = require('playwright'); }
catch (e) { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const W = 1080, H = 1920, FPS = 30, SECONDS = 10;
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const OUT = path.join(__dirname, 'export');
const pngOnly = process.argv.includes('--png');

function seek(page, ms) {
  return page.evaluate(t => {
    document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; });
  }, ms);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?export');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);

  await seek(page, SECONDS * 1000 - 100);
  await page.screenshot({ path: path.join(OUT, 'historia.png') });

  if (!pngOnly) {
    const ff = spawn(FFMPEG, [
      '-y', '-loglevel', 'error',
      '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
      '-map', '0:v', '-map', '1:a', '-shortest',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', String(FPS),
      '-c:a', 'aac', '-b:a', '64k',
      '-movflags', '+faststart', path.join(OUT, 'historia.mp4'),
    ], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
    for (let f = 0; f < FPS * SECONDS; f++) {
      await seek(page, (f * 1000) / FPS);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await done;
  }
  await browser.close();
  console.log('historia lista');
})().catch(e => { console.error(e); process.exit(1); });
