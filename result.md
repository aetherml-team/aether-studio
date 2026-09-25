# Æther — Grand Slam Offer & Landing Spec

Built from the 2026-09-15 gap analysis (landing vs. nexus/volt/playbook) and Alex Hormozi's *$100M Offers*. Three iterations; v3 is the one to build. Everything marked **[DECIDE]** needs Luis's sign-off. Everything marked **[PROOF RULE]** is bound by the playbook: no savings / ROI / time-recovered claims without a documented measurement.

---

## 0. Hormozi's frame, applied

**Value equation** — Value = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice).

| Lever | Current landing | What we actually have |
|---|---|---|
| Dream outcome | vague ("hours back", "busywork gone") | owner sees the whole business from one screen, without asking anyone; money reconciles itself |
| Perceived likelihood | fake numbers, Kraken (not a client), synthetic mockups | 6 live systems, real screens, real domains, a written guarantee |
| Time delay | "1–2 months" | accounting live in ~6 weeks (quoted to Sismo), first Mapa de Fugas in days |
| Effort & sacrifice | unstated | team keeps WhatsApp/Excel intake; we migrate, train per role, run continuity |

Hormozi's order of operations: pick a **starving crowd** → niche until you can charge premium → list every problem → solve every problem → keep only high-value/low-cost delivery vehicles → stack → add scarcity, urgency, bonuses, guarantee → name it (M-A-G-I-C).

---

## 1. Market: the starving crowd

Hormozi's four tests: massive pain, purchasing power, easy to target, growing.

**Avatar (v3):** owner-operator of an established Mexican service or retail business (gym, studio, café/roaster, atelier, agency) with **recurring customers and recurring money** — memberships, projects, wholesale reorders — whose operation runs on Excel + WhatsApp + memory and who has already outgrown it. 5–40 staff, 3+ years old, GDL/Zapopan first. Buyer = the owner, who is also the one living the pain.

| Test | Verdict | Evidence |
|---|---|---|
| Pain | high | "no ha habido una semana que cuadre", "pierdo hora y media diaria escarbando Excel", "se vende pero no hay dinero" (Sismo owner, pre-sale) |
| Purchasing power | medium-high | established businesses, $80k–$230k MXN proposals accepted; they already pay for POS, Shopify, Zoho |
| Easy to target | high | local, referral-driven, WhatsApp-native, owner is reachable |
| Growing | yes | "el negocio creció, pero el control no creció con él" is the trigger |

**Niche decision [DECIDE]:** Hormozi says niche down to raise price. Two options:

- **A. Horizontal owner-operator (recommended for the main landing).** One avatar, five proof verticals. Matches the playbook ("negocios mexicanos") and all six tenants. Risk: slightly diluted headline.
- **B. Vertical landings later.** `/gimnasios` first (Tavros live + Kraken build = proven reusable, 178 plans running), then `/estudios`, `/cafes`. Same offer, avatar-specific copy and screenshot. Do this after the main page converts.

---

## 2. Dream outcome, in the buyer's words

Not "automation". Not "software". The playbook's category: **control operativo**.

> Saber, sin preguntarle a nadie, qué se vendió, qué se cobró, quién debe, qué está atrasado y cuánto queda — desde tu celular, con tu marca, y que el dinero se cuadre solo.

Secondary outcomes: the process no longer lives in one person's head; the team stops capturing twice; the owner goes back to selling.

---

## 3. Problems → Solutions → Delivery vehicles

Hormozi: list every obstacle before, during, after; turn each into a solution; then choose the delivery vehicle that is highest perceived value at lowest cost to us. Everything below exists in nexus/volt today.

