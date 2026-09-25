# Æther — Manual de marca para video

Documento interno · v1.0 · 2026
Tesis: **Tú llevas el negocio. Nosotros, lo demás.**

---

## Resumen para diseño (tokens)

```
COLOR
Vacío        #09090C   fondo oscuro por defecto
Carbón       #101014   tarjetas / planos elevados sobre el vacío
Hueso        #FAFAF9   fondo claro (reemplaza al blanco puro)
Tinta        #13131B   texto sobre claro (reemplaza al negro absoluto)
Bruma        #E3E1DE   texto sobre oscuro (blanco roto, cálido)
Peri claro   #A5A5CF   acento sobre oscuro
Peri profundo#4949A2   acento sobre claro
Peri logo    #C2C2FF   exclusivo del símbolo sobre oscuro
Gris frío    #838391   texto secundario, captions, timecodes
Línea        #1E1E25   bordes 1px sobre oscuro  (sobre hueso: #DDDDE3)

SEMÁNTICO (solo estados de interfaz, nunca decoración)
Verde resuelto  #337152  (dark #4E9C74)
Ámbar pendiente #E29612
Rojo error      #CA2B2B

PROPORCIÓN: 75% base · 20% secundario · 5% peri

TIPOGRAFÍA
Bricolage Grotesque  — titulares, cifras, wordmark   (600 / 500)
Hanken Grotesk       — cuerpo, subtítulos            (400 / 500)
JetBrains Mono       — etiquetas, datos, timecodes   (400 / 500)

MOVIMIENTO
Curva Æther: cubic-bezier(0.25, 0.1, 0, 1)
Entradas 0.60–0.65s · salidas 0.40s · micro 0.25s
```

---

## 01 · La tesis y la regla de tres

**Qué es Æther.** El equipo técnico que un negocio no tiene que contratar. Construimos *y operamos* la tecnología de la que depende una empresa: automatización, IA, software a la medida, integraciones, seguridad y presencia digital. No es un proyecto que se entrega y se acaba: es una función completa que sale de la cabeza del dueño.

**Qué no es:**
- No es un "estudio de automatización". Esa etiqueta reduce la marca a una herramienta.
- No es una agencia de marketing ni una consultora corporativa.
- No es una startup de IA. La IA es una de las cosas que hacemos, no la identidad.
- No es un freelance. La promesa es continuidad, no un encargo suelto.

**La regla de tres.** Todo lo que se produce pasa por estas tres preguntas. Si alguna falla, no se publica.

1. **¿Se entiende sin sonido?** El 80% ve sin audio. Si el video necesita voz para entenderse, no está terminado.
2. **¿Muestra un resultado, no una herramienta?** El protagonista es lo que el cliente recupera: horas, dinero, tranquilidad. Nunca el software con el que lo hicimos.
3. **¿Está tranquilo?** Æther es selectiva, no ruidosa. Corte acelerado, tres textos a la vez, música que empuja — no es Æther.

> Æther no vende automatizaciones. Vende las horas que el dueño recupera.

---

## 02 · Sistema de color

Paleta cerrada. Son los mismos valores que corren en el sitio (`src/index.css`), no una versión aparte para video.

| Color | Hex | RGB | Uso |
|---|---|---|---|
| Vacío | `#09090C` | 9, 9, 12 | Fondo oscuro por defecto. Base de casi todo. |
| Carbón | `#101014` | 16, 16, 20 | Tarjetas y planos elevados. Profundidad sin sombra. |
| Hueso | `#FAFAF9` | 250, 250, 249 | Fondo claro. Reemplaza al blanco puro, siempre. |
| Tinta | `#13131B` | 19, 19, 27 | Texto sobre claro. Reemplaza al negro absoluto. |
| Bruma | `#E3E1DE` | 227, 225, 222 | Texto sobre oscuro. Blanco roto, ligeramente cálido. |
| Peri claro | `#A5A5CF` | 165, 165, 207 | Acento sobre oscuro: subrayados, cifras, líneas. |
| Peri profundo | `#4949A2` | 73, 73, 162 | Acento sobre claro. Botones y énfasis en hueso. |
| Peri logo | `#C2C2FF` | 194, 194, 255 | Exclusivo del símbolo sobre oscuro. No en texto. |
| Gris frío | `#838391` | 131, 131, 145 | Texto secundario, captions, créditos, timecodes. |
| Línea | `#1E1E25` | 30, 30, 37 | Bordes 1px sobre oscuro. Sobre hueso: `#DDDDE3`. |

