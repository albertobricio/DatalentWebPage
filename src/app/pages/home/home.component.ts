import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { PillarProofBlockComponent } from '../../shared/components/pillar-proof-block/pillar-proof-block.component';
import { SectionComponent } from '../../shared/components/section/section.component';
import { ServicePillarsComponent } from '../../shared/components/service-pillars/service-pillars.component';
import { TrustCardComponent } from '../../shared/components/trust-card/trust-card.component';
import { CtaComponent } from '../../shared/components/cta/cta.component';
import { TimelineComponent, TimelineStep } from '../../shared/components/timeline/timeline.component';
import { SeoService } from '../../shared/seo.service';

/**
 * Website v2 Sprint 2 — Home. Section order and content sourcing follow
 * home-wireframe.md exactly: Hero → PillarProofBlock → ServicePillars (Flow, Match, Radar, Shield) →
 * How We Work → trust strip → closing dual-CTA banner. Replaces the pre-v2
 * Home (Tailwind hero, emoji problem-cards, four-service grid, testimonial
 * carousel, broken TrustIndex reviews widget) entirely — none of that
 * content maps to page-specs.md's Home entry or positioning.md.
 *
 * Organization JSON-LD lives once, globally, in index.html — not
 * duplicated here. It used to be two conflicting static blocks there
 * (docs/website-audit.md), fixed alongside this page's own build.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    PillarProofBlockComponent,
    SectionComponent,
    ServicePillarsComponent,
    TrustCardComponent,
    CtaComponent,
    TimelineComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly seo = inject(SeoService);

  // Las mismas tres fases (entrada → diseño y despliegue → relación
  // continua) que cada página de práctica detalla en su propio timeline.
  protected readonly steps: TimelineStep[] = [
    {
      label: 'Diagnóstico acotado',
      description:
        'Una conversación gratuita de unos 30 minutos sobre un caso concreto. Te decimos si hay encaje y por qué solución empezar, incluida la respuesta honesta de que no lo hay.',
    },
    {
      label: 'Diseño y despliegue',
      description:
        'Ningún agente entra en producción sin su clasificación de riesgo, sus límites de autonomía documentados y el punto de control humano definido.',
    },
    {
      label: 'Gobernanza continua',
      description:
        'Seguimos siendo responsables de lo que construimos: revisiones periódicas, re-validación de sesgo y ajustes cuando cambia el proceso o la norma.',
    },
  ];

  constructor() {
    // SEO goal per page-specs.md: rank for the category terms, explicitly
    // excluding job-seeker and competitor-brand terms (the prior meta
    // keywords included "eurofirms, adecco" — docs/business-analysis.md
    // flagged this as diluting the B2B positioning).
    this.seo.set({
      title: 'Datalent Solutions | Agentic AI para RR. HH. gobernada en Europa',
      description:
        'Diseñamos, desplegamos y gobernamos agentes de IA para RR. HH. con límites de autonomía documentados, supervisión humana y gobernanza de datos europea.',
      keywords:
        'agentic AI RRHH, IA agéntica recursos humanos, people analytics España, gobernanza de IA RRHH, EU AI Act recursos humanos',
      path: '/',
    });
  }
}
