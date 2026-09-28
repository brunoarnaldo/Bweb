# Recursos compartidos para piezas de redes

Base común de los carruseles, historias y reels de bweb (las piezas nuevas desde `carrusel/precios`).

- `bweb.css`: colores de marca, tipografías, fondos, objetos 3D (orbe IA, monedas, pines), tarjetas y animaciones.
- `bweb.js`: íconos y gradientes SVG, visor con flechas y modo `?export=N`.
- `render.js`: exporta cualquier pieza a PNG + MP4.
- `fonts/`: Bricolage Grotesque, Inter Tight y JetBrains Mono (subset latino).

## Exportar

Desde la raíz del repo:

```bash
node recursos/render.js carrusel/precios                 # PNG + MP4 de todas las páginas
node recursos/render.js historias/semana-28-sep --png    # solo PNG (rápido, para revisar)
node recursos/render.js historias/semana-28-sep --only 2,3
```

Necesita Playwright (Chromium) y `ffmpeg` con libx264. Si ffmpeg no está en el PATH: `FFMPEG=/ruta/a/ffmpeg node recursos/render.js …`.

## Armar una pieza nueva

Copiá el `index.html` de una pieza parecida y cambiá los textos. En el `<body>`:

- `data-seconds`: duración del video (carruseles 8, historias 8, reel 12).
- `data-still`: `start` para carruseles en loop (el primer cuadro ya está completo), `end` para historias y reels (el último cuadro).
- `data-name` o `data-file` en cada `<section class="page">`: nombre de los archivos exportados.

Tamaño: `--H:1350px` (carrusel 4:5) o `--H:1920px` (historia/reel 9:16).

**Carruseles en loop:** todas las animaciones deben durar 1, 2, 4 u 8 s y usar solo delays negativos. Así el video vuelve al inicio sin salto.
