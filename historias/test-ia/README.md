# Historia: «Test de 10 segundos»

Historia animada para Instagram (1080 × 1920, 9:16) que invita a la gente a preguntarle a la IA por su rubro y ver si su negocio aparece.
Complementa el carrusel `carrusel/ia-seo`.

**Qué pasa en los 10 segundos:** entra el título y un reloj cuenta de 0 a 10. En el chat se escribe «Recomendame *tu rubro* en *tu ciudad*», la IA "piensa" y responde con 3 lugares, y el tercero es «¿Tu negocio?». Después aparece «¿Apareciste?», una flecha dibuja hacia abajo (ahí va la encuesta) y al final el llamado «¿No? Escribinos «IA» por DM».

## Archivos

- `export/historia.mp4`: el video animado (10 s). **Este es el que se sube.**
- `export/historia.png`: versión estática (el último cuadro).
- `index.html`: el diseño fuente. En el navegador tiene botones para repetir la animación y ver las zonas seguras de Instagram.
- `export.js`: regenera el MP4 y el PNG (`node export.js`, o `node export.js --png`).

## Cómo subirla

1. Historia nueva → elegí `historia.mp4`.
2. Agregá el sticker de **Encuesta** en el espacio vacío debajo de «¿Apareciste?» (donde apunta la flecha):
   - Pregunta: dejala vacía (ya está en el diseño) o poné «¿Apareciste?».
   - Opción 1: `Sí, aparecí`
   - Opción 2: `No aparecí`
3. Opcional: sticker de **Mención** a @bweb_uy o de **Enlace** a bweb.lat, chiquito, en una esquina.
4. Publicar.

## Después de publicar (lo más importante)

- Instagram te muestra **quién votó cada opción** (deslizá hacia arriba en tu historia → Resultados de la encuesta).
- A los que votaron **«No aparecí»** mandales un DM ese mismo día:

```
¡Hola! Vi que en la encuesta pusiste que no apareciste 😬
Es más común de lo que parece y casi siempre tiene arreglo.
Si querés, te hago un diagnóstico gratis de tu web y tu ficha de Google
y te digo qué cambiar para que la IA te empiece a recomendar. ¿Te lo paso?
```

- Los que votaron **«Sí, aparecí»** también son contactos: podés preguntarles en qué puesto salieron. Si no fue el 1, ya hay tema de conversación.
- Guardá la historia en un destacado (por ejemplo «IA» o «Test») para que siga trabajando después de las 24 h.
