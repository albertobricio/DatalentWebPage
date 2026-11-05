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
  readonly motivo?: 'diagnostico';
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
const OTRA_DUDA: AuraOption = { label: 'Tengo otra duda', nextId: 'faq' };
const OTRO_PROBLEMA: AuraOption = { label: 'Ver otro problema', nextId: 'practicas' };
const PERSONA: AuraOption = { label: 'Hablar con una persona', nextId: 'persona' };

const IR_A_CONTACTO: AuraAction = {
  label: 'Pide tu diagnóstico gratuito (30 min)',
  path: '/contacto',
  motivo: 'diagnostico',
};
const IR_A_FAQ: AuraAction = { label: 'Ver todas las preguntas frecuentes', path: '/faq' };

/**
 * Los problemas que Aura sabe reconocer, contados como los cuenta una pyme y
 * cada uno llevado a la solución (Flow, Match, Radar, Shield) y a la página
 * real que lo explica. Las etiquetas siguen las del desplegable de /contacto
 * para que el visitante reconozca las mismas palabras en los dos sitios. Los
 * resúmenes no añaden nada que no digan ya las páginas de servicio.
 */
const PRACTICAS: readonly { id: string; label: string; path: string; resumen: readonly string[] }[] = [
  {
    id: 'p-flow',
    label: 'Papeleo y tareas repetitivas de personal',
    path: '/servicios/agentic-ai-rrhh',
    resumen: [
      'De eso se encarga Datalent Flow. Ponemos agentes de IA a hacer de principio a fin tareas como preparar informes o responder las dudas internas de la plantilla, siempre dentro de unos límites que dejamos por escrito.',
      'Cuando algo afecta a una persona, lo revisa alguien de tu equipo antes de que cuente.',
    ],
  },
  {
    id: 'p-match',
    label: 'Encontrar y contratar personal',
    path: '/servicios/agentic-ai-rrhh',
    resumen: [
      'De eso se encarga Datalent Match. Un agente revisa todas las candidaturas, preselecciona y prepara el primer contacto con los perfiles que encajan.',
      'Nunca rechaza a nadie ni hace una oferta por su cuenta: eso lo decide siempre una persona. Y antes de usarlo comprobamos que no discrimina.',
    ],
  },
  {
    id: 'p-analytics',
    label: 'Que no se me vaya la gente',
    path: '/servicios/people-analytics',
    resumen: [
      'Para eso está Datalent Radar. Usamos los datos que ya tienes de tu plantilla para ver qué está pasando y qué conviene hacer.',
      'Siempre te enseñamos de dónde sale cada conclusión y cómo la hemos calculado.',
    ],
  },
  {
    id: 'p-comp',
    label: 'Revisar sueldos o la igualdad salarial',
    path: '/servicios/compensacion-total-rewards',
    resumen: [
      'También es parte de Datalent Radar. Comprobamos si hay diferencias de sueldo que no se puedan justificar, comparamos tus salarios con el mercado y te ayudamos a ordenar todo lo que ofreces al equipo: sueldo, beneficios, formación y reconocimiento.',
    ],
  },
  {
    id: 'p-gov',
    label: 'Usar IA sin problemas legales',
    path: '/servicios/gobernanza-ia',
    resumen: [
      'De eso se encarga Datalent Shield. Si usas o vas a usar IA con tu personal, vemos qué te exige el Reglamento Europeo de IA, decidimos en qué puntos tiene que revisar una persona y lo dejamos documentado.',
      'Así lo tienes listo si te lo pide un inspector, tu comité de empresa o tu asesoría.',
    ],
  },
  {
    id: 'p-wi',
    label: 'Organizar la plantilla de cara al futuro',
    path: '/servicios/workforce-intelligence',
    resumen: [
      'Es la parte de Datalent Radar que mira hacia delante. Preparamos al menos dos escenarios para decidir cuánta gente vas a necesitar, con qué perfiles y cómo organizarla, y dejamos escritos los supuestos de cada uno.',
    ],
  },
  {
    id: 'p-nose',
    label: 'Todavía no lo tengo claro',
    path: '/servicios',
    resumen: [
      'Es lo más normal. Para eso está el diagnóstico gratuito de unos 30 minutos: vemos tu caso y te decimos con sinceridad si podemos ayudarte o si todavía no te compensa.',
    ],
  },
];

