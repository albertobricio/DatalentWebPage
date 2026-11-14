import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CtaComponent } from '../../shared/components/cta/cta.component';
import { SectionComponent } from '../../shared/components/section/section.component';
import { BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SeoService } from '../../shared/seo.service';

/**
 * Confianza y cumplimiento (nov. 2026).
 *
 * Para quién es: la persona de compras, legal o TI que revisa a un proveedor
 * antes de que su empresa firme nada. Hasta ahora tenía que reconstruir la
 * respuesta saltando entre el FAQ y cinco páginas de servicio. Las plataformas
 * grandes resuelven esto con un "trust center"; para una firma cuyo producto
 * es la gobernanza, no tenerlo era un hueco de posicionamiento.
 *
 * REGLA DE CONTENIDO. Esta página no afirma nada nuevo:
 *   · "En cada proyecto" y "Lo que recibes por escrito" repiten lo que ya
 *     dicen SITE_FAQ_ITEMS y las páginas de Gobernanza de IA, Agentic AI y
 *     People Analytics. Si alguna de esas cambia, esta tiene que cambiar.
 *   · "Esta web" solo recoge hechos comprobables en el código del sitio
 *     (CSP de index.html, fuentes autoalojadas, guion cerrado de Aura,
 *     EmailJS como único destino de connect-src). Ver docs/seguridad.md.
 *
 * Lo que deliberadamente NO dice: nada sobre cookies (el aviso se mantiene
 * por decisión de Gema y la política publicada está pendiente de revisión,
 * ver docs/seguridad.md), nada sobre dónde se aloja el sitio, y ninguna
 * certificación.
 *
 * PENDIENTE: revisión de Gema antes de publicar.
 */
@Component({
  selector: 'app-trust',
  standalone: true,
  imports: [RouterLink, HeroComponent, CardComponent, CtaComponent, SectionComponent],
  templateUrl: './trust.component.html',
  styleUrl: './trust.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustComponent {
  protected readonly contactEmail = environment.contactEmail;

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Confianza y cumplimiento' },
  ];

  constructor() {
    inject(SeoService).set({
      title: 'Confianza y cumplimiento: RGPD y Reglamento de IA | Datalent',
      description:
        'Cómo tratamos los datos en cada proyecto y en esta web: clasificación de riesgo, supervisión humana, auditoría de sesgo y ningún rastreador de terceros.',
      keywords:
        'cumplimiento RGPD IA recursos humanos, Reglamento Europeo de IA RRHH, supervisión humana IA, auditoría de sesgo selección',
      path: '/confianza',
      breadcrumbs: this.breadcrumbItems,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Confianza y cumplimiento | Datalent Solutions',
        description:
          'Reglas de gobernanza que Datalent Solutions aplica en cada proyecto de IA para RR. HH. y en su propia web.',
        about: { '@id': 'https://datalentsolutions.com/#organization' },
      },
    });
  }
}