**Semántico** (solo dentro de interfaces y gráficos de estado, nunca decoración):
`#337152` verde resuelto (dark `#4E9C74`) · `#E29612` ámbar pendiente · `#CA2B2B` rojo error.

**Proporción.** En cualquier cuadro: **75% base (vacío u hueso), 20% secundario, 5% peri.** El peri es acento, no fondo.

**Sí:** vacío como fondo por defecto · hueso en lugar de blanco puro · peri solo en cifras, líneas y detalles · un solo fondo por pieza · bruma para texto sobre oscuro.

**No:** blanco puro `#FFFFFF` · negro absoluto `#000000` · degradados de peri detrás de texto · glow, neón o bloom sobre el acento · cualquier color fuera de la paleta (incluido el azul de las apps que grabamos).

---

## 03 · Sistema tipográfico

| Familia | Trabajo | Pesos |
|---|---|---|
| Bricolage Grotesque | Titulares, cifras grandes, wordmark | SemiBold 600 · Medium 500 |
| Hanken Grotesk | Cuerpo, subtítulos, descripciones | Regular 400 · Medium 500 |
| JetBrains Mono | Etiquetas, datos, nombres de cliente, timecodes | Regular 400 · Medium 500 |

**Jerarquía en vertical 1080 × 1920** (tracking en unidades AE/Premiere, 1/1000 em):

| Elemento | Familia | Tamaño | Tracking | Interlínea |
|---|---|---|---|---|
| Titular de gancho | Bricolage SemiBold | 96–120 px | −45 | 1.05 |
| Cifra protagonista | Bricolage SemiBold | 200–280 px | −60 | 0.95 |
| Subtítulo de apoyo | Hanken Regular | 52–62 px | 0 | 1.4 |
| Etiqueta / eyebrow | JetBrains Mono Medium | 28–34 px | +220 | 1.3 |
| Nombre de cliente | JetBrains Mono Medium | 32–38 px | +160 | 1.3 |
| Subtítulo hablado | Hanken Medium | 58–66 px | 0 | 1.25 |
| Nota al pie / fuente | JetBrains Mono Regular | 24–28 px | +80 | 1.4 |

**Cifras.** Son el argumento de la marca, así que se tratan como titular: Bricolage SemiBold, tracking negativo, y la unidad siempre más pequeña que el número (30 grande, "+ h/semana" al ~55%). Nunca conteo animado de más de 0.8 s ni contador que rebota.

**Sí:** máximo dos familias por cuadro · líneas de 6 palabras o menos en titulares · tracking amplio solo en mayúsculas mono · alineado a la izquierda en piezas de datos · centrado solo en frase de marca y cierre.

**No:** fuentes de plantilla (Montserrat, Poppins, Bebas, Anton) · cursivas, contornos, sombras o relieve · mayúsculas en frases de más de 4 palabras · texto sobre imagen sin plano de contraste · estirar o condensar tipografía a mano.

---

## 04 · Logo y símbolo

El símbolo es una espiral que converge hacia un centro: muchos procesos sueltos entrando en orden. Archivo: `public/logo.svg`, relleno `#C2C2FF`.

**Wordmark.** Se escribe **Æther** — Æ ligada, mayúscula inicial, resto en minúsculas. Bricolage Grotesque SemiBold, tracking −0.03 em. En mayúsculas completas (ÆTHER) solo en el cierre de marca y el avatar.
- Nunca "AETHER" con A y E separadas en piezas de identidad.
- "Aether" sin ligadura solo en URLs, handles y sistemas que no soporten la Æ.
- Nunca "Æther Studio", "Æther AI" ni descriptor pegado.

| Uso | Tamaño | Color |
|---|---|---|
| Cierre de video 9:16 | 180–220 px de alto | `#C2C2FF` sobre vacío |
| Marca de agua en esquina | 64–80 px de alto | `#C2C2FF` al 45% |
| Avatar de perfil | 1080 × 1080, símbolo al 45% del lienzo | `#C2C2FF` sobre `#09090C` |
| Mínimo absoluto | 32 px de alto | — |

**Espacio de respeto:** al menos la mitad del alto del símbolo, libre por los cuatro lados. Nunca pegado a un borde.

