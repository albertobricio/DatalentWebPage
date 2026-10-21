import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../../../shared/components/hero/hero.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ServicePillarsComponent } from '../../../shared/components/service-pillars/service-pillars.component';
import { CtaComponent } from '../../../shared/components/cta/cta.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import { BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { SeoService } from '../../../shared/seo.service';

/**
 * Wave 1 per page-specs.md §2 — the structural home of positioning.md
 * Pillar 4 ("integrated, not six disconnected point solutions").
 *
 * Two spec requirements drive the content: each card's description must
 * match service-catalog.md's Entry Point language (no drift between what
 * this hub promises and what the dedicated page delivers), and the
 * advisory-led / technology-enabled framing must appear explicitly,
 * because this is the page that answers the HR Technology Analyst
 * persona's disqualifying question from docs/business-audit-v2.md:
 * "is this software or a service?"
 */
@Component({
  selector: 'app-services-hub',
  standalone: true,
  imports: [
    RouterLink,
    HeroComponent,
    CardComponent,
    BadgeComponent,
    ServicePillarsComponent,
    CtaComponent,
    SectionComponent,
  ],
  templateUrl: './services-hub.component.html',
  styleUrl: './services-hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesHubComponent {
  private readonly seo = inject(SeoService);

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Soluciones' },
  ];

  constructor() {
    this.seo.set({
      title: 'Servicios de IA y analítica para RR. HH. | Datalent Solutions',
      description:
        'Agentic AI, People Analytics, Compensación, Gobernanza de IA y Workforce Intelligence: consultoría para RR. HH., no una plataforma autoconfigurable.',
      keywords:
        'servicios de RRHH con IA, consultoría people analytics y gobernanza IA, consultoría agentic AI RRHH España',
      path: '/servicios',
      ogTitle: 'Servicios | Datalent Solutions',
      ogDescription:
        'Cuatro soluciones que funcionan como un solo sistema: Datalent Flow, Match, Radar y Shield.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Servicios | Datalent Solutions',
        description:
          'Catálogo de las prácticas de Datalent Solutions para la función de RR. HH., con su punto de entrada acotado en cada una.',
        about: {
          '@type': 'Organization',
          '@id': 'https://datalentsolutions.com/#organization',
          name: 'Datalent Solutions',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Tarancón',
            addressRegion: 'Cuenca',
            addressCountry: 'ES',
          },
        },
      },
    });
  }
}
