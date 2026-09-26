# Carrusel: «Tu cliente le preguntó a la IA»

Carrusel animado de 7 slides para Instagram/LinkedIn (1080 × 1350, 4:5) con la marca bweb.
Tema: SEO para buscadores con IA (GEO), o sea cómo lograr que ChatGPT, Gemini y compañía recomienden tu negocio.

| # | Slide | Animación |
|---|-------|-----------|
| 1 | Hook: «Tu cliente le preguntó a la IA. ¿Te recomendó a vos?» | Chat con la IA "escribiendo" y re-armando la respuesta, orbe IA flotando |
| 2 | Antes: 10 links. Ahora: 1 respuesta. | Lista de links que scrollea, flecha animada, respuesta de la IA destacada |
| 3 | Paso 01: una web que la IA entienda | Rayo de la IA "leyendo" la web, score de velocidad que se llena |
| 4 | Paso 02: tu ficha de Google al día | Pin que rebota en el mapa, estrellas que se llenan, reseñas que aparecen |
| 5 | Paso 03: preguntas frecuentes | Acordeón FAQ que se abre solo, la IA citando la respuesta |
| 6 | Paso 04: datos estructurados (schema) | El código se lee línea por línea y se ilumina en el resultado |
| 7 | CTA: diagnóstico gratis (DM «IA» / WhatsApp) | Logo 3D con objetos orbitando, checks que aparecen |

## Archivos

- `export/mp4/slide-01.mp4` … `slide-07.mp4`: videos de 8 s en loop perfecto (H.264, 30 fps). **Estos son los que se suben.**
- `export/png/slide-01.png` … `slide-07.png`: versión estática, por si preferís un carrusel de imágenes.
- `index.html`: el diseño fuente. Abrilo en el navegador para ver el carrusel animado (flechas ← → para navegar).
- `export.js`: regenera PNG y MP4 después de editar el HTML.

### Cómo subirlo a Instagram

1. Nueva publicación → seleccionar varios → elegí los 7 MP4 en orden.
2. Formato 4:5 (vertical), sin recortar.
3. El primer cuadro de cada video ya muestra el slide completo, así que la portada queda bien sin elegir una aparte.

### Regenerar después de editar

```bash
cd carrusel/ia-seo
node export.js              # PNG + MP4 de los 7 slides
node export.js --png        # solo PNG (rápido, para revisar)
node export.js --slides 1,7 # solo algunos slides
```

Necesita Playwright (Chromium) y `ffmpeg` con libx264. Si ffmpeg no está en el PATH: `FFMPEG=/ruta/a/ffmpeg node export.js`.

## Texto para el post (caption)

```
Tus clientes ya no solo googlean: le preguntan a la IA dónde comer, comprar o a quién contratar. 🤖📍

Y la IA no te muestra 10 resultados… te recomienda 2 o 3.
Si tu negocio no está entre ellos, para ese cliente no existe.

En el carrusel te dejamos los 4 pasos para que la IA te recomiende 👉
01 · Una web rápida y clara
02 · Tu ficha de Google al día
03 · Preguntas frecuentes en tu web
04 · Datos estructurados (schema)

¿Querés saber cómo te ve la IA hoy? Escribinos «IA» por DM y te hacemos un diagnóstico gratis de tu web y tu presencia en Google.

Guardalo para cuando actualices tu web 🔖

#SEO #InteligenciaArtificial #ChatGPT #MarketingDigital #DiseñoWeb #Pymes #NegociosLocales #Uruguay #Minas #Lavalleja #GoogleMaps #Emprendedores
```

### Respuesta rápida para los DM con «IA»

```
¡Hola! Gracias por escribir 🙌 Para armarte el diagnóstico gratis pasanos:
1) El link de tu web (si tenés)
2) El nombre de tu negocio como aparece en Google Maps
3) Tu ciudad
Te mandamos qué está bien, qué falta y cómo mejorar para que la IA te recomiende.
```
