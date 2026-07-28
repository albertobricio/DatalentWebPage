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
 * Wave 2 per site-map.md, brought forward into Wave 1 implementation by
 * explicit instruction this sprint. Follows the exact architectural
 * pattern established by Agentic AI, AI Governance, and Compensation &
 * Total Rewards — no new visual patterns, only shared components.
 *
 * Core message this page has to land: Workforce Intelligence is
 * forward-looking scenario planning and skills intelligence, not a
 * reporting dashboard — that distinction is People Analytics' territory
 * (backward/current-state), not this one's.
 */
@Component({
  selector: 'app-workforce-intelligence',
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
  templateUrl: './workforce-intelligence.component.html',
  styleUrl: './workforce-intelligence.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkforceIntelligenceComponent {
  private readonly seo = inject(SeoService);

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Servicios' },
    { label: 'Workforce Intelligence' },
  ];

  // service-catalog.md §6's Entry Point → Design & Deployment → Retained
  // structure.
  protected readonly steps: TimelineStep[] = [
    {
      label: 'Entrada: sesión de planificación de escenarios',
      description:
        'Una sesión de planificación de escenarios para una decisión concreta, como un plan de plantilla o una decisión de construir, contratar, subcontratar o automatizar. Siempre con al menos dos escenarios.',
    },
    {
      label: 'Diseño y despliegue: plan estratégico de plantilla',
      description:
        'Un plan estratégico de plantilla completo, atado al presupuesto real y a las decisiones de diseño organizativo del cliente, lejos del ejercicio académico desconectado del plan de negocio.',
    },
    {
      label: 'Retenido: actualización periódica de escenarios',
      description:
        'Revisión de los escenarios a medida que cambian las condiciones de mercado o los planes internos, alineada con el ciclo de planificación presupuestaria del cliente, no como ejercicio anual aislado.',
    },
  ];

  protected readonly faqItems: readonly FaqItem[] = [
    {
      question: '¿Esto es un dashboard de RR. HH.?',
      answer:
        '<p>No. Un dashboard describe lo que ya ha pasado. Workforce Intelligence es planificación hacia delante: escenarios, simulación de decisiones de plantilla y análisis de brechas de capacidades, con supuestos explícitos. El análisis del estado actual (rotación, compromiso, desempeño) es People Analytics; esta práctica empieza donde esa termina.</p>',
    },
    {
      question:
        '¿Cómo elegís entre construir, contratar, subcontratar o automatizar una capacidad?',
      answer:
        '<p>Aplicamos el marco Build-Buy-Borrow-Bot-Bridge: si la capacidad es desarrollable internamente en el tiempo disponible, se construye; si es escasa en el mercado y crítica a largo plazo, se contrata; si la necesidad es temporal o muy especializada, se subcontrata; si la tarea es candidata real a automatización agéntica, se evalúa como Bot, coordinado con gobernanza de IA antes de descartar a una persona; y si una capacidad deja de ser necesaria, se gestiona la transición de forma ordenada (Bridge).</p>',
    },
    {
      question: '¿Cómo gobernáis un sistema de forecasting o scenario-planning asistido por IA?',
      answer:
        '<p>Con el mismo estándar que cualquier otro sistema de IA que diseñamos: límite de autonomía documentado, punto de control humano antes de que un escenario se convierta en decisión, y clasificación de riesgo cuando el resultado influye en decisiones de plantilla con impacto en personas. El tratamiento completo de esa gobernanza vive en la página de Gobernanza de IA.</p>',
    },
    {
      question: '¿Con qué frecuencia se actualiza un plan de escenarios?',
      answer:
        '<p>Depende del horizonte: la planificación operativa (0–12 meses) se revisa con más frecuencia que la planificación estratégica a 3 o más años. En ambos casos, la revisión está atada al ciclo de planificación presupuestaria del cliente, no a un calendario fijo desconectado del negocio.</p>',
    },
  ];

  constructor() {
    this.seo.set({
      title:
        'Workforce Intelligence | Planificación de escenarios y skills intelligence | Datalent Solutions',
      description:
        'Planificación estratégica de plantilla basada en escenarios, no en dashboards: Build-Buy-Borrow-Bot-Bridge, análisis de skills y planificación por horizontes, con al menos dos escenarios en cada decisión.',
      keywords:
        'workforce intelligence RRHH, planificación de plantilla, workforce planning España, análisis de skills, Build Buy Borrow Bot',
      path: '/servicios/workforce-intelligence',
      ogTitle: 'Workforce Intelligence | Datalent Solutions',
      ogDescription:
        'Planificación estratégica de plantilla basada en escenarios: Build-Buy-Borrow-Bot-Bridge, análisis de skills y planificación por horizontes.',
      jsonLd:{
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Workforce Intelligence',
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
          'Planificación estratégica de plantilla basada en escenarios: modelado de decisiones de headcount y skills, marco Build-Buy-Borrow-Bot-Bridge, y planificación por horizontes.',
      },
    });
  }
}