**Sí:** una sola aparición por pieza · posición fija durante todo el video · aparece con fundido · sobre fondo plano de la paleta.
**No:** rotar, deformar, recortar o rellenar la espiral · animarlo trazándose línea por línea · marca de agua encima de una grabación de pantalla · wordmark pegado al lado en video.

---

## 05 · Voz y tono

**Habla como:** un ingeniero que explica sin condescender · alguien que enseña el recibo, no la promesa · un socio selectivo, no un proveedor disponible.

**No habla como:** gurú de productividad de LinkedIn · vendedor de infoproductos ("sin esto estás perdiendo dinero") · startup de IA hypeada · consultora corporativa con jerga.

**Redacción en pantalla:**
- Máximo 12 palabras por frase.
- Punto final, no signos de exclamación.
- Números en dígitos: "178 planes", no "ciento setenta y ocho planes".
- Se habla de tú, en español. Nunca "usted" ni spanglish forzado.
- Ritmo: frase corta. Frase corta. Una que respira un poco más. Cierre corto.

**Palabras prohibidas** (ni en pantalla, ni en locución, ni en caption): revolucionario · disruptivo · mágico · game changer · hack · 10x · solución integral · sinergia · potenciado por IA · estudio de automatización · nombres de herramientas como protagonista (n8n, Make, Zapier, GPT).

**Firma de Æther:** cuadrado / conciliado · nada se escapa · corriendo / en marcha · sin tocar nada a mano · el recibo · auditoría.

**Banco de frases canónicas** (se repiten con disciplina; la marca se construye por repetición):
- Tú llevas el negocio. Nosotros, lo demás.
- Enfócate en tu negocio. Nosotros nos encargamos.
- Funciona mientras duermes.
- Nada se escapa.
- Tu equipo técnico interno.
- Tomamos 3 clientes nuevos al mes.
- Auditoría gratis de 20 minutos.

**CTA único:** "Quiero mi auditoría gratis". En video se dice completo al menos una vez y se escribe en el cierre. Nunca "link en bio" solo, nunca "escríbeme YA".

---

## 06 · Las cuatro categorías de video

Toda pieza cae en una de estas cuatro. Si no cae, no se produce. No hay quinta categoría.

**A · El recibo** — 15–25 s · 35% del feed
Un cliente, un número, una frase. Nombre del negocio en mono, cifra enorme en Bricolage, significado en Hanken. Sin locución obligatoria. *Función:* prueba. Es el formato que más convierte y el que sostiene la credibilidad de todo lo demás.

**B · Antes / Después** — 20–35 s · 25%
El mismo proceso, dos veces: a mano y con Æther. Split vertical o corte directo con la misma composición. El contraste se lleva todo el peso; el texto solo etiqueta. *Función:* mostrar el cambio, no explicarlo.

**C · La demostración** — 30–60 s · 25%
Grabación de pantalla de un flujo corriendo de verdad: entra un pago, se cuadra solo, aparece en el sistema. Se muestra el resultado, no la configuración. *Función:* demostrar que existe y funciona.

**D · A cámara** — 30–60 s · 15%
Luis explicando una idea concreta: un cuello de botella común, una decisión, un error caro. Encuadre fijo, fondo de la paleta, sin cortes rítmicos. *Función:* ponerle cara al estudio.

> Mejor tres piezas excelentes por semana que siete mediocres. Publicar a diario obliga a producir relleno, y el relleno destruye la percepción de un estudio selectivo.

---

## 07 · Especificaciones técnicas

| Formato | Resolución | Destino |
|---|---|---|
| Vertical 9:16 | 1080 × 1920 | Reels, TikTok, Shorts — formato principal |
| Feed 4:5 | 1080 × 1350 | Post de video en el feed de Instagram |
| Horizontal 16:9 | 1920 × 1080 | YouTube, LinkedIn, casos de estudio |
| Loop de sitio | 1920 × 1080 | Fondos y demos dentro de aetherml.com |

