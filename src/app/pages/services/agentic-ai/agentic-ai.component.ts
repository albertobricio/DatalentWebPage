import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../../../shared/components/hero/hero.component';
import { TimelineComponent, TimelineStep } from '../../../shared/components/timeline/timeline.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { CtaComponent } from '../../../shared/components/cta/cta.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import { BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import {
  FaqAccordionComponent,
  FaqItem,
} from '../../../shared/components/faq-accordion/faq-accordion.component';
import { SeoService } from '../../../shared/seo.service';

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
    FaqAccordionComponent,
  ],
  templateUrl: './agentic-ai.component.html',
  styleUrl: './agentic-ai.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenticAiComponent {
  private readonly seo = inject(SeoService);

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

  protected readonly faqItems: readonly FaqItem[] = [
    {
      question:
        '¿Vuestra IA toma decisiones de forma autónoma o siempre hay supervisión humana?',
      answer:
        '<p>Nuestros agentes de IA operan dentro de límites de autonomía que definimos junto a cada cliente. Ejecutan tareas completas — cribado, análisis, reporting — pero cada decisión con impacto en una persona pasa por un punto de revisión humana antes de ser definitiva. No automatizamos decisiones; automatizamos trabajo, y dejamos las decisiones donde deben estar.</p>',
    },
    {
      question: '¿Dónde se alojan y procesan los datos de un agente desplegado?',
      answer:
        '<p>Depende del engagement concreto: confirmamos y documentamos la jurisdicción de alojamiento real, la base legal del tratamiento y la clasificación de riesgo del agente antes del despliegue — nunca lo afirmamos en genérico, verificado caso por caso.</p>',
    },
    {
      question: '¿Qué pasa si el agente se equivoca?',
      answer:
        '<p>Cada agente que diseñamos registra la acción y el razonamiento que la originó, lo que permite reconstruir cualquier decisión después del hecho. El límite de autonomía y los triggers de escalado están pensados precisamente para que un error se detecte y se corrija en el punto de control humano, no después de que afecte a una persona.</p>',
    },
  ];

  constructor() {
    this.seo.set({
      title:
        'Agentic AI para RR. HH. | Agentes de IA gobernados, no automatización disfrazada | Datalent Solutions',
      description:
        'Diseñamos agentes de IA que planifican y ejecutan flujos completos de RR. HH. dentro de límites de autonomía documentados, con un punto de control humano en cada decisión que afecta a una persona.',
      keywords:
        'agentic AI RRHH, IA agéntica recursos humanos, agentes de IA gobernados RRHH, automatización RRHH con supervisión humana',
      path: '/servicios/agentic-ai-rrhh',
      ogTitle: 'Agentic AI para RR. HH. | Datalent Solutions',
      ogDescription:
        'Agentes de IA que ejecutan flujos completos de RR. HH. dentro de límites de autonomía documentados, con punto de control humano.',
      jsonLd:{
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
      },
    });
  }
}
