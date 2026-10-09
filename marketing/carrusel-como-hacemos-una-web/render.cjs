// Exporta el carrusel a PNG (una imagen por slide, 1080 × 1350) y a un PDF para LinkedIn.
// Uso, desde esta carpeta:  npm i -D playwright  &&  node render.cjs
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(dir, 'carrusel.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    const file = path.join(dir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await slides[i].screenshot({ path: file });
    console.log('✓', path.basename(file));
  }

  await page.addStyleTag({ content: '@page { size: 1080px 1350px; margin: 0 } body { background: none } .slide { margin: 0; break-after: page }' });
  await page.pdf({ path: path.join(dir, 'carrusel-como-hacemos-una-web.pdf'), width: '1080px', height: '1350px', printBackground: true });
  console.log('✓ carrusel-como-hacemos-una-web.pdf');

  await browser.close();
})();
