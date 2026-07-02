import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { HeroComponent } from '../../../shared/components/hero/hero.component';
import { TimelineComponent, TimelineStep } from '../../../shared/components/timeline/timeline.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { FeatureCardComponent } from '../../../shared/components/feature-card/feature-card.component';
import { CtaComponent } from '../../../shared/components/cta/cta.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import { BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import {
  FaqAccordionComponent,
  FaqItem,
} from '../../../shared/components/faq-accordion/faq-accordion.component';

/**
 * The direct fix for docs/business-audit-v2.md's original finding: the
 * Compensation Director persona had zero content on the live site. Covers
 * both service-catalog.md §3 (Comp & Benefits) and §4 (Total Rewards) as
 * one page, per page-specs.md §5's own note that Total Rewards nests
 * inside the Comp & Benefits relationship rather than standing alone.
 * Anchored on the EU Pay Transparency Directive as a live compliance
 * driver, not a future consideration — its transposition deadline
 * (7 June 2026) has already passed as of this build.
 */
@Component({
  selector: 'app-compensation-total-rewards',
  standalone: true,
  imports: [
    RouterLink,
    HeroComponent,
    TimelineComponent,
    CardComponent,
    BadgeComponent,
    FeatureCardComponent,
    CtaComponent,
    SectionComponent,
    FaqAccordionComponent,
  ],
  templateUrl: './compensation-total-rewards.component.html',
  styleUrl: './compensation-total-rewards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompensationTotalRewardsComponent implements OnDestroy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  private structuredDataScript: HTMLScriptElement | null = null;

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Servicios' },
    { label: 'Compensación & Total Rewards' },
  ];

  // service-catalog.md §3+4's combined Entry Point → Design & Deployment →
  // Retained structure. Total Rewards has no standalone retained stream —
  // it nests inside this same retainer, per §4's own note.
  protected readonly steps: TimelineStep[] = [
    {
      label: 'Entrada: auditoría de equidad retributiva o benchmarking de mercado',
      description:
        'Una auditoría de equidad retributiva o un benchmark de mercado para un conjunto de roles definido, siguiendo la metodología de brecha bruta frente a ajustada.',
    },
    {
      label: 'Diseño y despliegue: arquitectura de puestos y Total Rewards',
      description:
        'Diseño completo de estructura salarial y arquitectura de puestos, diseño de programa de beneficios y, cuando corresponde, un marco de Total Rewards integrado con su correspondiente comunicación al empleado.',
    },
    {
      label: 'Retenido: re-benchmarking y monitorización de cumplimiento',
      description:
        'Re-benchmarking periódico a medida que los datos de mercado envejecen, y monitorización continua del cumplimiento de la Directiva de Transparencia Retributiva conforme evoluciona la normativa en cada jurisdicción.',
    },
  ];

  protected readonly faqItems: readonly FaqItem[] = [
    {
      question: '¿Publicáis cifras de brecha salarial en vuestra web?',
      answer:
        '<p>No, nunca. Cualquier cifra de brecha salarial es información específica de cada organización, obtenida y verificada dentro de un engagement concreto — nunca un dato genérico de marketing publicado para parecer creíbles.</p>',
    },
    {
      question: '¿Qué diferencia hay entre la brecha salarial bruta y la ajustada?',
      answer:
        '<p>La bruta compara la retribución media sin controlar factores como puesto, nivel o ubicación; la ajustada sí los controla, para aislar la diferencia que no se explica por ninguno de ellos. Reportar solo una de las dos, sin la otra, es engañoso en cualquier dirección.</p>',
    },
    {
      question: '¿Ofrecéis servicios de equidad retributiva o benchmarking salarial?',
      answer:
        '<p>Sí. Es el punto de entrada de esta práctica: una auditoría de equidad retributiva o un benchmark de mercado para un conjunto de roles definido, siguiendo la metodología de brecha bruta frente a ajustada descrita en esta página.</p>',
    },
  ];

  constructor() {
    this.title.setTitle(
      'Compensación & Total Rewards | Auditoría de equidad retributiva y cumplimiento UE | Datalent Solutions',
    );
    this.meta.updateTag({
      name: 'description',
      content:
        'Auditoría de equidad retributiva, benchmarking salarial y diseño de Total Rewards, con la Directiva Europea de Transparencia Retributiva como marco de cumplimiento vigente.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'auditoría de brecha salarial España, cumplimiento directiva transparencia retributiva UE, benchmarking salarial RRHH, total rewards RRHH',
    });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    if (isPlatformBrowser(this.platformId)) {
      this.injectStructuredData();
    }
  }

  ngOnDestroy(): void {
    if (this.structuredDataScript) {
      this.renderer.removeChild(document.head, this.structuredDataScript);
    }
  }

  private injectStructuredData(): void {
    const script = this.renderer.createElement('script') as HTMLScriptElement;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Compensación & Total Rewards',
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
        'Auditoría de equidad retributiva, benchmarking de mercado y diseño de Total Rewards, alineado con la Directiva Europea de Transparencia Retributiva (UE) 2023/970.',
    });
    this.renderer.appendChild(document.head, script);
    this.structuredDataScript = script;
  }
}