| Atributo | Valor |
|---|---|
| Frame rate | 30 fps en línea de tiempo y entrega |
| Captura de pantalla | 60 fps, se conforma a 30 en edición |
| Espacio de color | Rec.709 · sRGB |
| Máster de archivo | ProRes 422 HQ |
| Entrega social | H.264 MP4, perfil High, 2 pases |
| Bitrate vertical | 10–14 Mbps |
| Bitrate horizontal | 16–20 Mbps |
| Audio | AAC 320 kbps, 48 kHz, estéreo |
| Loudness | −14 LUFS integrado · true peak −1 dBTP |
| Loop de sitio | MP4 + WebM, sin audio, menos de 3 MB |
| Peso máximo social | 100 MB |

**Los loops del sitio son otra cosa.** Se reproducen en silencio, en bucle y sin controles. Tienen que abrir y cerrar en el mismo cuadro, pesar menos de 3 MB y entregarse en MP4 y WebM. Un loop con corte visible hace que el sitio se vea roto.

---

## 08 · Lienzo y zonas seguras

**Zonas del lienzo vertical (1080 × 1920):**

| Zona | Rango | Qué vive aquí |
|---|---|---|
| Superior | 0 – 250 px | Nada. La interfaz de la app cubre esta franja. |
| Titular | 250 – 700 px | Gancho y etiqueta de categoría. |
| Central | 700 – 1400 px | Contenido principal: cifra, pantalla, rostro. |
| Subtítulos | 1400 – 1500 px | Banda fija de subtítulo hablado. |
| Inferior | 1500 – 1920 px | Nada. Caption, CTA y perfil de la plataforma. |

**Márgenes:** laterales mínimo 90 px, ideal 120 px. Ningún texto rebasa 840 px de ancho en vertical. La marca de agua va a 120 px del borde superior derecho.

**Espacio negativo:** mínimo **45% del cuadro vacío** en piezas A y B. Si miras un cuadro y el vacío no domina, está saturado. El aire no es relleno: es lo que hace que la marca se lea como cara.

---

## 09 · Anatomía de un video

Estructura fija en cuatro tiempos. El orden no cambia entre categorías; cambia qué llena cada tiempo.

| Tiempo | Duración | Trabajo |
|---|---|---|
| 1 · Gancho | 0.0 – 2.0 s | El resultado o el dolor, en pantalla, sin sonido. Una sola idea. |
| 2 · Contexto | 2.0 – 6.0 s | De quién es y por qué importa. Nombre del negocio y giro. |
| 3 · Prueba | 6.0 s – final − 3 s | El cuerpo: la cifra, el antes/después o el flujo corriendo. |
| 4 · Cierre | últimos 3.0 s | Símbolo, wordmark, CTA. Idéntico en toda pieza. |

**Los primeros dos segundos.** El gancho no es una frase ingeniosa: es el dato más fuerte que tengas, en pantalla antes de que el pulgar decida. En el segundo 0 ya hay algo legible. Sin logo de apertura, sin cortinilla, sin "hola, ¿qué tal?".
- Funcionan: "178 planes prepagados corriendo en un gimnasio." · "Ventas, cobros y banco en una pantalla."
- No funcionan: "Te voy a mostrar una automatización increíble." · "¿Sabías que…?"

**Cifras autorizadas** (solo capacidad y escala; cualquier cifra nueva la aprueba Luis antes de entrar a un corte):
- Tavros — 178 planes prepagados activos.
- Æther — 6 negocios en producción.

---

## 10 · Tipografía en movimiento

El texto entra y sale, no actúa. Ninguna animación tipográfica debe llamar la atención sobre sí misma.

| Animación | Parámetros | Duración |
|---|---|---|
| Fundido + subida | Opacidad 0→100, Y +40 px → 0 | 18 fotogramas (0.6 s) |
| Fundido simple | Opacidad 0→100 | 18 fotogramas (0.6 s) |
| Entrada lateral | Opacidad 0→100, X ±50 px → 0 | 20 fotogramas (0.65 s) |
| Salida | Opacidad 100→0, sin desplazamiento | 12 fotogramas (0.4 s) |
| Máscara de barrido | Solo en subrayados peri, izquierda a derecha | 14 fotogramas (0.45 s) |

**Reglas:**
- Un solo bloque de texto en pantalla a la vez. Si entra uno nuevo, el anterior sale primero.
- Escalonado entre líneas: 4 fotogramas. Nunca letra por letra, salvo el efecto de máquina de escribir del sitio, reservado para el gancho de piezas tipo C.
- Todo texto permanece legible al menos 1.5 s antes de salir. 2 palabras por segundo de lectura.
- El texto no se mueve mientras está en pantalla. Entra, se queda quieto, sale.

