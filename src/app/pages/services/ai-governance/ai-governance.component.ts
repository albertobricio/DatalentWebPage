import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../../../shared/components/hero/hero.component';
import { TimelineComponent, TimelineStep } from '../../../shared/components/timeline/timeline.component';
import { TrustCardComponent } from '../../../shared/components/trust-card/trust-card.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { FeatureCardComponent } from '../../../shared/components/feature-card/feature-card.component';
import { CtaComponent } from '../../../shared/components/cta/cta.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import { BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { SeoService } from '../../../shared/seo.service';

/**
 * The first Wave 1 service page. Follows page-specs.md's AI Governance
 * entry exactly: the deepest structural home of Pillars 1 (Governed
 * Autonomy) and 2 (European by Design), written to survive being forwarded
 * internally to Legal — the highest reputational stakes of any Sprint 1
 * page, per that spec's own Expected Conversion Role note.
 */
@Component({
  selector: 'app-ai-governance',
  standalone: true,
  imports: [
    RouterLink,
    HeroComponent,
    TimelineComponent,
    TrustCardComponent,
    CardComponent,
    BadgeComponent,
    FeatureCardComponent,
    CtaComponent,
    SectionComponent,
  ],
  templateUrl: './ai-governance.component.html',
  styleUrl: './ai-governance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiGovernanceComponent {
  private readonly seo = inject(SeoService);

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Servicios' },
    { label: 'Gobernanza de IA' },
  ];

  // service-catalog.md §5's own Entry Point → Design & Deployment →
  // Retained structure, verbatim in substance.
  protected readonly steps: TimelineStep[] = [
    {
      label: 'Entrada: clasificación de riesgo',
      description:
        'Clasificación de riesgo bajo el Reglamento Europeo de IA para un sistema concreto, propio o de un proveedor externo. El punto de partida más rápido y mejor definido de todo el catálogo.',
    },
    {
      label: 'Diseño y despliegue',
      description:
        'Diseño completo del marco de gobernanza para uno o varios sistemas de IA: metodología de auditoría de sesgo, diseño de supervisión humana y documentación de residencia de datos.',
    },
    {
      label: 'Retenido: monitorización continua',
      description:
        'La mitad de cumplimiento del Governed Agent Retainer: monitorización continua de la conformidad a medida que cambian la normativa, la guía regulatoria o el propio sistema.',
    },
  ];

  constructor() {
    this.seo.set({
      title:
        'Gobernanza de IA para RR. HH. | Clasificación de riesgo EU AI Act | Datalent Solutions',
      description:
        'Clasificación de riesgo, diseño de supervisión humana y auditoría de sesgo para IA en RR. HH., alineado con el Reglamento Europeo de IA (UE) 2024/1689 y el RGPD.',
      keywords:
        'clasificación de riesgo IA Reglamento Europeo, cumplimiento EU AI Act RRHH, auditoría de sesgo IA selección de personal',
      path: '/servicios/gobernanza-ia',
      ogTitle: 'Gobernanza de IA para RR. HH. | Datalent Solutions',
      ogDescription:
        'Clasificación de riesgo, supervisión humana y auditoría de sesgo para IA en RR. HH., alineado con el Reglamento Europeo de IA y el RGPD.',
      jsonLd:{
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Gobernanza de IA para RR. HH.',
        provider: {
          '@type': 'Organization',
          name: 'Datalent Solutions',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Tarancón',
            addressRegion: 'Cuenca',
            addressCountry: 'ES',
          },
        },
        areaServed: 'ES',
        description:
          'Clasificación de riesgo, diseño de supervisión humana y auditoría de sesgo para sistemas de IA usados en procesos de RR. HH., alineado con el Reglamento Europeo de IA y el RGPD.',
      },
    });
  }
}
