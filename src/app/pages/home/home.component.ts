import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { PillarProofBlockComponent } from '../../shared/components/pillar-proof-block/pillar-proof-block.component';
import { SectionComponent } from '../../shared/components/section/section.component';
import { FeatureCardComponent } from '../../shared/components/feature-card/feature-card.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { TrustCardComponent } from '../../shared/components/trust-card/trust-card.component';
import { CtaComponent } from '../../shared/components/cta/cta.component';

/**
 * Website v2 Sprint 2 — Home. Section order and content sourcing follow
 * home-wireframe.md exactly: Hero → PillarProofBlock → service grid →
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
    FeatureCardComponent,
    CardComponent,
    BadgeComponent,
    TrustCardComponent,
    CtaComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  constructor() {
    // SEO goal per page-specs.md: rank for the category terms, explicitly
    // excluding job-seeker and competitor-brand terms (the prior meta
    // keywords included "eurofirms, adecco" — docs/business-analysis.md
    // flagged this as diluting the B2B positioning).
    this.title.setTitle(
      'Datalent Solutions | Agentic AI para RR. HH., diseñada y gobernada en Europa',
    );
    this.meta.updateTag({
      name: 'description',
      content:
        'Diseñamos, desplegamos y gobernamos agentes de IA para RR. HH. con límites de autonomía documentados, un punto de control humano y gobernanza de datos europea desde el primer día.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'agentic AI RRHH, IA agéntica recursos humanos, people analytics España, gobernanza de IA RRHH, EU AI Act recursos humanos',
    });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }
}