| # | Problem (owner's obstacle) | Solution (what we do) | Delivery vehicle (already built) |
|---|---|---|---|
| 1 | "No sé dónde se me va el tiempo ni el dinero" | measure before building | **Mapa de Fugas Operativas** — diagnostic + baseline, done in days |
| 2 | "El software a la medida nunca termina" | freeze scope, dependencies, definition of done | **Blueprint Nexus** — acceptance criteria signed before build |
| 3 | "Tengo cinco pantallas y ninguna es mía" | one branded app, own domain, installable on the phone | **Cabina de Control con tu marca** — PWA per tenant, own DB |
| 4 | "Mis datos están en Excel, POS, Shopify, el banco…" | migrate + connect what you already use | **Migración segura y conexiones** — Zoho Books/CRM/Projects/Inventory, Mercado Pago, SPEI, Poster POS, Shopify, WhatsApp |
| 5 | "Cuadrar el banco me toma el domingo" | deposits match invoices automatically; leaks priced in pesos | **Automatizaciones de alto impacto** — SPEI auto-match, package renewals, leak detection, lead dedup |
| 6 | "Tengo que preguntar para saber qué pasa" | a Monday screen that answers "what needs me today" | **Tablero de Resultado** — who owes, overdue, cash-flow projection (arithmetically verified), collections vs billed |
| 7 | "Me entero de un lead cuando ya se enfrió" | new lead pings your phone, app closed | Web Push lead alerts + WhatsApp reminders |
| 8 | "Mis notas de llamadas de venta se pierden" | AI extracts contacts, quotes, next steps from call recordings, with citations, you approve | **Transcripts → CRM** (Fathom live, OpenAI structured extraction, human approval) |
| 9 | "Mi equipo no va a usarlo" | design with real users, train per role, measure adoption | **Lanzamiento acompañado** + Manual de Operación por Rol |
| 10 | "¿Y cuando algo falle?" | monitoring, backups, support, improvements | **Continuidad Operativa** — nightly backups, sync-health alerts, 08:00 monitors |
| 11 | "¿Y si me quiero ir?" | your Zoho org stays the system of record; your data in your own DB | **Plan de Datos Cero Sorpresas** |
| 12 | "¿Cómo sé que va a funcionar?" | guarantee what is under our control | **Garantía de Alcance y Lanzamiento** (see §6) |

