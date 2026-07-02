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
import { CtaComponent } from '../../../shared/components/cta/cta.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import { BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';

/**
 * The single most important page for positioning.md's category-creation
 * goal (page-specs.md §3) — the page a search for "agentic AI RRHH" should
 * land on, and the page where the agentic-vs-automation test has to hold
 * up under scrutiny from a technically-skeptical evaluator (Tier 3 /
 * ideal-client-profiles.md). Every autonomy claim on this page pairs with
 * its governance boundary in the same breath, per
 * .claude/intelligence/reasoning-patterns.md Pattern 5.
 */
@Component({
  selector: 'app-agentic-ai',
  standalone: true,
  imports: [
    RouterLink,
    HeroComponent,
    TimelineComponent,
    CardComponent,
    BadgeComponent,
    CtaComponent,
    SectionComponent,
  ],
  templateUrl: './agentic-ai.component.html',
  styleUrl: './agentic-ai.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenticAiComponent implements OnDestroy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  private structuredDataScript: HTMLScriptElement | null = null;

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Servicios' },
    { label: 'Agentic AI' },
  ];

  // service-catalog.md §1's Entry Point → Design & Deployment → Retained
  // structure, in the exact anatomy agent-spec-template.md requires for
  // the middle step (goal, autonomy boundary, escalation triggers, human
  // checkpoint, governance status).
  protected readonly steps: TimelineStep[] = [
    {
      label: 'Entrada: Agentic Workflow Feasibility Review',
      description:
        'Aplicamos el test agéntico-vs-automatización a un proceso concreto de RR. HH. — cribado, reporting, soporte interno — y entregamos una recomendación de seguir o no antes de construir nada.',
    },
    {
      label: 'Diseño y despliegue: especificación completa del agente',
      description:
        'Objetivo, límite de autonomía, triggers de escalado concretos, punto de control humano y estado de gobernanza — documentados antes del despliegue, no reconstruidos después si algo falla.',
    },
    {
      label: 'Retenido: Governed Agent Retainer',
      description:
        'Monitorización continua de la tasa de escalado, la tasa de anulación humana y la deriva del agente respecto a su límite de autonomía original.',
    },
  ];

  constructor() {
    this.title.setTitle(
      'Agentic AI para RR. HH. | Agentes de IA gobernados, no automatización disfrazada | Datalent Solutions',
    );
    this.meta.updateTag({
      name: 'description',
      content:
        'Diseñamos agentes de IA que planifican y ejecutan flujos completos de RR. HH. dentro de límites de autonomía documentados, con un punto de control humano en cada decisión que afecta a una persona.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'agentic AI RRHH, IA agéntica recursos humanos, agentes de IA gobernados RRHH, automatización RRHH con supervisión humana',
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
      serviceType: 'Agentic AI para RR. HH.',
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
        'Diseño, especificación y gobernanza de agentes de IA para flujos de RR. HH., con límites de autonomía documentados y supervisión humana en cada decisión que afecta a una persona.',
    });
    this.renderer.appendChild(document.head, script);
    this.structuredDataScript = script;
  }
}
