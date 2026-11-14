import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { CookieConsentService } from '../../shared/cookie-consent.service';

interface FooterLink {
  readonly label: string;
  readonly path?: string;
  readonly fragment?: string;
  readonly href?: string;
}

/**
 * Columna "Soluciones": las cuatro soluciones, cada una enlazada a su tarjeta
 * en /servicios (mismo patrón que el menú, nav-items.ts). Las páginas de
 * práctica se enlazan desde esas tarjetas. La forma `path?` opcional y el
 * renderizado "Próximamente" se conservan para entradas aún no construidas.
 */
const PRACTICES: readonly FooterLink[] = [
  { label: 'Todas las soluciones', path: '/servicios' },
  { label: 'Datalent Flow', path: '/servicios', fragment: 'flow' },
  { label: 'Datalent Match', path: '/servicios', fragment: 'match' },
  { label: 'Datalent Radar', path: '/servicios', fragment: 'radar' },
  { label: 'Datalent Shield', path: '/servicios', fragment: 'shield' },
];

/**
 * Columna "Servicios": las cinco páginas de práctica. Son las que llevan el
 * schema Service y las que tienen que posicionar por término ("people
 * analytics", "gobernanza de IA"...), pero el menú y el pie solo enlazaban a
 * /servicios#ancla: desde cualquier página del sitio estaban a dos clics y
 * recibían enlaces internos únicamente desde las tarjetas de Home y del hub.
 * El pie se repite en todas las páginas, así que esta columna les da un
 * enlace directo desde cada una.
 */
const SERVICE_PAGES: readonly FooterLink[] = [
  { label: 'Agentic AI para RR. HH.', path: '/servicios/agentic-ai-rrhh' },
  { label: 'People Analytics', path: '/servicios/people-analytics' },
  { label: 'Compensación y Total Rewards', path: '/servicios/compensacion-total-rewards' },
  { label: 'Gobernanza de IA', path: '/servicios/gobernanza-ia' },
  { label: 'Workforce Intelligence', path: '/servicios/workforce-intelligence' },
];

const COMPANY_LINKS: readonly FooterLink[] = [
  { label: 'Por qué Datalent', path: '/por-que-datalent' },
  { label: 'Confianza y cumplimiento', path: '/confianza' },
  { label: 'Preguntas frecuentes', path: '/faq' },
  { label: 'Contacto', path: '/contacto' },
];

const LEGAL_LINKS: readonly FooterLink[] = [
  { label: 'Política de privacidad', href: 'assets/data-privacy.pdf' },
  { label: 'Política de cookies', href: 'assets/cookie-policy.pdf' },
];

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly practices = PRACTICES;
  protected readonly servicePages = SERVICE_PAGES;
  protected readonly companyLinks = COMPANY_LINKS;
  protected readonly legalLinks = LEGAL_LINKS;
  protected readonly currentYear = new Date().getFullYear();

  private readonly consent = inject(CookieConsentService);

  /** Reabre el aviso de cookies para cambiar la decisión (RGPD, art. 7.3). */
  protected openCookieSettings(): void {
    this.consent.reopen();
  }
}
