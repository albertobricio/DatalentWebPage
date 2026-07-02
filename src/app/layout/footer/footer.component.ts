import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  readonly label: string;
  readonly path?: string;
  readonly href?: string;
}

/**
 * Lists all six practices as five entries — Compensation & Benefits and
 * Total Rewards are one combined page per page-specs.md §5 (Total Rewards
 * nests inside the Comp & Benefits relationship rather than standing
 * alone), matching nav-items.ts's own single "Compensación y Total
 * Rewards" entry. See site-map.md's Footer Navigation. Entries with no
 * `path` are documented, not yet built, and rendered inactive rather than
 * linked.
 */
const PRACTICES: readonly FooterLink[] = [
  { label: 'Agentic AI', path: '/servicios/agentic-ai-rrhh' },
  { label: 'People Analytics' },
  { label: 'Compensación y Total Rewards', path: '/servicios/compensacion-total-rewards' },
  { label: 'Gobernanza de IA', path: '/servicios/gobernanza-ia' },
  { label: 'Workforce Intelligence' },
];

const COMPANY_LINKS: readonly FooterLink[] = [
  { label: 'Contacto', path: '/contacto' },
  { label: 'Insights (Radar Agéntico)', path: '/newsletter' },
  { label: 'Preguntas frecuentes', path: '/faq' },
  { label: 'Por qué Datalent' },
];

const LEGAL_LINKS: readonly FooterLink[] = [
  { label: 'Política de privacidad', href: 'assets/data-privacy.pdf' },
  { label: 'Política de cookies', href: 'assets/cookie-policy.pdf' },
];

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly practices = PRACTICES;
  protected readonly companyLinks = COMPANY_LINKS;
  protected readonly legalLinks = LEGAL_LINKS;
  protected readonly currentYear = new Date().getFullYear();
}
