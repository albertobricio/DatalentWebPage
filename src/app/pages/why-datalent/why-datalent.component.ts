import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { PillarProofBlockComponent } from '../../shared/components/pillar-proof-block/pillar-proof-block.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { CtaComponent } from '../../shared/components/cta/cta.component';
import { SectionComponent } from '../../shared/components/section/section.component';
import { BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SeoService } from '../../shared/seo.service';

/**
 * The last page site-map.md documents but never had: it was the only
 * remaining "Próximamente" in the nav and footer.
 *
 * It has no page-specs.md entry of its own, so the content is built
 * strictly from positioning.md — the four pillars verbatim (via the
 * shared PillarProofBlockComponent, so they cannot drift from Home) and
 * the "What Datalent Is Not" section, which is the part that actually
 * makes this page worth having: a positioning that rules nothing out
 * isn't a positioning.
 *
 * Deliberately no named-competitor callouts. competitive-differentiation.md
 * is an internal battlecard; naming Workday or Mercer in public copy would
 * break the register every other page holds and pick a comparison
 * positioning.md explicitly says not to pick.
 */
@Component({
  selector: 'app-why-datalent',
  standalone: true,
  imports: [
    HeroComponent,
    PillarProofBlockComponent,
    CardComponent,
    BadgeComponent,
    CtaComponent,
    SectionComponent,
  ],
  templateUrl: './why-datalent.component.html',
  styleUrl: './why-datalent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyDatalentComponent {
  private readonly seo = inject(SeoService);

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Por qué Datalent' },
  ];

  constructor() {
    this.seo.set({
      title: 'Por qué Datalent | Autonomía gobernada y diseño europeo | Datalent Solutions',
      description:
        'Cuatro pilares y una lista explícita de lo que no somos. Autonomía gobernada, diseño europeo, criterio senior sin capas intermedias y un ciclo de vida del talento integrado.',
      keywords:
        'por qué Datalent, consultoría boutique gobernanza IA RRHH, agentic AI europea RRHH',
      path: '/por-que-datalent',
      ogTitle: 'Por qué Datalent | Datalent Solutions',
      ogDescription:
        'Cuatro pilares, y una lista explícita de lo que no somos — porque un posicionamiento que no descarta nada no es un posicionamiento.',
    });
  }
}
