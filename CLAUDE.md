# construarqwall-landing — funnel VSL de Construarqwall (Bakano)

Creado desde la plantilla `drobles-png/landings-vsl` con la skill `landings-vsl`.

## Cliente
- **Construarqwall** (marca visible: The Wall Estudio Arquitectónico, IG @thewall.arquitectura).
  Habla en el VSL: **Dayanara**, arquitecta. Remodelaciones de casas (áreas sociales, patios,
  piscinas, cocinas, fachadas) en Samborondón, Ciudad Celeste, Villa Club, La Joya, Villas del Rey,
  Mocolí, Puerto Azul y Vía a la Costa.
- Ficha en Metrics: activo, servicio completo. **Sin estrategia ni identidad de marca cargadas.**

## Flujo
Agenda (sin pago): `/` → registro → `/ver-video` → cualificación → `/agendar` (calendario GHL
`CiMZXiIACMrNMkoz1eya`, visita técnica de $30) → `/cita-confirmada`. No califica → `/sin-espacio`.

## Config usada (`src/config/funnel.ts`)
- Pixel `1817846173673919` · CAPI: token en `.env.local` y en Vercel (`META_CAPI_TOKEN`).
- Webhooks GHL: contacto `…/6s4CegXvb9aslO5J4JwS`, cualificación `…/jWP7sXeSWQqKNvRW0J72`.
- `SITE_URL` = `https://thewall-lng.vercel.app` · `STORAGE_PREFIX` `cqw` · `FUNNEL_TAG` `funnel-construarqwall`.
- WhatsApp `593993495392` · correo legal `thewall.arquitectura@gmail.com`.

## Cualificación (`src/utils/qualification.ts`)
Preguntas: proyecto, zona, presupuesto, visita de $30 + abierta (`objetivo`).
`DISQUALIFY`: `proyecto=arreglo` ("no un arreglo suelto"), `zona=otra` ("zona definida"),
`visita=no`. El presupuesto **no** descalifica ("puede haber trabajos más pequeños"); se usa para
preparar la visita (confirmado por David, 18 nov 2026: `menos_15k` no descalifica).

## Diseño
Estructura corta (4 secciones): hero (titular + portada del video) → banda oscura (el orden:
diseñamos → presupuestamos → construimos, + obras) → 4 pasos con cajetín de "Cómo empezamos" →
Dayanara (frase, presentación, zonas, para quién es). Recursos propios: la W de líneas finas del
logo (logo SVG redibujado, W grande que se dibuja en la banda), arcos del fondo del logo en el hero,
cajetín de presupuesto. Barlow Condensed + Barlow. Colores del logo: greige `#a69c94`, piedra `#2b2623`.

## Publicación (18 nov 2026)
- Producción: **https://thewall-lng.vercel.app** · Vercel `bakano-proyects/construarqwall-landing`,
  conectado al repo (cada push a main publica). Env: `META_PIXEL_ID`, `META_CAPI_TOKEN`.
- Meta en **modo landing** (CAPI desde `/api/capi`). Probado con `TEST98855` y ya quitado.
- GHL probado de punta a punta (MCP): 1 contacto, notas, tags, FB clid, oportunidad en
  "Agendó llamada" / "No califica". Contactos de prueba borrados.
- Pruebas: `e2e/agenda.json` (califica) y `e2e/no-califica.json` (zona = otra).

## Pendientes
- **Media ID de Wistia** del VSL (`WISTIA_MEDIA_ID` vacío: `/ver-video` sin video).
- **Foto de Dayanara** (portada del video y sección de presentación). Hoy: render de fachada
  (`public/portada-fachada.webp`) y de área social (`public/area-social.webp`).
- Fotos de obras: renders del IG del cliente (`public/obra-*.webp`, 3:2). Originales en
  `~/Downloads/thewall.arquitectura/`.
- Revisar que los workflows de GHL no tengan la acción "API de conversión de Meta" en registro,
  cualificación o cita (el servidor es `/api/capi` de la landing).
- Logo en vector/PNG en alta (el SVG actual está redibujado a mano).
- Apellido de Dayanara y si la marca visible es "The Wall" o "Construarqwall".
- Datos legales: razón social y RUC (`LEGAL`).
- Estrategia e identidad de marca en Metrics (`ficha_tecnica` vacía).

## Stack
Vue 3 + Vite 7 + TypeScript · SCSS · Pinia · vue-router · pnpm · libphonenumber-js ·
Font Awesome 6 por CDN · Geist por Google Fonts · función de Vercel `api/capi.ts`.

## Comandos
`pnpm install` · `pnpm dev` (`--host` para el celular) · `pnpm dev:api` (vercel dev, front + /api) ·
`pnpm type-check` · `pnpm build` · `pnpm format`

## Dónde está cada cosa
- `src/config/funnel.ts` — TODO lo que cambia por cliente. Vacío = esa integración se omite.
  `PAYMENT_ENABLED` registra o no `/pago` y `/inscripcion-confirmada`; `PAYMENT_PROVIDER` elige
  `'payphone'` (Cajita, pago verificado) o `'link'` (botón a `PAYMENT_URL`, sin verificación).
- `src/content/copy.ts` — todos los textos (marcadores `[…]`). `SEO` = título/descr. por ruta.
  `LANDING.testimonials` y `LANDING.team`: opcionales, vacíos = la sección no aparece (solo reales).
