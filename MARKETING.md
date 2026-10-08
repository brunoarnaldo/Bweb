# Bweb — Meta Ads

Guía para vender el cartel NFC con anuncios y usar a esos compradores para vender webs. Este archivo no se publica en el sitio (está en `.assetsignore`).

Los números de costos son estimaciones: la prueba de 3 semanas te da los tuyos.

## Antes de gastar

1. **Píxel activo:** ya está en el sitio (ID `1099627716298995`). Cuando se publique, confirmá en el Administrador de eventos → Probar eventos que llega `PageView`. Sin el píxel no hay audiencias para el retargeting.
2. **WhatsApp Business conectado** a la página de Facebook de Bweb (Configuración de la página → WhatsApp), con el número 099 788 934.
3. **Planilla de ventas** (abajo). Las ventas se cierran en WhatsApp, así que Meta no las ve: las anotás vos.
4. **Tu número de corte.** Con el cartel a $1.200 (≈ USD 30), si te cuesta unos USD 8 y en promedio venden 1,3 por pedido, cada pedido te deja ≈ USD 28. **Si cada venta te cuesta más de USD 25 en anuncios, casi no te deja ganancia.** Cambiá el costo por el real.
5. **El pack de 3 cambia la cuenta.** A $3.000 (≈ USD 75) y unos USD 24 de costo, un pack te deja ≈ USD 50. Cuantos más pedidos sean packs, más podés pagar por cada venta. Anotá en la planilla cuántos pedidos son packs.

## Campaña 1 · Cartel (prueba de 3 semanas)

| Opción | Qué elegir |
| --- | --- |
| Objetivo | **Interacción** |
| Lugar de la conversión | **Apps de mensajes → WhatsApp** |
| Meta de rendimiento | Maximizar las conversaciones |
| Presupuesto | **USD 5 por día**, 21 días (≈ USD 105) |
| Público | Uruguay, 25 a 65 años, público Advantage+ (amplio, sin intereses al principio) |
| Ubicaciones | Advantage+ (automáticas) |

**Mensaje que el cliente manda al tocar el anuncio** (así sabés qué chats vienen de un anuncio):

> Hola! Vi el anuncio del cartel NFC de reseñas. Mi negocio es:

**Anuncios** (3 a la vez, Meta reparte el gasto hacia el que mejor funciona):

- **A · Video** hecho con Gemini (ver abajo).
- **B · Foto** del cartel en el mostrador (`img/cartel-nfc-resenas-google.jpg`).
- **C · Carrusel** con las 3 fotos de `img/`.

**Textos:**

- Principal 1: «¿Tus clientes se van contentos pero no te dejan reseña? Con el cartel NFC acercan el celular y se abre tu página de reseñas de Google. Sin app ni pilas. $1.200, o pack de 3 a $3.000 para la caja y las mesas. Programado con tu link y con envío a todo Uruguay.»
- Principal 2: «Cada cliente contento que se va sin dejarte reseña es una venta que perdés en Google. Ponelo en el mostrador y que te la dejen en 5 segundos. $1.200 · Pack de 3 a $3.000 · Envíos a todo Uruguay.»
- Título: «Más reseñas en Google, con un toque»
- Descripción: «$1.200 · Pack de 3 a $3.000»

**Qué revisar cada 3 o 4 días:**

| Si pasa esto | Hacé esto |
| --- | --- |
| Gastaste USD 30 y cada chat cuesta más de USD 3 | Cambiá el video o la foto del anuncio que peor anda |
| Gastaste USD 60 y cada venta cuesta más de USD 25 | Pausá ese anuncio |
| Cada venta cuesta menos de USD 15 | Subí el presupuesto un 20 % cada 3 días |

## Video con Gemini (Veo)

- En Gemini elegí **Video** y **subí la foto real del cartel** (`img/cartel-nfc-resenas-google.jpg`) como imagen de referencia, para que el producto sea el que entregás. Si el cartel del video no se parece al real, Meta puede rechazar el anuncio y el cliente se siente engañado.
- Formato **vertical 9:16**, 8 segundos.
- **Sin texto dentro del video** (la IA deforma las letras). Los textos los agregás después en CapCut o Canva.

Prompt (en inglés suele salir mejor):

```
Vertical 9:16 video, 8 seconds, realistic, warm natural light. A small café counter in Uruguay.
On the counter stands the acrylic table sign from the reference image, exactly as it looks:
white sign, "Google" logo, five stars. A customer's hand holding a smartphone moves close
and gently taps the top of the sign with the phone. The phone screen lights up with a
five-star review screen, and the thumb taps the fifth star. Close-up, shallow depth of field,
handheld camera feel, smooth motion. No added text, no other logos.
```