**Trim (Hormozi: cut low-value/high-cost, keep high-value/low-cost):**
- Cut from the landing: security audits, team training as a standalone service, "presence that wins clients" as a generic web-design line, process consulting. They are either not the product or they are inside components 9/11.
- Keep Volt-style storefronts as a **proof card** (Eloisa Montero), not as a menu item. It is the commerce front of the same platform.
- Keep AI as **one honest component** (#8) plus the "smart" rules in #5. No chatbot, no agent claims.

---

## 4. Iterations

### v1 — direct translation of the playbook
"Nexus Control Operativo: implementación + continuidad." Eight components listed, three packages, MXN + IVA.
**Critique against the value equation:** outcome is abstract ("control"), likelihood carried only by words, no anchor for time or effort, no bonuses, guarantee buried. Reads like a proposal, not an offer.

### v2 — outcome-led, stacked, guaranteed
Lead with the Monday screen. Stack the 8 components with value anchors. Add the 4 bonuses, "3 clientes al mes", guarantee above the fold.
**Critique:** value anchors risked inventing ROI numbers [PROOF RULE]; "3 clientes al mes" scarcity is canonical but must be true; no price anchor at all still leaves the buyer guessing; the AI story was a bullet instead of a differentiator.

### v3 — the Grand Slam (build this)
Fixes v2: anchors are **cost comparisons and capacity facts**, never results; scarcity kept only if real; publish the **price structure and a floor**; AI gets its own section with the honesty principle as the hook.

---

## 5. The v3 offer

### Name (M-A-G-I-C: Magnet · Avatar · Goal · Interval · Container)

**Nexus Control Operativo — tu negocio en una sola pantalla en 6 semanas, para dueños que ya no caben en Excel.**

- Magnet: "en una sola pantalla"
- Avatar: dueños que ya no caben en Excel
- Goal: control operativo
- Interval: 6 semanas (Fase 1 only; longer phases get their own validated interval, per playbook)
- Container: Nexus

Per-vertical variants keep the playbook template: *Nexus Control de Membresías en 8 Semanas para Academias*.

### Core stack (what the buyer gets, in order shown on the page)

1. **Mapa de Fugas Operativas** — where time, money and control leak, measured, in days. *You keep it whether you hire us or not.*
2. **Blueprint Nexus** — scope, dependencies, owners, definition of done. Signed before build.
3. **Cabina de Control con tu marca** — your app, your domain, installable, one database that is only yours.
4. **Migración segura y conexiones** — Zoho Books/CRM/Projects/Inventory, Mercado Pago, SPEI, POS, Shopify, WhatsApp, calendar.
5. **Automatizaciones de alto impacto** — bank deposits matched to invoices, renewals detected, leaks priced, duplicate leads merged.
6. **Tablero de Resultado** — Monday summary: sold, collected, receivable, reconciled, decisions for today.
7. **Lanzamiento acompañado** — per-role training, real cases, adoption measured.
8. **Continuidad Operativa** — nightly backups, monitors at 08:00, support, improvements. Monthly, cancel per terms.

### Bonuses (Hormozi: name them, price them, make each solve the next objection)

| Bonus | Solves | Anchor (cost comparison, not result) |
|---|---|---|
| Clínica de Adopción (30 días post-lanzamiento) | "el equipo no lo va a usar" | 30 days of an implementation lead on call |
| Manual de Operación por Rol | "sólo una persona sabe cómo funciona" | the process leaves one head and lands on paper |
| Revisión Ejecutiva de 60 Días | "¿y después qué?" | a second Mapa de Fugas, against baseline |
| Plan de Datos Cero Sorpresas | "¿y si me quiero ir?" | your Zoho org + your DB stay yours; documented exit |

### Scarcity & urgency

- **Scarcity [DECIDE]:** "Tomamos 3 clientes nuevos al mes" is canonical brand copy. Keep only if it is operationally true this month. Fleet reality (6 tenants, one droplet each, ~4 releases/month) supports a small number; say the real one.
- **Urgency:** proposal validity date on every offer (playbook §8). On the landing: "Mapa de Fugas agendable esta semana" tied to real Calendly availability, no fake countdowns.

### Guarantee (verbatim from playbook, Hormozi "conditional + service guarantee")

> **Garantía de Alcance y Lanzamiento:** si Aether no cumple un criterio de aceptación bajo su control en la fecha acordada, continúa trabajando sobre ese criterio sin honorarios adicionales de implementación hasta cumplirlo. No cubre cambios de alcance, datos o aprobaciones tardías del cliente, indisponibilidad de terceros ni supuestos expresamente pendientes.

Optional stack from the Sismo deck [DECIDE]: "opera en la fecha prometida o es gratis"; "si en 90 días no cuadra, no se cobra continuidad". Stronger, Hormozi-approved, but only publish what you will honour for every client.

For uncertain integrations: sell a **Fase de Factibilidad** first, binary outcome (playbook). Say so on the page; it raises perceived likelihood.

### Pricing (Hormozi: premium, value-driven, never the cheapest; but give an anchor)

Structure to publish:

```
Fase 1 — Cuello de botella        Implementación desde $__ MXN + IVA   ·  Continuidad $__ MXN/mes + IVA
Recomendado — Control operativo   Implementación $__ MXN + IVA          ·  Continuidad $__ MXN/mes + IVA
Transformación — Multiárea        Cotización tras Blueprint             ·  Continuidad por módulo
```

- **[DECIDE] floors.** Only datapoint: Sismo full system $230,000 MXN; founder entry $80,000 MXN financed; continuity $12,000 MXN/month per module. Playbook says do not generalise. Recommendation: publish Fase 1 "desde" at a number you would happily deliver a one-flow system for (the gap analysis showed the missing anchor is costing more than the anchor would), and publish continuity per module. Leave Transformación quoted.
- Always: MXN, +IVA stated, CFDI, SPEI standard, MSI only if real. Payment terms on the proposal, not on the page.
- Anti-price-shopper line (Hormozi "price signals value"): "Si buscas la cotización más barata, no somos. Si buscas dejar de preguntar, sí."

---

## 6. Proof that survives a skeptical question [PROOF RULE]

Use only these. Every one is verifiable in a repo or a live URL.

- **6 sistemas en producción sobre una sola plataforma** (Tavros, Eternus, The Wedding Method, Sismo Café, Eloisa Montero, Æther).
- **Cada cliente, su propia base de datos.** No shared tenancy.
- **178 planes prepagados corriendo** en un gimnasio (Tavros).
- **8 años de datos migrados en vivo** para un cliente.
- **355 facturas / $1.59M MXN** auditadas y reconciliadas en una sola corrida de conciliación (scale of money flowing, not savings).
- **Cobros: SPEI, Mercado Pago, tarjeta, terminal**, desde la app.
- **Live domains** for screenshots: cosmos.tavrosfuerza.com, eternus.aetherml.com, wedding.aetherml.com, app.sismocafe.com, appeloisamontero.aetherml.com, eloisamontero.aetherml.com (storefront).
- **One owner quote, as problem not result:** "pierdo hora y media diaria escarbando Excel" (Sismo, pre-sale). Attribute or anonymise [DECIDE].

**Never on the page:** 30+ hrs/wk, 3x, 2x, 1500+ hrs/yr, 12 min, "recover cost in 60 days", "100+ tools", Kraken's Bay as a client. Remove `METRICS`, `TOTAL_HOURS`, `BASE_TASKS` constants and the WorkDisappears counter.

**Concentration caveat:** 5 of 7 accounts are one family. Lead with systems shipped, not logo count. When Sismo's 12-month case study lands, it becomes the first documented result.

---

## 7. AI section (the differentiator, told honestly)

Hook: **"La IA nunca inventa un número."**

- Sales-call recordings (Fathom, Zoom, PLAUD) → contacts, quoted amounts, terms, next steps, extracted into CRM and quotes.
- Every fact cites the exact sentence it came from; anything it cannot cite is left blank.
- A human approves before anything is written to CRM or Books. Append-only, versioned.
- Plus the "smart" rules the owner feels daily: SPEI deposits matched to invoices, renewals detected, stock leaks priced in pesos, duplicate leads merged.
- What we do not sell: chatbots, agents that act alone, "todo automático". Weekly count stays human; nothing reaches your customer without an explicit OK.
- How it is built: AI-assisted delivery pipeline with CI gates, which is why a bespoke system ships in weeks, not quarters.

---

## 8. Landing page spec (section → job → copy direction)

Spanish first, English toggle. One CTA everywhere: **"Quiero mi Mapa de Fugas"** + WhatsApp co-primary (per lead-capture memory).

| # | Section | Job | Copy direction |
|---|---|---|---|
| 1 | Hero | dream outcome + likelihood | H1 "Tú llevas el negocio. Nosotros, lo demás." Sub: "Nexus: tu negocio en una sola pantalla, con tu marca, en 6 semanas." Real screenshot (Tavros or Eternus home). Under CTA: guarantee one-liner + "Mapa de Fugas: te lo quedas aunque no nos contrates." |
| 2 | Pain | make them nod | The six playbook signals as a checklist: "Sólo una persona sabe cómo funciona el proceso." … "El negocio creció, pero el control no creció con él." Closer: "Si marcaste dos, sigue leyendo." |
| 3 | The Monday screen | dream outcome made concrete | One annotated real Tablero screenshot: sold / collected / who owes / decisions for today. |
| 4 | What you get | the stack | 8 components, one line each, in delivery order. Bonuses as a second row. |
| 5 | Live systems | proof | 5 cards: vertical, real screenshot, module chips, live domain. Facts from §6. No metrics of results. |
| 6 | AI, honestly | differentiation | §7 as written. |
| 7 | Investment | price anchor | Three packages, structure from §5, guarantee verbatim, anti-price-shopper line. |
| 8 | How it works | reduce time/effort | Descubrimiento → Oferta → Fase 1 (6 semanas) → Continuidad. "Cada reunión termina en una decisión." |
| 9 | Fit / not fit | qualify | From playbook §2 fit and disqualifiers. |
| 10 | FAQ | objections | Zoho ya hace esto / nunca termina / el equipo no lo usa / podemos hacerlo nosotros / ¿cómo sé que funciona? / está caro — playbook answers verbatim, shortened. |
| 11 | Contact | convert | Calendly (Mapa de Fugas, 20 min) + WhatsApp + message fallback. Assurances: NDA día uno · 6 semanas Fase 1 · Te quedas el Mapa. |

Remove: integrations marquee (tool-list label, banned by brand memory), WorkDisappears counter, 8-tab services menu, Kraken slide, synthetic ProductMockup.

---

## 9. Decisions blocking the build [DECIDE]

1. Client permission to name + screenshot: Tavros, Eternus, TWM, Sismo, Eloisa. Confirm Sismo is live (tenant config says yes since 2026-07-26; playbook says demo).
2. Kraken: remove entirely (recommended) or "built in days, never deployed" as a configurability note.
3. Price floors for Fase 1 and Recomendado, and continuity per module.
4. Which guarantee tier to publish: playbook-only, or the Sismo-deck stack.
5. Scarcity number that is true this month.
6. Sismo owner quote: attributed or anonymised.

Once 1–3 are answered the page can be built from this spec without further copy decisions.

---
---

# Parte 2 — Un Nexus, cinco sabores: cómo vender cada uno

Fecha: 2026-09-18. Fuentes: código de nexus (`~/Desktop/zoho-tavros`, `~/Desktop/volt`), playbook de ventas, y benchmark de SaaS verticales en México 2025–26 (precios y quejas públicas). Marcos: Obviously Awesome (posicionar por contexto), Crossing the Chasm (una cabeza de playa a la vez), $100M Offers/Leads (oferta y canal).

## 0. La tesis

Nadie compra "una plataforma operativa". Un dueño de gimnasio compra "el sistema para gimnasios que cobra solo y factura". Nexus es una sola plataforma, pero **se vende como cinco productos con nombre, avatar, dolor, enemigo y prueba propios**, y una sola página madre que los conecta con el gancho de marca.

Lo que hoy tenemos y no estamos usando:

- **Un enemigo claro por vertical.** Los SaaS que esos dueños ya conocen fallan igual en México: CFDI como extra o inexistente, sin SPEI/OXXO/Mercado Pago, contratos de 6 a 36 meses, cuota por exportar tus datos, cobro en USD, soporte en inglés. HoneyBook ni siquiera opera en México. Ese es el contexto donde Nexus se ve obvio.
- **Una ventaja que ningún SaaS puede decir:** tu marca, tu base de datos, tu factura, y una persona que lo pone a funcionar contigo. La ventaja no es "más funciones", es "hecho para tu negocio y es tuyo".
- **Un ritual firma que ya existe en todos los sabores:** el lunes ves qué se vendió, qué se cobró, quién debe y qué falta, sin abrir Excel. Sismo lo tiene diseñado (`demo.md`) pero apagado. Tavros lo tiene como Home. Eternus como "Needs you today". Ese es el producto que se vende en todas las variantes: **el resumen del lunes**.
- **Una tendencia que empuja:** 2025–26 los SaaS subieron precios (HoneyBook +89%, Kajabi +25–40%, Hotmart duplica cuota fija en sept-2026) y facturar CFDI 4.0 ya no es opcional. "Tu sistema, en pesos, con factura" vende solo.

## 1. Qué tan vendible es cada sabor hoy (del código, no del deseo)

| Sabor | Cliente #2 por configuración | Qué falta para venderlo repetido | Prueba disponible |
|---|---|---|---|
| Gimnasios (Tavros) | Casi. 80% empaquetado en `feature-memberships`. | Sacar Balance/Banco/Reembolsos de `apps/tavros` al paquete; quitar candados "sólo Tavros"; cuentas de capital configurables. ~2–3 semanas. | Tavros vivo, 178 planes; Kraken construido (prueba de reuso, no cliente). |
| Estudios de bodas / creativos (Eternus) | Cerca. `feature-projects` + `feature-crm` existen. | Convertir tablas `client:eternus` en capacidad; desmarcar contrato/PDF. ~2–3 semanas. | Eternus vivo, flujo completo lead→contrato→entrega→margen. |
| Educación / cursos (TWM) | Sí, es CRM + cobros + anuncios. | Objeto "alumno" real (hoy es un contacto). Cohortes y asistencia son nuevas. | TWM vivo. |
| Café + tostaduría + mayoreo (Sismo) | No. 23k líneas viven en `apps/sismocafe`; POS atado a Sismo; Resumen y Finanzas apagados. | Extraer `feature-operations`; sucursales/recetas como datos; encender Resumen. Meses. | La mejor historia ("3 L de leche = $72 de fuga") y la menos empaquetada. |
| Joyería / atelier (Eloisa) | No como vertical. El lado dueño es contabilidad genérica; el sabor vive en el theme de Shopify. | Pantallas de citas, piezas y Cuidado en Nexus. Hoy cliente #2 = otro theme. | Tienda viva, configurador, citas sin doble reserva, Cuidado por pieza. |

## 2. Los cinco productos

Cada uno con la cadena de Dunford: contra qué compiten hoy → qué tenemos que ellos no → qué logra el dueño → quién lo necesita más → en qué categoría lo ponemos. Nombres en español, descriptivos y buscables; el playbook sigue nombrando cada propuesta "Nexus [resultado] para [negocio]".

### 2.1 Nexus para gimnasios — cabeza de playa

- **Contra:** Fitco ($999–3,299 MXN/mes, factura electrónica aparte), Boxmagic ($999–1,499, contrato 6 meses), Mindbody/Glofox (USD, cuota por exportar datos), y la recepcionista con libreta.
- **Lo nuestro:** cobrar a un socio en dos toques, mensual ⇄ prepago sin rehacer nada, depósitos que se cuadran solos, factura en cada cobro, balance y capital por socio, tu marca en el celular. Tus datos son tuyos.
- **Resultado:** el dueño sabe quién debe y cobra sin preguntar. Nada se escapa.
- **Quién más:** gimnasios y academias de 150 a 600 socios, dueño-operador, ya cobran en SPEI y tarjeta, ya probaron una app y "nadie la usa".
- **Categoría:** "el sistema de cobros y socios hecho para tu gimnasio, en pesos y con factura". Pez grande en estanque chico: no competimos con Mindbody, competimos con el Excel y con la app que no facturaba.
- **Gancho:** *Sabes quién te debe. Cobras sin preguntar.*
- **Imán de leads:** "Auditoría de adeudos": en 20 minutos, cuánto te deben hoy tus socios y cuánto se te fue el mes pasado. Revela el problema; te quedas con el número.
- **Ancla de precio:** un gimnasio ya paga $1–3k al mes por software que no factura, más comisiones, más la persona que persigue pagos. Nexus se compara contra la persona y las comisiones, no contra Fitco. **[DECIDE]** una entrada "Nexus Cobros" más ligera (sólo socios + cobros + banco) con mensualidad menor a la de continuidad completa, para ganar el estanque rápido.

### 2.2 Nexus para estudios de bodas — segunda ola, con canal propio

- **Contra:** HoneyBook (no opera en México), Studio Ninja/Táve (USD, sin CFDI, dueño cambió en 2025), Dubsado (cobra extra por moneda), y WhatsApp + anticipo por transferencia + contrato en PDF.
- **Lo nuestro:** de la pareja al contrato firmado a la entrega, cada boda con su gasto y su margen, aviso cuando dos bodas caen la misma semana, quién está editando qué.
- **Resultado:** el estudio sabe cuánto ganó en cada boda y qué entrega está en riesgo, hoy.
- **Quién más:** estudios de foto y video de bodas con 20+ bodas al año, 2 a 8 personas, que cotizan paquetes y cobran en cuotas.
- **Categoría:** "el sistema para estudios de bodas que sí existe en México".
- **Gancho:** *Cada boda con su contrato, su cobro y su ganancia.*
- **Imán:** "Margen por boda": calculadora de qué te quedó de tus últimas 5 bodas después de crew, viáticos y equipo.
- **El activo escondido:** The Wedding Method enseña a filmmakers de bodas en MX y LATAM. Sus alumnos son exactamente el avatar de este sabor. **Es un canal de distribución que ya pagamos.** Un módulo del curso o una sesión "así opera un estudio profesional" convierte alumnos en prospectos calificados sin anuncios.

### 2.3 Nexus para academias y cursos — venta cruzada, no cabeza de playa

- **Contra:** Hotmart (9.9% + cuota por venta, pagos retenidos hasta 30 días, "no tienes tu base de alumnos"), Kajabi/Teachable (USD, sin CFDI).
- **Lo nuestro:** tus alumnos, tu cobro en pesos, tu factura, 0% de comisión, y qué anuncio trajo a cada alumno.
- **Gancho:** *Tus alumnos, tu cobro, tu factura. Sin comisión.*
- **Imán:** "Cuánto te cobra Hotmart al año": calculadora con sus tarifas publicadas.
- **Realidad:** hoy es CRM + cobros. Sin objeto alumno (cohortes, acceso) sólo sirve a educadores de alto ticket con pocos alumnos, como TWM. Venderlo así, no como plataforma de cursos.

### 2.4 Nexus para cafeterías y tostadores — la mejor historia, se vende a mano

- **Contra:** Poster/Fudo/Parrot (POS, facturación como módulo extra), Cropster (EUR, sólo tueste), y el Excel del cierre semanal.
- **Lo nuestro:** ventas por sucursal, receta × ventas = consumo teórico, conteo físico, y la diferencia en pesos. Tueste, taller, requisiciones, mayoreo con portal para que el cliente pida solo.
- **Resultado:** el dueño sabe qué sucursal cuadra y cuál se le fuga, en pesos, cada lunes.
- **Gancho:** *Sabes qué sucursal cuadra. Y cuánto se te fue.*
- **Imán:** "Fuga en pesos": con tus ventas de una semana y tu conteo, te decimos cuánto se fue y en qué insumo.
- **Cómo venderlo hoy:** sólo como "Varias áreas o sucursales", uno a la vez, hasta extraer el paquete. Es el sabor de mayor ticket ($230k de referencia) y el que más necesita el caso de estudio de Sismo.

### 2.5 Eloisa: no es un sabor de Nexus todavía, es "Tienda + operación"

- **Contra:** Shopify solo (recibos, no CFDI; sin OXXO ni MSI en Shopify Payments), citas en otra app, cuidado post-venta en una libreta.
- **Lo nuestro:** tienda a la medida que cierra por compra o por cita, configurador, citas de taller con cupo real, cada pieza con su historial y servicios incluidos.
- **Cómo venderlo:** como oferta bespoke para marcas de alto ticket (joyería, moda a medida, diseño de interiores) donde la venta es emocional y termina en cita. No prometer "Nexus para joyerías" hasta tener pantallas del lado dueño. Sí usarla como prueba de que hacemos también la cara pública del negocio.

## 3. Orden de ataque (Crossing the Chasm)

1. **Gimnasios, Zapopan y Guadalajara, 6 meses.** Es donde el producto está más listo, el enemigo tiene precios y quejas públicas, el dueño es alcanzable caminando, y el dolor es dinero que no entra. Meta: 5 gimnasios pagando, 3 referenciables entre sí. Los pragmáticos sólo compran con referencias de su mismo gremio; Tavros más dos gimnasios más es la mínima masa.
2. **Estudios de bodas, vía The Wedding Method.** Canal propio, cero competencia local real. Empieza cuando el gimnasio tenga 3 referencias, no antes.
3. **Cafés y tostadores.** Sólo bespoke hasta que el paquete exista. El caso de Sismo (12 meses, antes/después) es la llave.
4. Educación y joyería: venta cruzada y bespoke, sin página propia por ahora.

Regla: una vertical activa en marketing a la vez. Las demás se venden por referencia y desde la página madre.

## 4. Qué cambia en la página y en el producto

**Página madre** (lo que ya construimos): se queda horizontal con el gancho de marca. Se agrega un selector arriba del pliegue: *¿Qué negocio llevas?* Gimnasio · Estudio de bodas · Cafetería · Cursos · Otro. Cada opción lleva a `/gimnasios`, `/estudios`, `/cafeterias`, `/cursos`, con las mismas 11 secciones pero con avatar, dolores, gancho, captura de pantalla y objeciones de esa vertical. En código: una ruta por vertical y un namespace de copy por vertical; los componentes ya existen.

**Producto**, en este orden porque desbloquea ventas:

1. **Resumen del lunes como Home universal.** Es el ritual que todos compran. Sismo lo tiene diseñado y apagado; Tavros y Eternus lo tienen a medias. Una sola pantalla, la misma en todos los sabores, con nouns del tenant. Es también la captura de pantalla del hero de cada vertical.
2. **Des-Tavrosizar gimnasios.** Mover páginas a `feature-memberships`, quitar candados de tenant. Cliente #2 por configuración en días.
3. **Des-Eternizar estudios.** Igual con `feature-projects`.
4. **Un tenant demo por sabor** con datos ficticios. Sirve para capturas, para demos en la primera llamada, y para el video "La demostración" del manual de marca.
5. **Medir desde el día uno.** Cada tenant nuevo arranca con línea base (adeudos, horas de cierre, días para cobrar). Sin eso nunca tendremos el recibo. El playbook lo exige y hoy no existe ningún número.

## 5. Canal (100M Leads): dominar uno

- **Referidos y red caliente primero.** 5 de 7 cuentas vienen de una familia; el siguiente círculo es el de cada cliente: el gimnasio conoce gimnasios, TWM conoce 200 filmmakers. Pedir la referencia en el momento del primer "ya cuadró".
- **Contenido "El recibo" y "La demostración"** del manual de marca, uno por vertical, con el tenant demo.
- **Alianzas locales:** contadores de PyMEs en GDL (les quitamos la conciliación), distribuidores de equipo de gimnasio, la comunidad de TWM.
- Anuncios pagados sólo cuando haya 10 clientes y una vertical con caso documentado.

## 6. Decisiones nuevas para Luis [DECIDE]

1. Cabeza de playa: gimnasios primero, ¿sí?
2. ¿Existe una entrada "Nexus Cobros" para gimnasios con mensualidad menor, o todo entra por Fase 1 completa?
3. ¿Usar The Wedding Method como canal explícito para estudios (sesión dentro del curso, oferta a alumnos)?
4. Prioridad de ingeniería: ¿Resumen del lunes universal antes que des-Tavrosizar, o al revés?
5. Nombres: ¿"Nexus para gimnasios" descriptivo, o nombres propios por sabor? Recomiendo descriptivo: se busca, se entiende y no requiere educar.
6. Tenants demo: ¿los armamos con datos ficticios para capturas y demos?

### 2.6 Sabor en arranque: grupos de panadería y restaurantes con varias casas, cumplimiento fiscal (2026-09-19)

POC diseñado, cliente firmado pero sin arrancar; **no se nombra en la página**. Problema: tres casas con tasas distintas (pan 0%, café y deli 16%), venta diaria por método de pago, tarjeta y transferencia se facturan tal cual, efectivo se ajusta, prefactura por método, cierre semanal. Categoría: "facturar bien lo que sí cobraste, casa por casa". Enemigo: el POS que emite tickets y el contador que cuadra a fin de mes. Es el puente natural entre el sabor café (Sismo) y un sabor "grupo restaurantero" con ticket alto. En la página: séptima tarjeta anónima con badge "Arrancando", sin logo, sitio ni captura, CTA "Facturar bien me quita el sueño".
