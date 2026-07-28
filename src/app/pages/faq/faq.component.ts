import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FaqAccordionComponent,
  FaqItem,
} from '../../shared/components/faq-accordion/faq-accordion.component';
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
 */
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [FaqAccordionComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private readonly seo = inject(SeoService);

  protected readonly items = SITE_FAQ_ITEMS;

  constructor() {
    this.seo.set({
      title: 'Preguntas frecuentes | Datalent Solutions',
      description:
        'Respuestas directas sobre autonomía de los agentes, supervisión humana, residencia de datos, auditoría de sesgo, equidad retributiva e integración con tu ATS o HRIS.',
      path: '/faq',
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('scroll'));
  }

  ngAfterViewInit(): void {
    const detailsElements = document.querySelectorAll('#accordion details');
    detailsElements.forEach((detail) => {
      detail.addEventListener('toggle', () => {
        if (detail['open']) {
          detailsElements.forEach((otherDetail) => {
            if (otherDetail !== detail) {
              otherDetail['open'] = false;
            }
          });
        }
      });
    });
  }

  scrollToSection(sectionId: string) {
    this.router.navigate(['/']);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }
}
