import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  readonly label: string;
  readonly path?: string;
  readonly href?: string;
}

/**
 * Lists all six practices, not a curated subset — "the footer is where a
 * full, honest inventory of the offer belongs, consistent with
 * positioning.md Pillar 4's 'integrated, not six disconnected point
 * solutions' claim." See site-map.md's Footer Navigation. Only Gobernanza
 * de IA has a real route this sprint (Task 6); the rest are documented,
 * not yet built, and rendered inactive rather than linked.
 */
const PRACTICES: readonly FooterLink[] = [
  { label: 'Agentic AI' },
  { label: 'People Analytics' },
  { label: 'Compensación y Beneficios' },
  { label: 'Total Rewards' },
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