**Prohibido:** rebote, elástico, overshoot · rotación 3D o perspectiva · texto que escala desde 0 · kinetic typography sobre el beat · glitch, RGB split, distorsión · presets de Envato o MotionArray.

**Permitido:** fundidos · desplazamiento corto en un solo eje · máscaras rectas · contadores numéricos de máximo 0.8 s · líneas peri que se trazan de un punto a otro.

---

## 11 · Movimiento y ritmo

**La curva Æther:** `cubic-bezier(0.25, 0.1, 0, 1)` — arranca con decisión y aterriza suave, sin pasarse de largo. Es la misma que corre en el sitio (`src/lib/motion.ts`), y es lo que hace que video y web se sientan del mismo lugar.

- **After Effects:** Easy Ease en ambos keyframes, luego en el editor de gráficos: influencia de salida 25%, influencia de entrada 90%, velocidad final 0.
- **Premiere:** Ease In / Ease Out y el controlador bezier arrastrado a la derecha, no en curva simétrica.
- **DaVinci:** interpolación Ease In+Out, aceleración 25 / desaceleración 90.

**Duraciones estándar a 30 fps:**

| Gesto | Fotogramas | Segundos |
|---|---|---|
| Entrada de elemento | 18–20 | 0.60–0.65 |
| Salida de elemento | 12 | 0.40 |
| Micro-interacción (check, tag) | 7 | 0.25 |
| Transición entre escenas | 0 (corte) | — |
| Cross-dissolve entre B-roll | 6–10 | 0.20–0.33 |
| Fundido a vacío al cierre | 15 | 0.50 |

**Ritmo de corte:** entre **2 y 4 segundos por plano**. Nada más corto que 1.2 s. Æther no corta al ritmo de la música: la calma es parte del argumento. Si el video necesita cortes rápidos para sostenerse, el contenido no es suficientemente bueno.

**Transiciones prohibidas:** whip pan, zoom punch, spin · glitch, VHS, light leaks · barridos, cortinillas, page curl · cualquiera con sonido de "swoosh".

**Transiciones permitidas:** corte directo (por defecto, el 90% de los casos) · cross-dissolve corto entre B-roll · fundido a vacío `#09090C` · máscara recta que revela el siguiente plano.

---

## 12 · Grabaciones de pantalla

Es el material más importante y el más fácil de arruinar. Una demo mal grabada hace que el trabajo parezca amateur aunque el sistema sea impecable.

**Antes de grabar:**
- Pantalla limpia: sin pestañas de más, sin notificaciones, sin barra de marcadores, sin hora del sistema si delata la fecha.
- Un solo tema en toda la pieza. Por defecto, modo oscuro (`#09090C`) — es donde la marca vive.
- Datos de cliente: nombres reales solo si están en la lista autorizada. Lo demás se reemplaza por datos ficticios plausibles, nunca por "Lorem" ni "Test 123".
- Cursor visible, tamaño por defecto, sin resaltador amarillo ni efecto de clic.
- Grabar a 60 fps y a resolución retina (2×) para poder acercar sin perder nitidez.

**Al editar:**
- Zoom máximo 140% sobre una grabación 2×. Más allá se ve blando.
- Zoom y paneo usan la curva Æther y duran 0.6 s. Nunca zoom continuo tipo "Ken Burns" sobre una interfaz.
- Tiempos muertos acelerados 2×–4×, marcados con etiqueta mono discreta (`×4`) en la esquina inferior derecha.
- Nunca se acelera el momento del resultado. Ese se ve a velocidad real.
- Si la pantalla tiene colores fuera de paleta (el azul de una app, el verde de un banco), se deja tal cual — no se recolorea la realidad. Lo que se cuida es que el marco alrededor sí sea de la paleta.

**Encuadre en vertical.** Una interfaz horizontal no se estira ni se recorta a la mitad. Se coloca en la zona central (700–1400 px) sobre fondo vacío, con esquinas redondeadas de 24 px y borde de 1 px en `#1E1E25`. Alrededor queda aire. Mismo tratamiento que las tarjetas del sitio.

---

## 13 · Imagen: encuadre, color y B-roll

La imagen de Æther es sobria y ligeramente fría. Nada de calidez publicitaria ni de look teal-and-orange.

