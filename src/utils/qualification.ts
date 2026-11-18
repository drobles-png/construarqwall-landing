// Modelo de cualificación del funnel: UNA sola fuente de verdad.
// Para un cliente nuevo solo se editan QUESTIONS, OBJETIVO y la regla de qualifies().
// Salen del cierre del VSL / de lo que el cliente define como "sí es cliente" (no inventar).
//
// Cada respuesta viaja a GHL como `<key>` (valor interno) y `<key>_label` (texto legible:
// es el que se mapea en los campos personalizados). Ver references/contrato-ghl.md de la skill.
// Los `value` son estables: si GHL ya está mapeado, NO renombrarlos (solo agregar).

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  key: string
  title: string
  /** Etiqueta corta para la nota del CRM */
  noteLabel: string
  options: readonly QuestionOption[]
}

export const QUESTIONS = [
  {
    key: 'proyecto',
    title: '¿Qué quieres remodelar?',
    noteLabel: 'Proyecto',
    options: [
      { value: 'patio_area_social', label: 'Patio o área social' },
      { value: 'piscina', label: 'Piscina' },
      { value: 'cocina', label: 'Cocina' },
      { value: 'fachada', label: 'Fachada' },
      { value: 'varios', label: 'Varios espacios de la casa' },
      { value: 'arreglo', label: 'Un arreglo puntual (pintura, una reparación)' },
    ],
  },
  {
    key: 'zona',
    title: '¿Dónde está tu casa?',
    noteLabel: 'Zona',
    options: [
      { value: 'samborondon', label: 'Samborondón, Ciudad Celeste o Mocolí' },
      { value: 'daule', label: 'Villa Club, La Joya o Villas del Rey' },
      { value: 'via_costa', label: 'Vía a la Costa o Puerto Azul' },
      { value: 'otra', label: 'En otra zona' },
    ],
  },
  {
    key: 'presupuesto',
    title: '¿Cuánto piensas invertir en la remodelación?',
    noteLabel: 'Presupuesto',
    options: [
      { value: 'menos_15k', label: 'Menos de $15.000' },
      { value: 'de_15k_a_30k', label: 'Entre $15.000 y $30.000' },
      { value: 'de_30k_a_60k', label: 'Entre $30.000 y $60.000' },
      { value: 'mas_60k', label: 'Más de $60.000' },
      { value: 'no_se', label: 'Todavía no lo tengo claro' },
    ],
  },
  {
    key: 'visita',
    title: 'Empezamos con una visita técnica a tu casa, que cuesta $30. ¿Te parece bien?',
    noteLabel: 'Visita $30',
    options: [
      { value: 'si', label: 'Sí, quiero agendarla' },
      { value: 'no', label: 'Por ahora no' },
    ],
  },
] as const satisfies readonly Question[]

/** Último paso: pregunta abierta (va a GHL como `objetivo`). */
export const OBJETIVO = {
  title: '¿Qué espacio quieres cambiar y qué es lo que más te molesta hoy?',
  placeholder:
    'Ej.: El patio es puro cemento y casi no lo usamos. Queremos una zona de parrilla para reunir a la familia los fines de semana.',
  minWords: 10,
}

export type QuestionKey = (typeof QUESTIONS)[number]['key']
export type Answers = Record<QuestionKey, string>

export const emptyAnswers = (): Answers =>
  Object.fromEntries(QUESTIONS.map((q) => [q.key, ''])) as Answers

export function labelFor(key: QuestionKey, value: string): string {
  const q = QUESTIONS.find((x) => x.key === key)
  return q?.options.find((o) => o.value === value)?.label ?? value
}

// ── Regla de cualificación ────────────────────────────────────────────────────
// Del VSL: "siempre hablamos de una remodelación de verdad, no de un arreglo suelto", "trabajamos en
// una zona definida" y la visita técnica de $30 como primer paso. El presupuesto NO descalifica
// ("puede haber trabajos más pequeños"): sirve para preparar la visita.
const DISQUALIFY: Partial<Record<QuestionKey, readonly string[]>> = {
  proyecto: ['arreglo'],
  zona: ['otra'],
  visita: ['no'],
}

export function qualifies(a: Answers): boolean {
  return (Object.keys(DISQUALIFY) as QuestionKey[]).every(
    (k) => !(DISQUALIFY[k] ?? []).includes(a[k]),
  )
}
