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
| `link-resenas-google.html` | `/link-resenas-google` | Generador gratis de link de reseñas de Google con QR; al final ofrece el cartel con ese link |
| `politica-de-privacidad.html` | `/politica-de-privacidad` | Política de privacidad (formulario, WhatsApp, píxel de Meta, generador) |
| `404.html` | — | Página de error |
| `css/styles.css`, `js/main.js` | | Estilos y comportamiento compartidos (galería, cantidad y total de la tienda, menú, píxel de Meta) |
| `js/link-resenas.js` | | El generador de link de reseñas: lee el link pegado, arma el QR y, con clave de Google, busca el negocio por nombre |
| `img/` | | Foto y detalles del cartel; `img/proyectos/` tiene las capturas de los proyectos |
| `og-image.jpg`, `og-cartel-nfc.jpg` | | Imágenes que aparecen al compartir el link (WhatsApp, redes) |
| `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-*.png`, `logo.png`, `site.webmanifest` | | Íconos y logo |
| `robots.txt`, `sitemap.xml` | | Para buscadores |
| `_headers` | | Encabezados de seguridad y caché |
| `wrangler.jsonc` | | Configuración del Worker de Cloudflare: URLs sin `.html` y `404.html` para las rutas que no existen |
| `.assetsignore` | | Archivos del repositorio que no se publican (`.git`, este README, configuración) |
| `vercel.json` | | URLs sin `.html` en las vistas previas de Vercel |
| `MARKETING.md` | | Guía de Meta Ads: eventos del píxel, campaña del cartel, video, audiencias y oferta a compradores (no se publica) |

El header, el menú y el footer se repiten en las seis páginas (todas menos la 404): si cambiás un link ahí, cambialo en todas.

Las URLs públicas no llevan `.html` (Cloudflare las redirige solo). Por eso los links internos, el canonical y el sitemap usan `/proyectos`, `/preguntas-frecuentes`, etc.

## Ver el sitio en tu compu

```bash
npx serve .
```