**A cámara:**
- Plano medio corto, cámara a la altura de los ojos, mirada a lente.
- Fondo: pared lisa, oscura y desenfocada. Sin estanterías decoradas, sin LEDs de colores, sin plantas de atrezzo.
- Luz principal suave a 45°, una sola fuente dominante. Contraluz sutil opcional, nunca de color.
- Encuadre fijo. Trípode. Sin cámara en mano, sin gimbal orbitando.

**Color:**

| Parámetro | Objetivo |
|---|---|
| Temperatura | Neutra a ligeramente fría (−100 a −300 K del balance) |
| Saturación | 85–95% de la nativa. Bajada, nunca subida. |
| Negros | Levantados apenas, a 3–5 IRE. Nunca aplastados a 0. |
| Altas luces | Sin recorte. Techo a 95 IRE. |
| Piel | Natural. No se empuja al naranja. |
| Grano / textura | Ninguno. Nada de film emulation. |

**B-roll.** Trabajo real: manos en un teclado, una terminal de pago, un mostrador de gimnasio, una obra, una pantalla reflejada. Se graba en los negocios de los clientes o en el estudio.
- Prohibido el stock genérico de "oficina moderna", "equipo chocando las manos" o "ciudad con timelapse".
- Prohibida cualquier imagen generada por IA que pretenda pasar por real.
- Prohibidos los renders de robots, cerebros, redes neuronales y nodos flotantes.
- Si no hay B-roll bueno, se usa fondo vacío con tipografía. El vacío es preferible al relleno.

---

## 14 · Audio y música

La marca suena a poco. La música acompaña; nunca conduce.

**Música:**
- Ambient, minimal, electrónica de textura. Sin percusión marcada, sin drop, sin build-up.
- Nivel bajo voz: −22 a −18 LUFS. Sin voz: −16 LUFS.
- Entra con fundido de 1 s, sale con fundido de 1.5 s. Nunca corta en seco.
- Una sola pista por pieza. No se encadenan dos canciones en 30 segundos.
- Licencia siempre verificada y guardada en la carpeta del proyecto.

**Voz:**
- Micrófono de solapa o de cañón. Nunca el de la cámara ni el del teléfono.
- Sin reverb añadido, sin efectos de radio, sin autotune.
- Se limpian respiraciones largas y silencios muertos, pero se deja el ritmo natural. No se comprime hasta sonar a locutor.

**Diseño sonoro.** Solo dos efectos autorizados, ambos a −24 dB o menos:
- Un clic corto y seco cuando aparece una tarea resuelta o un check.
- Un tono suave y bajo cuando aparece la cifra protagonista.

Todo lo demás — swooshes, risers, impactos, glitches, notificaciones de app — está prohibido.

---

## 15 · Subtítulos

Todo video con voz lleva subtítulos quemados. Sin excepción.

| Atributo | Valor |
|---|---|
| Familia | Hanken Grotesk Medium 500 |
| Tamaño | 58–66 px en 1080 × 1920 |
| Color | `#E3E1DE` sobre oscuro · `#13131B` sobre claro |
| Fondo | Ninguno. Si no contrasta, se oscurece el plano detrás. |
| Posición | Fija, base a 1500 px del borde superior |
| Líneas | Máximo 2, máximo 42 caracteres por línea |
| Cambio | Por frase completa, con corte seco. Sin fundido. |
| Énfasis | Solo cifras y nombres de cliente, en `#A5A5CF` |

**Prohibido:** subtítulos palabra por palabra que saltan · karaoke con resaltado que avanza · emojis dentro del subtítulo · contorno grueso o sombra dura · mayúsculas completas · estilos automáticos de CapCut o Submagic.

**Además:** se revisa la transcripción a mano (acentos, ñ, nombres propios) · "Æther" siempre con la ligadura · se entrega también un `.srt` junto al MP4 · versión en inglés cuando la pieza sea para LinkedIn.

---

## 16 · Cierre de marca

Los últimos 3 segundos son idénticos en toda pieza. Es lo que convierte publicaciones sueltas en una marca reconocible.