- `src/components/TestimonialsSection.vue`, `TeamSection.vue`, `PersonAvatar.vue` (foto o iniciales).
- Portada del video en la landing: `VSL_POSTER` (Cloudinary) → `VSL_POSTER_FALLBACK` (public/) → recuadro.
- `src/utils/qualification.ts` — preguntas, `OBJETIVO` (pregunta abierta) y `qualifies()`.
- `src/utils/ghl.ts` — contrato GHL (`buildPayload`, `trackStage`, `postToGhl`, `buildNota`, `fbq`).
- `src/utils/fbclid.ts` — `captureFbParams()` (en cada vista de entrada: `/` y `/ver-video`) y
  `getStoredFbParams()` (fbc/fbp primero de las cookies del pixel).
- `src/utils/capi.ts` + `api/capi.ts` — CAPI con el mismo `event_id` que el Pixel; no corre en localhost.
- `src/components/CountdownTimer.vue` — temporizador del encabezado: ciclos de `TIMER_CYCLE_HOURS` (12) anclados a la hora
  de Ecuador, se reinicia solo; textos en `LANDING.timer` (`short` = celular).
- `src/components/GhlCalendar.vue` — iframe de GHL: alto automático, prefill, Schedule + `cita_agendada`.
- `src/styles/tokens.scss` — colores/tipografía (se inyecta en cada `<style lang="scss">`; solo
  variables y mixins). `global.scss` — botones, campos, modales.
- `vite.config.ts` — plugin `metaPixel`: lee `META_PIXEL_ID` de la config e inyecta el snippet del
  pixel en `index.html` (vacío = sin pixel; el snippet no carga en localhost). Plugin
  `organizationJsonLd`: JSON-LD de la empresa con CLIENT/SITE_URL/LOGO_URL/LEGAL (sin nombre, nada).
- `api/capi.ts` — solo los 6 eventos del funnel, solo mismo origen (403 si no), token en el cuerpo.
- Payphone: `api/payphone-order.ts` (fija el monto en `PRICE_CENTS` y entrega token/storeId),
  `api/payphone-confirm.ts` (confirma con Payphone; Purchase solo si statusCode 3 y el monto
  correcto), `src/utils/payphone.ts` (carga la Cajita). Env vars de Vercel: `PAYPHONE_TOKEN`,
  `PAYPHONE_STORE_ID`; sin ellas `/pago` muestra el plan B (WhatsApp/Instagram). `vercel.json`
  manda `Referrer-Policy: origin-when-cross-origin` (lo exige la Cajita).
- En localhost **no sale nada a GHL** (consola `[GHL stub]`) salvo con `?ghl=1` en la URL.

## Envíos
| Momento | GHL (webhook · etapa) | Meta (Pixel + CAPI, mismo event_id) |
|---|---|---|
| Registro | contacto · `registro` (abandono con email/tel: `registro_parcial`) | CompleteRegistration |
| /ver-video | — | ViewContent |
| Cualificación | cualificación · `cualificacion` (+ `califica`, `resultado`, `*_label`, `objetivo`) | Lead (solo si califica) |
| Cita | contacto · `cita_agendada` | Schedule |
| /pago | contacto · `pago_iniciado` | InitiateCheckout |
| /inscripcion-confirmada | contacto · `pagado` (Payphone: solo pago aprobado; link: 1 vez por dispositivo) | Purchase (Payphone: event_id `purchase_<transactionId>`) |

Etapas en minúscula con guion bajo (`pago_iniciado`); tags con guion (`step-3-pago-iniciado`).

## Convenciones (el e2e depende de ellas)
- `data-field` en cada input: `nombre`, `apellido`, `email`, `phone`, `pais`, `ciudad` (si `ASK_CITY`),
  `objetivo`, `consent`.
- `data-cta="registro"` en cada botón que abre el registro; `data-cta="calificar"` en el CTA de /ver-video.
- Opciones de cualificación: `<label>` que envuelve `<input type="radio" value="…">`.
- Rutas privadas con `noindex` (y `Disallow` en `public/robots.txt`).
- Guards: `/agendar` y `/pago` exigen contacto (en localhost no, para diseñar); `/inscripcion-confirmada`
  exige contacto siempre con `'link'` (con Payphone no: el pago se verifica en el servidor); `/agendar` además exige haber calificado; `/cita-confirmada` exige cita < 24 h.

## localStorage / sessionStorage (`<STORAGE_PREFIX>_…`)
`_contact` · `_qualification` · `_disq_at` · `_booked_at` · `_purchase_at` (Payphone: `_purchase_at_<transactionId>`) · `_fb` (sessionStorage)

## Pruebas
`e2e/agenda.json` y `e2e/pago.json` para `~/.claude/skills/landings-vsl/scripts/e2e_funnel.py` (ver README).
Nunca dejar URLs de prueba en la config al hacer commit.

## No hacer
- No inventar cifras, testimonios ni escasez. "Quedan N cupos" solo con una cifra real del cliente;
  si su capacidad es grande, no se muestran cupos (basta el temporizador).
- No dejar `META_CAPI_TEST_EVENT_CODE` en producción.
- Los flujos de GHL no llevan la acción *Meta Conversion API* para los eventos que ya manda la
  landing (no tiene Event ID: duplicaría). Ver `references/meta.md` de la skill.
