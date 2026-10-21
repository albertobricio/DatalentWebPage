import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';

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

const COMPANY_LINKS: readonly FooterLink[] = [
  { label: 'Contacto', path: '/contacto' },
  { label: 'Preguntas frecuentes', path: '/faq' },
  { label: 'Por qué Datalent', path: '/por-que-datalent' },
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
  protected readonly companyLinks = COMPANY_LINKS;
  protected readonly legalLinks = LEGAL_LINKS;
  protected readonly currentYear = new Date().getFullYear();
}
