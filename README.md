# Bweb — sitio web

Sitio estático de [bweb.uy](https://bweb.uy): diseño web, mantenimiento y SEO para pymes de Uruguay y LATAM, más el cartel NFC de reseñas de Google.

Se publica en **Cloudflare Pages**. No necesita compilar nada: se publica la carpeta tal cual.

## Estructura

| Archivo | Qué es |
| --- | --- |
| `index.html` | Página de inicio |
| `preguntas-frecuentes.html` | Cartel NFC + preguntas frecuentes (con datos estructurados FAQPage y Product). En Cloudflare se ve como `bweb.uy/preguntas-frecuentes` |
| `404.html` | Página de error |
| `css/styles.css`, `js/main.js` | Estilos y comportamiento compartidos |
| `img/cartel-nfc-resenas-google.jpg` | Foto del cartel |
| `img/proyectos/` | Capturas de los proyectos del portfolio |
| `og-image.jpg`, `og-cartel-nfc.jpg` | Imágenes que aparecen al compartir el link (WhatsApp, redes) |
| `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-*.png`, `logo.png`, `site.webmanifest` | Íconos y logo |
| `robots.txt`, `sitemap.xml` | Para buscadores |
| `_headers` | Encabezados de seguridad y caché para Cloudflare Pages |

Las URLs públicas no llevan `.html` (Cloudflare Pages las redirige solo). Por eso los links internos, el canonical y el sitemap usan `/preguntas-frecuentes`.

## Ver el sitio en tu compu

```bash
npx serve .
```

Y abrí la URL que te muestra (por ejemplo http://localhost:3000). `serve` maneja las URLs sin `.html` igual que Cloudflare.

## Publicar en Cloudflare Pages

### 1. Conectar el repositorio (una sola vez)

1. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elegí `brunoarnaldo/Bweb`.
2. Configuración de build:

   | Campo | Valor |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | `None` |
   | Build command | *(vacío)* |
   | Build output directory | `/` |

3. **Save and Deploy**. Cada vez que se mergea algo a `main`, Cloudflare publica solo. Las otras ramas generan una URL de vista previa (`*.pages.dev`) para revisar antes de mergear.

### 2. Dominio bweb.uy

1. El dominio tiene que estar en Cloudflare: **Add a site → bweb.uy** (plan Free). Después cambiá los nameservers en el registrador donde compraste el `.uy` por los dos que te da Cloudflare.
2. En el proyecto de Pages: **Custom domains → Set up a custom domain** y agregá `bweb.uy`. Repetí con `www.bweb.uy`.
3. Para tener una sola versión del sitio: **Rules → Redirect Rules → Create rule → plantilla "Redirect from WWW to root"** (301, conservando la ruta).
4. En **SSL/TLS → Edge Certificates** activá **Always Use HTTPS**.

## Indexar en Google

1. Entrá a [Google Search Console](https://search.google.com/search-console) y agregá una propiedad de tipo **Dominio** con `bweb.uy`.
2. Verificala con el registro **TXT** que te da Google. Como el DNS está en Cloudflare, Search Console puede cargarlo solo (elegí Cloudflare como proveedor). Si no, agregalo a mano en **DNS → Records** de Cloudflare.
3. En **Sitemaps**, enviá `https://bweb.uy/sitemap.xml`.
4. En **Inspección de URLs**, pegá `https://bweb.uy/` y tocá **Solicitar indexación**. Repetí con `https://bweb.uy/preguntas-frecuentes`.
5. Opcional: en [Bing Webmaster Tools](https://www.bing.com/webmasters) importá el sitio desde Search Console.
6. Recomendado para negocio local: creá o actualizá el **Perfil de Empresa de Google** con el link a bweb.uy.

Para probar los datos estructurados: [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results).
Para probar cómo se ve el link al compartirlo: pegá la URL en WhatsApp o en el [Sharing Debugger de Facebook](https://developers.facebook.com/tools/debug/).

## Formulario de contacto

Mientras no haya clave de Web3Forms, el formulario **abre WhatsApp con la consulta ya escrita**.

Para recibirlo por email: creá una clave gratis en [web3forms.com](https://web3forms.com) y reemplazá `YOUR_WEB3FORMS_ACCESS_KEY` en `index.html`.

## Cambios frecuentes

- **Precio del cartel:** buscá `1.200` / `1200` en `index.html` y `preguntas-frecuentes.html` (incluye los datos estructurados y los mensajes de WhatsApp).
- **Número de WhatsApp:** buscá `59899788934`.
- **Foto del cartel:** reemplazá `img/cartel-nfc-resenas-google.jpg` (fondo blanco, vertical).
- **Sumar un proyecto al portfolio** (sección Proyectos del inicio):
  1. Sacá una captura larga del sitio (de arriba hacia abajo) y guardala en `img/proyectos/` con 960 px de ancho, idealmente en `.webp`.
  2. En `index.html`, dentro de `<div class="projects-grid">`, copiá un `<article class="project-card">` completo y cambiá el link, el dominio, la imagen, las etiquetas, el lugar y la descripción.
  3. Con 3, 6 o 9 proyectos la grilla queda pareja en escritorio.
- Después de cambios importantes, actualizá `lastmod` en `sitemap.xml`.
