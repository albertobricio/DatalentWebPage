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
 * Wave 1 per page-specs.md §4. Primary CTA is "diagnostico", not
 * "briefing" — the one deliberate departure from Agentic AI / AI
 * Governance / Workforce Intelligence's default, per the page spec's own
 * note that this practice's entry point is the most naturally
 * Tier-1-accessible of the six. Differentiates from a pure dashboard/BI
 * product (Visier's terrain, competitive-differentiation.md) by showing
 * methodology, not just asserting it.
 */
@Component({
  selector: 'app-people-analytics',
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
  templateUrl: './people-analytics.component.html',
  styleUrl: './people-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleAnalyticsComponent {
  private readonly seo = inject(SeoService);

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Servicios' },
    { label: 'People Analytics' },
  ];

  // service-catalog.md §2's Entry Point → Design & Deployment → Retained
  // structure.
  protected readonly steps: TimelineStep[] = [
    {
      label: 'Entrada: diagnóstico acotado',
      description:
        'Medición de cultura/compromiso, análisis de rotación, o una revisión de sesgo y equidad de un proceso existente, entregado con metodología y linaje de datos a la vista.',
    },
    {
      label: 'Diseño y despliegue: analítica recurrente',
      description:
        'Dashboards y, cuando está justificado, un modelo predictivo validado contra una muestra de reserva real, con una fase explícita de auditoría de sesgo antes de que el resultado influya en una decisión real de contratación, promoción o despido.',
    },
    {
      label: 'Retenido: mantenimiento y re-validación',
      description:
        'Mantenimiento continuo de dashboards y modelos, y re-validación periódica. La analítica que no se mantiene se degrada en silencio, y esta fase existe para evitar exactamente eso.',
    },
  ];

  protected readonly faqItems: readonly FaqItem[] = [
    {
      question: '¿Qué diferencia hay entre HR Analytics y People Analytics?',
      answer:
        '<p>HR Analytics suele referirse a informes operativos sobre los propios procesos de RR. HH.: tiempo de cobertura de una vacante, coste por contratación, volumen de headcount. People Analytics es más amplio y trata los datos de plantilla como un activo estratégico conectado a resultados de negocio, con una cadena explícita de datos → insight → decisión → acción.</p>',
    },
    {
      question: '¿Cómo evitáis confundir correlación con causalidad?',
      answer:
        '<p>Usamos el lenguaje que corresponde al diseño del análisis: «asociado con», no «causa», salvo que el diseño lo soporte genuinamente, por ejemplo un experimento controlado. Cualquier hallazgo correlacional se presenta como tal, con el tamaño de muestra y las variables de confusión conocidas declaradas explícitamente.</p>',
    },
    {
      question: '¿Auditáis modelos que ya usamos en otra plataforma, como Visier?',
      answer:
        '<p>Sí. No competimos con la infraestructura de dashboards de una plataforma ya desplegada. Actuamos como la capa de validación de metodología y gobernanza sobre ella: ¿el modelo supera una auditoría de sesgo?, ¿qué variables lo alimentan y con qué peso?, ¿está clasificado por riesgo bajo el Reglamento Europeo de IA? Ahí está nuestro valor.</p>',
    },
    {
      question:
        '¿Cómo gobernáis un modelo predictivo que influye en decisiones de contratación o promoción?',
      answer:
        '<p>Con auditoría de sesgo obligatoria antes de cualquier uso operativo, documentación de qué variables alimentan el modelo y su peso, y un punto de control humano antes de que el resultado se convierta en decisión, conforme al Artículo 22 del RGPD y al Reglamento Europeo de IA. El tratamiento completo de esa clasificación de riesgo vive en la página de Gobernanza de IA.</p>',
    },
  ];

  constructor() {
    this.seo.set({
      title:
        'People Analytics | Diagnóstico de cultura y rotación con metodología a la vista | Datalent Solutions',
      description:
        'Diagnóstico de cultura organizacional y análisis de rotación basado en evidencia, con la metodología y el linaje de datos siempre a la vista.',
      keywords:
        'people analytics España, diagnóstico de cultura organizacional con datos, análisis de rotación basado en evidencia, auditoría de sesgo RRHH',
      path: '/servicios/people-analytics',
      ogTitle: 'People Analytics | Datalent Solutions',
      ogDescription:
        'Diagnóstico de cultura organizacional y análisis de rotación basado en evidencia, con la metodología y el linaje de datos mostrados.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'People Analytics',
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
          'Diagnóstico de cultura, compromiso y rotación basado en evidencia, con metodología y linaje de datos mostrados, y auditoría de sesgo para cualquier modelo predictivo antes de su uso operativo.',
      },
    });
  }
}
