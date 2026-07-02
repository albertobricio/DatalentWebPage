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
    label: 'Servicios',
    children: [
      { label: 'Agentic AI para RR. HH.' },
      { label: 'People Analytics' },
      { label: 'Compensación y Total Rewards' },
      { label: 'Gobernanza de IA', path: '/servicios/gobernanza-ia' },
      { label: 'Workforce Intelligence' },
    ],
  },
  { label: 'Por qué Datalent' },
  {
    label: 'Recursos',
    children: [
      { label: 'Insights (Radar Agéntico)', path: '/newsletter' },
      { label: 'Preguntas frecuentes', path: '/faq' },
    ],
  },
  { label: 'Contacto', path: '/contacto' },
] as const;
