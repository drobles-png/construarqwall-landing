// Textos de la página. Un cliente nuevo edita SOLO este archivo (y config/funnel.ts).
// Todo lo que está entre [corchetes] es un marcador: reemplazar con lo que dice el VSL del cliente.
// No inventar cifras, testimonios, garantías ni bonos.
import { BRAND_NAME, PERSON_NAME } from '@/config/funnel'

export interface Testimonial {
  name: string
  role: string
  quote: string
  /** Resultado concreto que dijo el testimonio (opcional): "+30% en ventas" */
  result?: string
  photo?: string
}

export interface TeamMember {
  name: string
  role: string
  bio?: string
  photo?: string
}

export const SEO = {
  landing: {
    title: `${BRAND_NAME} | Remodelaciones en Samborondón y Vía a la Costa`,
    description:
      'Diseñamos y construimos remodelaciones de casas: patios, piscinas, cocinas y fachadas. Ves el render y el presupuesto antes de romper nada.',
  },
  video: {
    title: `Mira el video | ${BRAND_NAME}`,
    description: 'Cómo diseñamos, presupuestamos y construimos tu remodelación con una arquitecta responsable de principio a fin.',
  },
  booking: { title: `Agenda tu visita técnica | ${BRAND_NAME}`, description: 'Elige el día y la hora de tu visita técnica.' },
  booked: { title: `Visita confirmada | ${BRAND_NAME}`, description: 'Tu visita técnica está confirmada.' },
  noSpace: { title: `Todavía no es el momento | ${BRAND_NAME}`, description: 'Gracias por tu interés.' },
  pago: { title: `Confirma tu lugar | ${BRAND_NAME}`, description: 'Completa tu inscripción.' },
  confirmada: { title: `Inscripción confirmada | ${BRAND_NAME}`, description: 'Tu lugar está confirmado.' },
  privacy: { title: `Política de privacidad | ${BRAND_NAME}`, description: `Política de privacidad de ${BRAND_NAME}.` },
  legal: { title: `Aviso legal | ${BRAND_NAME}`, description: `Aviso legal de ${BRAND_NAME}.` },
}

