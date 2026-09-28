# Reel: «Hacé este test en 10 segundos»

Video vertical 1080 × 1920, 12 s. Se publica el **viernes 2/10** (ver `contenido/semana-28-sep.md`).

**Qué pasa:** un reloj cuenta hasta 10 mientras en el chat se escribe «Recomendame *tu rubro* en *tu ciudad*». La IA recomienda 3 lugares y el tercero es «¿Tu negocio?». Aparece «¿Apareciste?», el botón «Comentá SÍ o NO», dos comentarios de ejemplo y «Si pusiste NO, te escribimos para ayudarte».

Dejé libres las zonas donde Instagram pone el texto, el audio y los botones (en `index.html`, botón «Ver zonas de Instagram»).

## Archivos

- `export/mp4/reel-test-ia.mp4`: el que se sube.
- `export/png/reel-test-ia.png`: último cuadro (sirve de portada).
- Para regenerar, desde la raíz del repo: `node recursos/render.js reels/test-ia`.

## Al subirlo

1. Reel nuevo → elegí el video.
2. **Audio:** elegí uno en tendencia de la biblioteca de Instagram (los que tienen la flechita ↗). Bajale el volumen si tiene voz.
3. **Portada:** elegí el último cuadro («¿Apareciste?»).
4. Activá «Compartir también en el feed».

## Texto para el post

```
Hacé la prueba: abrí ChatGPT (o la IA que uses) y escribí «Recomendame [tu rubro] en [tu ciudad]» 🤖

¿Apareciste? Comentá SÍ o NO 👇
Si pusiste NO, te escribimos para contarte por qué y cómo arreglarlo.

#InteligenciaArtificial #ChatGPT #SEO #NegociosLocales #Pymes #Uruguay #MarketingDigital
```

**Después:** a cada «NO» respondele el comentario («¡Te escribo por DM!») y mandale el mensaje de «Votaron No aparecí» que está en `contenido/semana-28-sep.md`.
