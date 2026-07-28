import { SITE_FAQ_ITEMS } from '../content/faq-items';

/**
 * El guion de Aura. Determinista y cerrado: cada respuesta que Aura puede dar
 * está escrita aquí o viene de SITE_FAQ_ITEMS, la misma fuente que alimenta
 * /faq. No hay generación de texto, así que no hay superficie por la que se
 * pueda colar una afirmación inventada. Eso no es una limitación técnica que
 * arrastramos, es el motivo por el que se eligió este motor.
 */

export interface AuraAction {
  readonly label: string;
  /** Ruta interna a la que lleva la acción. */
  readonly path: string;
  /** Parámetro `motivo`, el mismo que ya usan las CTA del sitio. */
  readonly motivo?: 'diagnostico' | 'briefing';
}

export interface AuraOption {
  readonly label: string;
  readonly nextId: string;
}

export interface AuraStep {
  readonly id: string;
  /** Lo que dice Aura al llegar aquí. Texto plano: nada se inyecta como HTML. */
  readonly says: readonly string[];
  readonly options?: readonly AuraOption[];
  readonly actions?: readonly AuraAction[];
}

/** Quita el marcado de las respuestas del FAQ para poder mostrarlas como texto. */
function aTextoPlano(html: string): string {
  return html
    .replace(/<\/p>\s*<p[^>]*>/g, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/** Construye un paso a partir de una pregunta frecuente ya publicada. */
function desdeFaq(id: string, indice: number, options: readonly AuraOption[], actions?: readonly AuraAction[]): AuraStep {
  const item = SITE_FAQ_ITEMS[indice];
  return {
    id,
    says: aTextoPlano(item.answer).split('\n\n').filter(Boolean),
    options,
    actions,
  };
}

const VOLVER: AuraOption = { label: 'Volver al inicio', nextId: 'inicio' };
const MAS_PREGUNTAS: AuraOption = { label: 'Otra pregunta frecuente', nextId: 'faq' };

const IR_A_CONTACTO: AuraAction = {
  label: 'Solicitar diagnóstico gratuito',
  path: '/contacto',
  motivo: 'diagnostico',
};
const IR_A_FAQ: AuraAction = { label: 'Ver todas las preguntas frecuentes', path: '/faq' };

/**
 * Las cinco prácticas, con la ruta real de cada una. El texto es el punto de
 * entrada de service-catalog.md, no una descripción nueva.
 */
const PRACTICAS: readonly { id: string; label: string; path: string; resumen: string }[] = [
  {
    id: 'p-agentic',
    label: 'Automatizar un flujo de RR. HH. con agentes',
    path: '/servicios/agentic-ai-rrhh',
    resumen:
      'Agentic AI. Diseñamos agentes que planifican y ejecutan flujos completos (cribado, reporting, soporte interno) dentro de límites de autonomía documentados, con un punto de control humano en cada decisión que afecta a una persona.',
  },
  {
    id: 'p-analytics',
    label: 'Entender rotación, cultura o compromiso',
    path: '/servicios/people-analytics',
    resumen:
      'People Analytics. Convertimos datos de plantilla en una decisión, con la fuente, la muestra y el método siempre a la vista. Si ya usas una plataforma, actuamos como capa de validación de metodología y gobernanza.',
  },
  {
    id: 'p-comp',
    label: 'Equidad retributiva o bandas salariales',
    path: '/servicios/compensacion-total-rewards',
    resumen:
      'Compensación y Total Rewards. Auditoría de equidad retributiva, benchmarking de mercado y diseño de Total Rewards, con la distinción entre brecha bruta y ajustada explicada.',
  },
  {
    id: 'p-gov',
    label: 'Cumplir el Reglamento Europeo de IA',
    path: '/servicios/gobernanza-ia',
    resumen:
      'Gobernanza de IA. Clasificamos el riesgo, diseñamos la supervisión humana y documentamos cada decisión, antes de que lo pida un regulador, un comité de empresa o tu propio departamento legal.',
  },
  {
    id: 'p-wi',
    label: 'Planificar plantilla, skills o una reorganización',
    path: '/servicios/workforce-intelligence',
    resumen:
      'Workforce Intelligence. Modelamos las decisiones de plantilla (headcount, skills, estructura) bajo al menos dos futuros distintos, con los supuestos de cada uno declarados.',
  },
  {
    id: 'p-nose',
    label: 'Todavía no lo tengo claro',
    path: '/servicios',
    resumen:
      'Sin problema. Las cinco prácticas funcionan como un solo sistema, y el punto de entrada habitual es un diagnóstico gratuito de unos 30 minutos: revisamos tu caso concreto y te decimos si hay encaje, incluida la respuesta honesta de que no lo hay.',
  },
];

/** Índices de SITE_FAQ_ITEMS que Aura ofrece, en el orden en que los ofrece. */
const FAQ_OFRECIDAS: readonly { indice: number; etiqueta: string }[] = [
  { indice: 3, etiqueta: '¿La IA decide sola o hay supervisión humana?' },
  { indice: 4, etiqueta: '¿Dónde se alojan los datos? ¿RGPD y AI Act?' },
  { indice: 5, etiqueta: '¿Cómo evitáis el sesgo en selección?' },
  { indice: 1, etiqueta: '¿Sois software o consultoría?' },
  { indice: 2, etiqueta: '¿Quién lleva mi proyecto?' },
  { indice: 7, etiqueta: '¿Os integráis con nuestro ATS o HRIS?' },
  { indice: 9, etiqueta: '¿Imponéis permanencia?' },
];

export const AURA_FLOW: readonly AuraStep[] = [
  {
    id: 'inicio',
    // La declaración de qué es Aura vive aquí, en el saludo, y no en un bloque
    // fijo. El bloque ocupaba un tercio del panel en móvil para repetir algo
    // que este mensaje ya dice. Lo que sí se recupera de él es la frase de
    // privacidad, que no estaba en ningún otro sitio.
    says: [
      'Hola. Soy Aura, el asistente guiado de Datalent Solutions.',
      'No soy un agente ni entiendo texto libre: te ofrezco opciones, respondo con lo que ya está publicado aquí y no envío nada fuera de tu navegador. ¿Por dónde empezamos?',
    ],
    options: [
      { label: 'Tengo un problema concreto', nextId: 'practicas' },
      { label: 'Quiero resolver una duda', nextId: 'faq' },
      { label: 'Prefiero hablar con una persona', nextId: 'persona' },
    ],
  },
  {
    id: 'practicas',
    says: ['¿Qué se parece más a lo que tienes entre manos?'],
    options: PRACTICAS.map((p) => ({ label: p.label, nextId: p.id })),
  },
  ...PRACTICAS.map(
    (p): AuraStep => ({
      id: p.id,
      says: [p.resumen],
      options: [{ label: 'Ver otra práctica', nextId: 'practicas' }, VOLVER],
      actions: [{ label: 'Abrir esta página', path: p.path }, IR_A_CONTACTO],
    }),
  ),
  {
    id: 'faq',
    says: ['Estas son las dudas que más nos llegan. Las respuestas son las mismas que hay en la página de preguntas frecuentes.'],
    options: [
      ...FAQ_OFRECIDAS.map((f) => ({ label: f.etiqueta, nextId: `faq-${f.indice}` })),
      VOLVER,
    ],
  },
  ...FAQ_OFRECIDAS.map((f) =>
    desdeFaq(`faq-${f.indice}`, f.indice, [MAS_PREGUNTAS, VOLVER], [IR_A_FAQ, IR_A_CONTACTO]),
  ),
  {
    id: 'persona',
    says: [
      'Lo mejor que puedo hacer por ti es apartarme.',
      'Recibes respuesta directa de quien llevaría el proyecto, en menos de 24 horas hábiles. No es una reserva de calendario automática.',
    ],
    options: [VOLVER],
    actions: [
      IR_A_CONTACTO,
      { label: 'Reservar briefing ejecutivo', path: '/contacto', motivo: 'briefing' },
    ],
  },
];

export const AURA_INICIO = 'inicio';
