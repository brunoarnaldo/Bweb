# Bweb — sitio web

Sitio estático de [bweb.uy](https://bweb.uy): la tienda del cartel NFC de reseñas de Google y el estudio de diseño web de Bweb.

Se publica en **Cloudflare** (Worker `bweb` con archivos estáticos). No necesita compilar nada: se publica la carpeta tal cual.

## Estructura

| Archivo | URL pública | Qué es |
| --- | --- | --- |
| `index.html` | `/` | Inicio: entrada a la tienda, con accesos a proyectos y preguntas |
| `cartel-nfc-resenas-google.html` | `/cartel-nfc-resenas-google` | Tienda: página del cartel NFC con galería, cantidad y compra por WhatsApp |
| `proyectos.html` | `/proyectos` | Proyectos: qué se buscó con cada sitio y cómo lo resolvimos |
| `preguntas-frecuentes.html` | `/preguntas-frecuentes` | Preguntas frecuentes (con datos estructurados FAQPage) |
| `404.html` | — | Página de error |
| `css/styles.css`, `js/main.js` | | Estilos y comportamiento compartidos (galería, cantidad y total de la tienda, menú) |
| `img/` | | Foto y detalles del cartel; `img/proyectos/` tiene las capturas de los proyectos |
| `og-image.jpg`, `og-cartel-nfc.jpg` | | Imágenes que aparecen al compartir el link (WhatsApp, redes) |
| `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-*.png`, `logo.png`, `site.webmanifest` | | Íconos y logo |
| `robots.txt`, `sitemap.xml` | | Para buscadores |
| `_headers` | | Encabezados de seguridad y caché |
| `vercel.json` | | URLs sin `.html` en las vistas previas de Vercel |

El header, el menú y el footer se repiten en las cuatro páginas: si cambiás un link ahí, cambialo en todas.

Las URLs públicas no llevan `.html` (Cloudflare las redirige solo). Por eso los links internos, el canonical y el sitemap usan `/proyectos`, `/preguntas-frecuentes`, etc.

## Ver el sitio en tu compu

```bash
npx serve .
```

Y abrí la URL que te muestra (por ejemplo http://localhost:3000). `serve` maneja las URLs sin `.html` igual que Cloudflare.

## Publicar en Cloudflare

El repositorio está conectado al Worker **bweb** (Workers Builds) y la configuración del build está en el panel de Cloudflare. Cada vez que se mergea algo a `main`, Cloudflare publica solo.

Cloudflare sirve las páginas sin `.html` (`/proyectos` muestra `proyectos.html`), igual que los links del sitio.

### Dominio bweb.uy

1. El dominio tiene que estar en Cloudflare: **Add a site → bweb.uy** (plan Free). Después cambiá los nameservers en el registrador donde compraste el `.uy` por los dos que te da Cloudflare.
2. En el Worker **bweb**: **Settings → Domains & Routes → Add → Custom domain** y agregá `bweb.uy`. Repetí con `www.bweb.uy`.
3. Para tener una sola versión del sitio: **Rules → Redirect Rules → Create rule → plantilla "Redirect from WWW to root"** (301, conservando la ruta).
4. En **SSL/TLS → Edge Certificates** activá **Always Use HTTPS**.

## Indexar en Google

1. Entrá a [Google Search Console](https://search.google.com/search-console) y agregá una propiedad de tipo **Dominio** con `bweb.uy`.
2. Verificala con el registro **TXT** que te da Google. Como el DNS está en Cloudflare, Search Console puede cargarlo solo (elegí Cloudflare como proveedor). Si no, agregalo a mano en **DNS → Records** de Cloudflare.
3. En **Sitemaps**, enviá `https://bweb.uy/sitemap.xml`.
4. En **Inspección de URLs**, pegá `https://bweb.uy/` y tocá **Solicitar indexación**. Repetí con `https://bweb.uy/cartel-nfc-resenas-google`, `https://bweb.uy/proyectos` y `https://bweb.uy/preguntas-frecuentes`.
5. Opcional: en [Bing Webmaster Tools](https://www.bing.com/webmasters) importá el sitio desde Search Console.
6. Recomendado para negocio local: creá o actualizá el **Perfil de Empresa de Google** con el link a bweb.uy.

Para probar los datos estructurados: [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results).
Para probar cómo se ve el link al compartirlo: pegá la URL en WhatsApp o en el [Sharing Debugger de Facebook](https://developers.facebook.com/tools/debug/).

## Cambios frecuentes

- **Precio del cartel:** está en `index.html`, `cartel-nfc-resenas-google.html` y `preguntas-frecuentes.html` (textos, datos estructurados y mensajes de WhatsApp), y en `js/main.js` (`PRECIO`, que calcula el total según la cantidad). Buscá `1.200` y `1200`.
- **Número de WhatsApp:** buscá `59899788934` en las páginas y en `js/main.js`.
- **Fotos del cartel:** reemplazá los archivos en `img/` manteniendo el nombre (fondo blanco).
- **Sumar un proyecto:**
  1. Sacá una captura larga del sitio (de arriba hacia abajo) y guardala en `img/proyectos/` con 960 px de ancho, idealmente en `.webp`.
  2. En `proyectos.html`, copiá una `<section class="section" id="...">` completa y cambiá el `id`, el link, la imagen, las etiquetas, **Qué se buscó** y **Cómo lo resolvimos**. Sumá el link en la fila de accesos de arriba.
  3. En `index.html`, copiá un `<article class="project-card">` dentro de `projects-grid` con el resumen y el link `/proyectos#id`.
- Después de cambios importantes, actualizá `lastmod` en `sitemap.xml`.
