import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../../../shared/components/hero/hero.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { FeatureCardComponent } from '../../../shared/components/feature-card/feature-card.component';
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
    FeatureCardComponent,
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
    { label: 'Servicios' },
  ];

  constructor() {
    this.seo.set({
      title: 'Servicios | Seis prácticas, un solo sistema | Datalent Solutions',
      description:
        'Agentic AI, People Analytics, Compensación & Total Rewards, Gobernanza de IA y Workforce Intelligence. Consultoría advisory-led y technology-enabled, no una plataforma que configuras en solitario.',
      keywords:
        'servicios de RRHH con IA, consultoría people analytics y gobernanza IA, consultoría agentic AI RRHH España',
      path: '/servicios',
      ogTitle: 'Servicios | Datalent Solutions',
      ogDescription:
        'Seis prácticas que funcionan como un solo sistema: agentic AI, people analytics, compensación, gobernanza de IA y workforce intelligence.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Servicios | Datalent Solutions',
        description:
          'Catálogo de las prácticas de Datalent Solutions para la función de RR. HH., con su punto de entrada acotado en cada una.',
        about: {
          '@type': 'Organization',
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