Variantes: cambiá «café counter» por «hair salon reception desk» o «restaurant table» y hacé 2 o 3 versiones.

Textos para poner encima en CapCut o Canva:

- 0 a 2 s: «¿Te faltan reseñas en Google?»
- 2 a 6 s: «Tus clientes acercan el celular… y listo»
- 6 a 8 s: «Cartel NFC · $1.200 · Pack de 3 a $3.000»

## Audiencias (retargeting)

En **Administrador de anuncios → Públicos → Crear público → Público personalizado**:

| Público | Origen | Regla |
| --- | --- | --- |
| Vieron el cartel · 30 días | Sitio web | Evento `ViewContent` |
| Tocaron Comprar · 30 días | Sitio web | Evento `InitiateCheckout` |
| Generaron link de reseñas · 60 días | Sitio web | Evento `LinkResenasGenerado` |
| Vieron proyectos · 60 días | Sitio web | URL contiene `/proyectos` |
| Compradores del cartel | Lista de clientes | CSV con los números en formato `+59899123456`. Actualizalo cada mes |

Meta necesita unas 100 personas en un público para mostrarle anuncios. Con poco tráfico eso puede tardar unas semanas: armá los públicos igual desde el primer día, porque se llenan solos.

## Campaña 2 · Recuperar el cartel

Cuando los públicos «Vieron el cartel», «Tocaron Comprar» y «Generaron link» sumen más de 100 personas:

- Mismo objetivo que la campaña 1 (Interacción → WhatsApp), **USD 1 a 2 por día**.
- Público: esos tres. **Excluí** a «Compradores del cartel».
- Texto: «¿Te quedó pendiente el cartel? Te lo mandamos programado con el link de tu negocio, listo para el mostrador. $1.200.»

## Campaña 3 · Webs para compradores

Cuando «Compradores del cartel» y «Vieron proyectos» sumen más de 100 personas:

- Objetivo Interacción → WhatsApp, **USD 2 por día**.
- Público: «Compradores del cartel» + «Vieron proyectos».
- Anuncio: carrusel con las capturas de `img/proyectos/` (Acá Cripto, La Barraquita y GRADIN).
- Texto: «Tus clientes ya te encuentran en Google. ¿Y cuando entran a tu web? Diseñamos webs a medida para negocios de Uruguay, listas en días.»

## Oferta a compradores del cartel (por WhatsApp)

La oferta también está publicada en la tienda («Por qué comprarlo en Bweb») y en las preguntas frecuentes. Igual mandala por WhatsApp de 7 a 10 días después de la entrega, cuando el cartel ya trajo reseñas:

> Hola {nombre}! ¿Cómo viene el cartel? ¿Ya te entraron reseñas nuevas? 🙌
>
> Te cuento algo: como ya sos cliente, si hacés tu web con Bweb en los próximos 60 días, te descontamos los $1.200 del cartel. Hacemos webs a medida, listas en días. ¿Te mando algunos ejemplos?

Los $1.200 (≈ USD 30) son entre el 6 % y el 15 % de una web de USD 200 a 500: un descuento chico para vos que hace la decisión fácil para el cliente. Cambialo si preferís otro.

La oferta es por la web, no por la reseña: nunca ofrezcas descuentos a cambio de reseñas, Google lo prohíbe.

## Venta en persona

Llevá un cartel de muestra programado con el link de un negocio real (el tuyo o el de un cliente) y dejá que lo prueben con su propio celular: el producto se vende solo cuando lo ven funcionar.

1. **Entrada:** «Hola, ¿cuántas reseñas tienen en Google? Te muestro algo en 10 segundos.»
2. **Demo:** que acerquen su celular al cartel y vean cómo se abre la reseña.
3. **Por qué:** «Los clientes contentos se van sin dejar reseña porque les da pereza buscarte. Con esto lo hacen en 5 segundos, ahí en la caja.»
4. **Oferta:** «Sale $1.200, o $3.000 el pack de 3 para la caja y las mesas. Te lo dejo programado con el link de tu negocio.»
5. **Cierre:** anotá el nombre del negocio y el WhatsApp, y coordinás el pago y la entrega por ahí.

Rubros para empezar: cafés, restaurantes, peluquerías, barberías, gimnasios, talleres, consultorios y comercios con mostrador.

## Planilla semanal

| Semana | Gasto USD | Chats | USD por chat | Pedidos | De esos, packs | Carteles | USD por venta | Consultas web | Webs vendidas | Ingresos USD |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | | | | |
| 2 | | | | | | | | | | |
| 3 | | | | | | | | | | |

**USD por venta** = gasto ÷ pedidos. Compará con tu número de corte (≈ USD 25). Las webs vendidas a compradores del cartel van en la misma fila: son las que hacen rentable la campaña aunque el cartel solo empate.