// ── Landing (/) ───────────────────────────────────────────────────────────────
// Estructura corta: hero → banda (el orden) + obras → los 4 pasos → Dayanara.
// Todas las frases salen del VSL.
export const LANDING = {
  // Temporizador del encabezado (components/CountdownTimer.vue). short = versión de celular.
  timer: { label: 'Agenda de visitas técnicas', short: 'Agenda', prefix: 'Cierra en' },
  headline: 'Antes de romper una sola pared,',
  headlineAccent: 'diseñamos tu proyecto y te decimos cuánto cuesta.',
  sub: 'Remodelaciones de casas en Samborondón y Vía a la Costa: áreas sociales, patios, piscinas, cocinas y fachadas. Con una arquitecta que responde por tu obra de principio a fin.',
  videoLabel: 'Mira el video',
  videoCaption: `${PERSON_NAME} · Arquitecta de ${BRAND_NAME}`,
  cta: 'Ver el video completo',
  ctaNote: 'Sin costo · Solo te pedimos tus datos para mostrártelo',

  // Banda: el orden en el que trabajamos
  order: ['Primero diseñamos', 'después presupuestamos', 'recién ahí construimos'],
  // Obras reales (renders del Instagram del cliente). Todas recortadas a 3:2.
  works: [
    { photo: '/obra-cocina.webp', label: 'Cocinas', w: 1200, h: 799 },
    { photo: '/obra-pergola.webp', label: 'Áreas sociales', w: 709, h: 473 },
    { photo: '/obra-piscina.webp', label: 'Piscinas', w: 774, h: 516 },
    { photo: '/obra-patio.webp', label: 'Patios', w: 822, h: 548 },
  ],

  steps: {
    title: 'Cuatro pasos, en orden, sin saltarse ninguno.',
    items: [
      { title: 'Visita técnica', text: 'Voy a tu casa, veo tu espacio y te digo qué se puede hacer.' },
      { title: 'Diseño', text: 'Render y presupuesto de obra antes de romper nada.' },
      { title: 'Obra', text: 'Escogemos juntos los materiales y estoy en tu obra.' },
      { title: 'Entrega', text: 'Tu espacio como lo viste en el render, listo para usar.' },
    ],
  },

  // Lo que se invierte para empezar (cajetín de presupuesto)
  budget: {
    title: 'Cómo empezamos',
    rows: [
      { label: 'Visita técnica', value: '$30' },
      { label: 'Diseño: render + presupuesto', value: '$300 a $500' },
      { label: 'Listo en', value: '15 a 20 días' },
    ],
    note: 'Si al ver el presupuesto decides no construir, no pagas el saldo del diseño.',
  },

  quote: 'Una remodelación que sale mal casi nunca sale mal en la obra. Sale mal antes.',

  about: {
    title: `Soy ${PERSON_NAME}. Diseño tu proyecto y estoy en tu obra hasta el último día.`,
    text: 'Somos una empresa pequeña a propósito: así voy a tu obra de verdad, no de vez en cuando.',
    photo: '/area-social.webp',
  },

  fit: {
    title: '¿Es para ti?',
    yesTitle: 'Sí, si quieres',
    yes: ['Ver cómo va a quedar antes de romper nada', 'Saber cuánto cuesta antes de empezar', 'Una arquitecta que responda por tu obra'],
    noTitle: 'No, si buscas',
    no: ['Solo el precio más bajo', 'Un diseño para que lo construya otra persona', 'Un arreglo suelto, no una remodelación'],
    minimum: 'Proyectos desde $15.000',
    zones: 'Samborondón · Ciudad Celeste · Villa Club · La Joya · Villas del Rey · Mocolí · Puerto Azul · Vía a la Costa',
  },

  sticky: { title: 'Remodela con diseño y presupuesto', sub: `Video de ${PERSON_NAME}`, cta: 'Ver video' },
  disclaimer:
    'Los resultados dependen de cada caso. Este sitio no está respaldado por Meta Platforms, Inc. ni forma parte de Facebook.',

  // Opcionales (vacíos = no aparecen). Solo reales.
  testimonials: { eyebrow: '', title: '', items: [] as Testimonial[] },
  team: { eyebrow: '', title: '', items: [] as TeamMember[] },
}

// ── Modal de registro ─────────────────────────────────────────────────────────
export const REGISTRO = {
  eyebrow: `Video de ${PERSON_NAME}`,
  title: 'Mira el video completo',
  sub: `${PERSON_NAME} te cuenta cómo trabajamos paso a paso y cómo puedes agendar tu visita técnica.`,
  submit: 'Ver el video completo',
  submitPago: 'Continuar',
  legal: 'Tus datos están seguros · No spam',
}

// ── /ver-video ────────────────────────────────────────────────────────────────
export const VIDEO = {
  step: 'Paso 1 de 2',
  eyebrow: `${PERSON_NAME} · ${BRAND_NAME}`,
  title: 'Antes de romper una sola pared, diseñamos tu proyecto y te decimos cuánto cuesta',
  sub: 'Mira el video completo. Al final puedes agendar tu visita técnica.',
  lockText: 'El botón se habilita en',
  cta: 'Agendar mi visita técnica',
  trust: 'Visita técnica: $30 · Samborondón y Vía a la Costa',
}

// ── Cualificación (las preguntas están en utils/qualification.ts) ─────────────
export const CUALIFICACION = {
  eyebrow: 'Último paso',
  title: 'Cuéntanos de tu proyecto',
  sub: 'Una pregunta a la vez. Te toma un minuto.',
  consent: `Acepto que ${BRAND_NAME} me contacte por WhatsApp y correo, y acepto su`,
  submit: 'Ver horarios disponibles',
}