Y abrí la URL que te muestra (por ejemplo http://localhost:3000). `serve` maneja las URLs sin `.html` igual que Cloudflare.

## Publicar en Cloudflare

El repositorio está conectado al Worker **bweb** (Workers Builds). Cada vez que se mergea algo a `main`, Cloudflare publica solo con lo que dice `wrangler.jsonc`.

Cloudflare sirve las páginas sin `.html` (`/proyectos` muestra `proyectos.html`), igual que los links del sitio, y muestra `404.html` cuando la ruta no existe.

Todo lo que está en la carpeta se publica, salvo lo que figura en `.assetsignore`. Si sumás un archivo que no tiene que verse en el sitio (notas, configuración), agregalo ahí.

### Dominio bweb.uy

1. El dominio tiene que estar en Cloudflare: **Add a site → bweb.uy** (plan Free). Después cambiá los nameservers en el registrador donde compraste el `.uy` por los dos que te da Cloudflare.
2. En el Worker **bweb**: **Settings → Domains & Routes → Add → Custom domain** y agregá `bweb.uy`. Repetí con `www.bweb.uy`.
3. Para tener una sola versión del sitio: **Rules → Redirect Rules → Create rule → plantilla "Redirect from WWW to root"** (301, conservando la ruta).
4. En **SSL/TLS → Edge Certificates** activá **Always Use HTTPS**.

## Indexar en Google

1. Entrá a [Google Search Console](https://search.google.com/search-console) y agregá una propiedad de tipo **Dominio** con `bweb.uy`.
2. Verificala con el registro **TXT** que te da Google. Como el DNS está en Cloudflare, Search Console puede cargarlo solo (elegí Cloudflare como proveedor). Si no, agregalo a mano en **DNS → Records** de Cloudflare.
3. En **Sitemaps**, enviá `https://bweb.uy/sitemap.xml`.
4. En **Inspección de URLs**, pegá `https://bweb.uy/` y tocá **Solicitar indexación**. Repetí con `https://bweb.uy/cartel-nfc-resenas-google`, `https://bweb.uy/link-resenas-google`, `https://bweb.uy/proyectos` y `https://bweb.uy/preguntas-frecuentes`.
5. Opcional: en [Bing Webmaster Tools](https://www.bing.com/webmasters) importá el sitio desde Search Console.
6. Recomendado para negocio local: creá o actualizá el **Perfil de Empresa de Google** con el link a bweb.uy.

Para probar los datos estructurados: [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results).
Para probar cómo se ve el link al compartirlo: pegá la URL en WhatsApp o en el [Sharing Debugger de Facebook](https://developers.facebook.com/tools/debug/).

## Píxel de Meta

El píxel «Bweb» (ID `1099627716298995`) está en `js/main.js`, en `META_PIXEL_ID`. Se carga desde ahí en todas las páginas que usan `js/main.js`: no hace falta pegar el código de Meta en el HTML. Si lo dejás vacío (`''`), el píxel se apaga.

1. Cuando Cloudflare publique, abrí el [Administrador de eventos](https://business.facebook.com/events_manager2) → **Probar eventos** con `bweb.uy`: tiene que aparecer `PageView`.
2. Verificá el dominio en **Configuración del negocio → Seguridad de la marca → Dominios** con el registro **TXT** en el DNS de Cloudflare.

Eventos que manda el sitio:

| Evento | Cuándo |
| --- | --- |
| `PageView` | En todas las páginas |
| `ViewContent` | Al entrar a la tienda del cartel (valor $1.200 UYU) |
| `InitiateCheckout` | Al tocar cualquier botón «Comprar» de WhatsApp (con la cantidad y el total) |
| `Contact` | Al tocar cualquier otro botón de WhatsApp (`content_category`: Cartel NFC, Diseño web o General) |
| `Lead` | Al enviar el formulario de diseño web |
| `LinkResenasGenerado` (propio) | Al generar un link en el generador (`metodo`: link o búsqueda) |

Los botones de WhatsApp se miden solos, por el texto del mensaje: un mensaje que dice «Quiero comprar N cartel…» cuenta como compra iniciada. Si cambiás ese texto, revisá `js/main.js`. Cómo usar estos eventos en los anuncios: ver `MARKETING.md`.

## Generador de link de reseñas

Sin configurar nada, el generador funciona pegando el link de «Pedir reseñas» (`g.page/r/…`) o el Place ID (`ChIJ…`): arma el link, el QR descargable y el botón para pedir el cartel con ese link.

Para que también se pueda **buscar el negocio por nombre**, hace falta una clave de Google Maps Platform:

1. En [Google Cloud](https://console.cloud.google.com) creá un proyecto «Bweb» y activá la facturación (Google pide una tarjeta, pero da miles de búsquedas gratis por mes).
2. En **APIs y servicios → Biblioteca**, activá **Maps JavaScript API** y **Places API (New)**.
3. En **Credenciales → Crear credenciales → Clave de API**, restringila: **Sitios web** `bweb.uy/*` y `www.bweb.uy/*` (y `localhost:*` para probar), y **APIs** solo esas dos.
4. En **Cuotas** de Places API (New), poné un límite diario (por ejemplo 300 solicitudes) y una alerta de presupuesto, para no llevarte sorpresas.
5. Pegá la clave en `js/link-resenas.js`: `var GOOGLE_MAPS_KEY = 'AIza…';`.

La clave queda visible en la página: es normal para claves de navegador, lo que la protege es la restricción por sitio. Si Google la rechaza, la búsqueda se oculta sola y queda la opción de pegar el link.

## Cambios frecuentes

- **Precio del cartel:** está en todas las páginas (menú, textos, datos estructurados y mensajes de WhatsApp), en `js/main.js` (`PRECIO`, que calcula el total según la cantidad y el valor que se manda al píxel) y en `js/link-resenas.js` (mensaje para pedir el cartel con el link generado). Buscá `1.200` y `1200`.
- **Pack de 3 ($3.000):** las opciones de la tienda son los `<input name="pack">` de `cartel-nfc-resenas-google.html`: `data-unidades` es cuántos carteles trae y `data-precio` el precio. `js/main.js` arma el total y el mensaje de WhatsApp con esos datos. El pack también se menciona en `index.html` (precio del inicio) y en `preguntas-frecuentes.html` (precio y datos estructurados). Buscá `3.000`.
- **Descuento en la web para compradores del cartel ($1.200 dentro de los 60 días):** está en `cartel-nfc-resenas-google.html` («Por qué comprarlo en Bweb») y en `preguntas-frecuentes.html` (pregunta y datos estructurados).
- **Envíos y devoluciones del cartel:** están en `cartel-nfc-resenas-google.html` (nota debajo del botón de compra, tarjetas «Envíos a todo Uruguay» y «Devoluciones», preguntas y datos estructurados `shippingDetails` y `hasMerchantReturnPolicy`) y en `preguntas-frecuentes.html` (preguntas y datos estructurados). Buscá `días hábiles`.
- **Número de WhatsApp:** buscá `59899788934` en las páginas, en `js/main.js` y en `js/link-resenas.js`.
- **Formulario de contacto:** está en `index.html` (sección `#contacto`, dentro de «¿Querés una web así para tu negocio?») y se envía con [Web3Forms](https://web3forms.com). Las consultas llegan al email con el que se creó la clave (`access_key` en el formulario). El asunto trae lo que necesita y el negocio, por ejemplo «Consulta web: Un sitio con varias secciones · Peluquería en Minas». Para recibirlas en otro email, generá una clave nueva en web3forms.com con ese email y reemplazala en `index.html`. El envío y los mensajes de «Listo» o error están en `js/main.js`.
- **Fotos del cartel:** reemplazá los archivos en `img/` manteniendo el nombre (fondo blanco).
- **Sumar un proyecto:**
  1. Sacá una captura larga del sitio (de arriba hacia abajo) y guardala en `img/proyectos/` con 960 px de ancho, idealmente en `.webp`.
  2. En `proyectos.html`, copiá una `<section class="section" id="...">` completa y cambiá el `id`, el link, la imagen, las etiquetas, **Qué se buscó** y **Cómo lo resolvimos**. Sumá el link en la fila de accesos de arriba.
  3. En `index.html`, copiá un `<article class="project-card">` dentro de `projects-grid` con el resumen y el link `/proyectos#id`.
- Después de cambios importantes, actualizá `lastmod` en `sitemap.xml`.
