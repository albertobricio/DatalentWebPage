import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CtaComponent } from '../../shared/components/cta/cta.component';
import { FaqAccordionComponent } from '../../shared/components/faq-accordion/faq-accordion.component';
import { SectionComponent } from '../../shared/components/section/section.component';
import { SITE_FAQ_ITEMS } from '../../shared/content/faq-items';
import { SeoService } from '../../shared/seo.service';

/**
 * Sprint 7 rewrite. The previous FAQ still sold the pre-v2 offer
 * ("Smart Recruitment", "Upskilling & Reskilling" — neither is one of the
 * six practices), claimed LatAm + Europe operations against a
 * European-first positioning, promised that "nuestro equipo directivo"
 * would accompany the client, and published a fabricated outcome
 * ("reducción de rotación hasta un 35 %").
 *
 * The replacement follows docs/business-audit-v2.md's own FAQ rewrite,
 * which found that six personas out of six would not buy after reading
 * the old one: an FAQ is the cheapest, highest-credibility place to
 * define a category, and every objection it left unanswered (autonomy,
 * data residency, bias testing, pay equity, integration, software-vs-
 * service) is answered here instead.
 *
 * Where an answer depends on facts specific to an engagement — hosting
 * jurisdiction, legal basis, risk tier — it says so rather than
 * asserting a generic guarantee, per .claude/memory/non-fabrication-policy.md.
 *
 * Nov. 2026: el enlace "Contáctanos" del final era un <a> sin href que
 * navegaba a Home y buscaba un #contact que dejó de existir con la v2, así
 * que dejaba al visitante en la portada. Tampoco era alcanzable con teclado.
 * Ahora la página cierra con el mismo banner que el resto del sitio. Se fue
 * también el código que lo acompañaba (scrollToSection y el listener que
 * cerraba los demás <details>, sustituido por el atributo `name` nativo).
 */
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [BreadcrumbComponent, CtaComponent, FaqAccordionComponent, SectionComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  private readonly seo = inject(SeoService);

  protected readonly items = SITE_FAQ_ITEMS;

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Preguntas frecuentes' },
  ];

  constructor() {
    this.seo.set({
      title: 'Preguntas frecuentes | Datalent Solutions',
      description:
        'Respuestas sobre autonomía de los agentes, supervisión humana, residencia de datos, auditoría de sesgo, equidad retributiva, precios y cómo empezar.',
      path: '/faq',
      breadcrumbs: this.breadcrumbItems,
      faq: this.items,
    });
  }
}