- Fondo vacío `#09090C`, plano y sin textura.
- Símbolo en `#C2C2FF`, 200 px de alto, centrado.
- Wordmark ÆTHER en Bricolage SemiBold, 72 px, `#FFFFFF`, tracking −30.
- Dominio en JetBrains Mono Medium, 28 px, `#A5A5CF`, tracking +200.
- Entrada: fundido de 15 fotogramas, todo junto. Sin escalonar, sin animar el símbolo.
- Permanece 2.5 s y el video termina en corte, no en fundido a negro.

El CTA hablado —"Quiero mi auditoría gratis"— va en el tiempo 3, antes del cierre. La tarjeta de cierre no lleva CTA escrito: solo símbolo, nombre y dominio.

---

## 17 · Errores típicos a evitar

- **El gancho tarda.** Un segundo de logo o de "hola" y el video ya perdió. En el cuadro 1 hay contenido.
- **La herramienta como protagonista.** "Así lo hicimos con n8n" vende la herramienta, no a Æther.
- **Dos textos a la vez.** Titular arriba y subtítulo abajo compitiendo. Uno sale antes de que entre el otro.
- **Cortes al ritmo de la música.** Sube la energía y baja la credibilidad.
- **Look de plantilla.** Presets de transición, subtítulos automáticos de colores, tipografía de plantilla. Se detecta en dos segundos.
- **Fondos mezclados.** Una pieza que empieza en oscuro y termina en claro se lee como dos videos pegados.
- **Cifras sin dueño.** Un número grande sin el negocio al que pertenece no es prueba, es publicidad.
- **Espacio saturado.** Si el cuadro está lleno, la marca deja de parecer selectiva.
- **Datos reales visibles.** Un nombre, correo o monto de un cliente que no autorizó. Único error que además es un problema legal.
- **Exportar sin revisar en el teléfono.** Todo se ve bien en un monitor de 27". La pieza vive en una pantalla de 6.

---

## 18 · Entrega: nombres, presets y carpetas

**Nombre de archivo:** `AET_[categoría]_[tema]_[formato]_v[NN].mp4`

```
AET_A-recibo_tavros_9x16_v02.mp4
AET_C-demo_conciliacion-tavros_9x16_v01.mp4
AET_D-camara_cuellos-de-botella_16x9_v03.mp4
```

Todo en minúsculas, sin acentos, sin espacios, sin ñ. La versión sube de uno en uno; nunca "final", "final2" ni "final-bueno".

**Estructura de carpeta por proyecto:**

| Carpeta | Contenido |
|---|---|
| `01_bruto` | Cámara, pantalla, audio original. No se toca. |
| `02_audio` | Música con su licencia, efectos, voz limpia. |
| `03_graficos` | Logos, plantillas, exportes de After Effects. |
| `04_proyecto` | Archivo de edición y autoguardados. |
| `05_entrega` | MP4 finales, `.srt`, y máster ProRes. |

**Qué se entrega por pieza:**
- MP4 vertical 1080 × 1920 con subtítulos quemados.
- Archivo `.srt` correspondiente.
- Cuadro de portada en JPG 1080 × 1350 (el fotograma más legible, nunca uno con la boca abierta).
- Máster ProRes si la pieza va a reutilizarse en el sitio.
- Recorte 16:9 solo si se pidió explícitamente.

---

## 19 · Checklist de aprobación

- [ ] Se entiende con el sonido apagado.
- [ ] El protagonista es un resultado, no una herramienta.
- [ ] Hay algo legible en el primer cuadro.
- [ ] Un solo bloque de texto en pantalla a la vez.
- [ ] Todos los colores salen de la paleta; ningún blanco puro ni negro absoluto.
- [ ] Solo Bricolage, Hanken y JetBrains Mono.
- [ ] Ninguna palabra de la lista de prohibidas, en pantalla ni en voz.
- [ ] Las cifras están en la lista autorizada y tienen dueño.
- [ ] Ningún dato real de cliente visible sin permiso.
- [ ] Subtítulos revisados a mano, con acentos y con Æ.
- [ ] El texto respeta las zonas seguras: nada arriba de 250 px ni abajo de 1500 px.
- [ ] Ninguna transición fuera de las permitidas.
- [ ] Cierre de marca idéntico al de la sección 16.
- [ ] Audio a −14 LUFS, pico real bajo −1 dBTP.
- [ ] Revisado en un teléfono, no solo en el monitor.
- [ ] Archivo nombrado según la sección 18.

---

> **Regla final.** Si dudas entre poner algo más o quitar algo, quita.
