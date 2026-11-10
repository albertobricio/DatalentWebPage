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
    //
    // Nov. 2026: el título decía "Datalent Solutions | Agentic AI para RR. HH.
    // gobernada en Europa". Tres problemas: (1) la marca iba delante, en la
    // posición con más peso del título; (2) "agentic AI
    // RRHH" era también el término de /servicios/agentic-ai-rrhh, así que dos
    // páginas competían por la misma consulta; (3) "RR. HH." con puntos y
    // espacio no coincide con lo que la gente escribe. La portada va ahora al
    // término amplio en castellano y la página de servicio conserva el
    // específico. Debe coincidir con el <title> estático de src/index.html.
    this.seo.set({
      title: 'IA para recursos humanos, gobernada en Europa | Datalent',
      description:
        'Agentes de IA para selección, trámites laborales y seguimiento de plantilla, con supervisión humana. RGPD y Reglamento Europeo de IA. Diagnóstico gratuito.',
      keywords:
        'IA para recursos humanos, inteligencia artificial RRHH, agentes de IA RRHH, gobernanza de IA RRHH, Reglamento Europeo de IA recursos humanos, people analytics España',
      path: '/',
    });
  }
}