/** Índices de SITE_FAQ_ITEMS que Aura ofrece, en el orden en que los ofrece. */
//
// Las posiciones 10 y 11 son las preguntas añadidas para pymes. Van al final de
// SITE_FAQ_ITEMS para no desplazar los índices de las demás.
const FAQ_OFRECIDAS: readonly { indice: number; etiqueta: string }[] = [
  { indice: 11, etiqueta: '¿Trabajáis con empresas pequeñas?' },
  { indice: 10, etiqueta: '¿Cuánto cuesta?' },
  { indice: 8, etiqueta: '¿Cómo empiezo?' },
  { indice: 7, etiqueta: '¿Necesito algún programa especial?' },
  { indice: 3, etiqueta: '¿La IA decide sola?' },
  { indice: 4, etiqueta: '¿Qué pasa con mis datos?' },
  { indice: 5, etiqueta: '¿Cómo evitáis que la IA discrimine al contratar?' },
  { indice: 1, etiqueta: '¿Sois un programa o una consultoría?' },
  { indice: 2, etiqueta: '¿Quién lleva mi proyecto?' },
  { indice: 9, etiqueta: '¿Imponéis permanencia?' },
];

export const AURA_FLOW: readonly AuraStep[] = [
  {
    id: 'inicio',
    // La declaración de qué es Aura vive aquí, en el saludo, y no en un bloque
    // fijo. El bloque ocupaba un tercio del panel en móvil para repetir algo
    // que este mensaje ya dice. Primero la ayuda y después la transparencia:
    // que se sepa que es un sistema automático (art. 50 del Reglamento
    // Europeo de IA) y que no envía nada fuera del navegador.
    says: [
      'Hola, soy Aura. Te ayudo a encontrar lo que buscas en esta web.',
      'Soy un asistente automático y funciono con opciones, sin campo para escribir. No hay una persona al otro lado y no envío nada fuera de tu navegador.',
      '¿Qué te trae por aquí?',
    ],
    options: [
      { label: 'Quiero resolver un problema de personal', nextId: 'practicas' },
      { label: 'Tengo una duda', nextId: 'faq' },
      { label: 'Prefiero hablar con una persona', nextId: 'persona' },
    ],
  },
  {
    id: 'practicas',
    says: ['¿Cuál se parece más a lo que te pasa?'],
    options: [...PRACTICAS.map((p) => ({ label: p.label, nextId: p.id })), VOLVER],
  },
  ...PRACTICAS.map(
    (p): AuraStep => ({
      id: p.id,
      says: [...p.resumen, 'Si quieres, lo vemos juntos en un diagnóstico gratuito.'],
      options: [OTRO_PROBLEMA, PERSONA, VOLVER],
      actions: [IR_A_CONTACTO, { label: 'Leer más sobre esto', path: p.path }],
    }),
  ),
  {
    id: 'faq',
    says: [
      'Estas son las dudas que más nos llegan. Te contesto lo mismo que pone en nuestra página de preguntas frecuentes.',
    ],
    options: [
      ...FAQ_OFRECIDAS.map((f) => ({ label: f.etiqueta, nextId: `faq-${f.indice}` })),
      VOLVER,
    ],
  },
  ...FAQ_OFRECIDAS.map((f) =>
    desdeFaq(`faq-${f.indice}`, f.indice, [OTRA_DUDA, PERSONA, VOLVER], [IR_A_CONTACTO, IR_A_FAQ]),
  ),
  {
    id: 'persona',
    says: [
      'Muy bien. Escríbenos desde el formulario de contacto y te responderá directamente la persona que llevaría tu caso, en menos de 24 horas hábiles.',
    ],
    options: [VOLVER],
    actions: [IR_A_CONTACTO],
  },
];

/**
 * Lo que dice Aura si se pide un paso que no existe. Solo puede pasar por un
 * error al editar este archivo, pero en ese caso el visitante no debe ver un
 * panel mudo: se le ofrece salir por contacto o volver a empezar.
 */
export const AURA_PASO_PERDIDO: AuraStep = {
  id: 'perdido',
  says: [
    'Vaya, me he perdido. Puedes volver al inicio o escribirnos y te contesta una persona.',
  ],
  options: [VOLVER],
  actions: [IR_A_CONTACTO],
};

export const AURA_INICIO = 'inicio';