// ── /agendar ──────────────────────────────────────────────────────────────────
export const BOOKING = {
  step: 'Paso 2 de 2',
  title: 'Elige el día de tu visita técnica',
  sub: `${PERSON_NAME} va a tu casa, conoce tu espacio, escucha lo que quieres hacer y te da su opinión técnica. La visita cuesta $30.`,
  pending:
    'Estamos terminando de configurar el calendario. Te escribiremos por WhatsApp para coordinar tu visita.',
}

// ── /cita-confirmada ──────────────────────────────────────────────────────────
export const BOOKED = {
  title: 'Tu visita técnica está agendada',
  sub: 'Te enviamos los detalles a tu correo.',
  steps: [
    { icon: 'fa-solid fa-envelope', title: 'Revisa tu correo', text: 'Ahí tienes la fecha y la hora de la visita.' },
    { icon: 'fa-brands fa-whatsapp', title: 'Te escribimos por WhatsApp', text: 'Para confirmar la dirección y resolver dudas antes.' },
    {
      icon: 'fa-solid fa-list-check',
      title: 'Piensa en tu presupuesto',
      text: 'En la visita te vamos a pedir que seas sincero con el presupuesto que tienes en mente, para proponerte lo mejor que se puede hacer con esa inversión.',
    },
  ],
}

// ── /sin-espacio ──────────────────────────────────────────────────────────────
export const NO_SPACE = {
  title: 'Todavía no es el momento, y está bien',
  text: 'Por ahora trabajamos remodelaciones de casas en Samborondón y Vía a la Costa, con una visita técnica de $30 para empezar. Cuando sea tu momento, aquí estamos.',
  cooldown: 'Ya enviaste una solicitud. Podrás intentarlo de nuevo en',
  resourcesTitle: `Mira nuestras obras`,
  resourcesText: 'En Instagram publicamos los diseños, las obras y las piscinas que vamos entregando.',
}

// ── Pago (opcional) ───────────────────────────────────────────────────────────
export const PAGO = {
  step: 'Paso 2 de 2 · Confirma tu lugar',
  title: 'falta un paso para confirmar tu lugar',
  sub: 'Tu lugar queda reservado cuando completas el pago.',
  bullets: ['[Formato: en vivo, en línea]', '[Qué se lleva el asistente]'],
  noLink: 'Recibimos tus datos. Te enviaremos el enlace de pago a tu WhatsApp y a tu correo.',
  whatsappMsg: (nombre: string) => `Hola, soy ${nombre}. Me registré y quiero completar mi pago.`,
  expired: 'El formulario de pago venció por seguridad. Ábrelo de nuevo para pagar.',
  loadError: 'No pudimos cargar el pago. Inténtalo de nuevo o escríbenos.',
}

export const CONFIRMADA = {
  title: 'Tu lugar está confirmado',
  steps: [
    { icon: 'fa-solid fa-envelope-open-text', text: 'Revisa tu correo: ahí te llega la confirmación y el acceso.' },
    { icon: 'fa-brands fa-whatsapp', text: 'Te escribiremos por WhatsApp antes de empezar.' },
    { icon: 'fa-solid fa-list-check', text: '[Qué preparar antes del evento]' },
  ],
  calendarTitle: '¿Prefieres que veamos tu caso? Agenda una reunión',
  calendarButton: 'Agendar una reunión',
  // Solo con Payphone: estados mientras se confirma el pago o si no se aprobó
  checking: 'Confirmando tu pago…',
  checkingSub: 'No cierres esta página, toma unos segundos.',
  failedTitle: 'Tu pago no se completó',
  failedSub: 'Payphone no aprobó el cobro. Puedes intentarlo de nuevo con otra tarjeta.',
  nodataTitle: 'No encontramos un pago en este enlace',
  nodataSub: 'Si ya pagaste, te llega la confirmación a tu correo. Si no, completa tu pago aquí.',
  errorTitle: 'No pudimos confirmar tu pago',
  errorSub: 'Si se te descontó el dinero, escríbenos con este número de transacción y lo revisamos.',
  helpMsg: (nombre: string, tx: string) =>
    `Hola, soy ${nombre}. Pagué y no me aparece confirmado${tx ? ` (transacción ${tx})` : ''}.`,
}
