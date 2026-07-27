/**
 * Single source of truth for the site navigation tree, shared by
 * HeaderComponent (desktop dropdown + CTA bar) and MobileMenuComponent (the
 * expanded panel) so the two never drift into two different nav structures.
 *
 * See projects/datalent-v2/site-map.md's "Navigation Structure". An item
 * with no `path` is a documented Wave 1/Wave 2 page that isn't built yet —
 * shown so the information architecture doesn't need re-work later, but
 * never rendered as a clickable link, per site-map.md's explicit rule
 * against dead/unfinished-looking nav links (docs/website-audit.md's
 * "chatbot button that does nothing" finding).
 */
export interface NavChild {
  readonly label: string;
  readonly path?: string;
}

export interface NavItem {
  readonly label: string;
  readonly path?: string;
  readonly children?: readonly NavChild[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Inicio', path: '/' },
  {
    // Deliberately no `path` on the parent: HeaderComponent checks
    // `item.children` before `item.path`, so a parent carrying both would
    // render as a dropdown trigger and silently swallow the link, leaving
    // the hub unreachable from the header. Exposing it as the first child
    // is the conventional fix and needs no change to the dropdown's
    // keyboard/aria behaviour.
    label: 'Servicios',
    children: [
      { label: 'Ver todos los servicios', path: '/servicios' },
      { label: 'Agentic AI para RR. HH.', path: '/servicios/agentic-ai-rrhh' },
      { label: 'People Analytics', path: '/servicios/people-analytics' },
      { label: 'Compensación y Total Rewards', path: '/servicios/compensacion-total-rewards' },
      { label: 'Gobernanza de IA', path: '/servicios/gobernanza-ia' },
      { label: 'Workforce Intelligence', path: '/servicios/workforce-intelligence' },
    ],
  },
  { label: 'Por qué Datalent', path: '/por-que-datalent' },
  {
    label: 'Recursos',
    children: [
      { label: 'Insights (Radar Agéntico)', path: '/newsletter' },
      { label: 'Preguntas frecuentes', path: '/faq' },
    ],
  },
  { label: 'Contacto', path: '/contacto' },
] as const;
