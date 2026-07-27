import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FaqAccordionComponent,
  FaqItem,
} from '../../shared/components/faq-accordion/faq-accordion.component';
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

  protected readonly items: readonly FaqItem[] = [
    {
      question: '¿Qué hace exactamente Datalent Solutions?',
      answer:
        '<p>Diseñamos, desplegamos y gobernamos agentes de IA y sistemas analíticos para la función de RR. HH., dentro de seis prácticas que funcionan como un solo sistema: <strong>Agentic AI</strong>, <strong>People Analytics</strong>, <strong>Compensación &amp; Total Rewards</strong>, <strong>Gobernanza de IA</strong> y <strong>Workforce Intelligence</strong>. El hilo común es que cada sistema que entra en producción lleva un límite de autonomía documentado y un punto de control humano.</p>',
    },
    {
      question: '¿Sois software o consultoría?',
      answer:
        '<p>Consultoría, con tecnología propia donde aporta: <strong>advisory-led y technology-enabled</strong>. No vendemos una plataforma que configuras en solitario, ni entregamos un informe y desaparecemos. Diseñamos el sistema, lo desplegamos y seguimos siendo responsables de su gobernanza.</p>',
    },
    {
      question: '¿Quién lleva mi proyecto?',
      answer:
        '<p>Quien lo diseña. Datalent es hoy una práctica boutique dirigida por una sola profesional, sin equipos junior intermedios: la persona con la que hablas en el primer diagnóstico es la que ejecuta el trabajo. Para encargos que exceden esa capacidad, lo decimos antes de aceptarlos en lugar de subcontratarlos en silencio.</p>',
    },
    {
      question: '¿Vuestra IA toma decisiones de forma autónoma o siempre hay supervisión humana?',
      answer:
        '<p>Nuestros agentes de IA operan dentro de límites de autonomía que definimos junto a cada cliente. Ejecutan tareas completas — cribado, análisis, reporting — pero cada decisión con impacto en una persona pasa por un punto de revisión humana antes de ser definitiva. No automatizamos decisiones; automatizamos trabajo, y dejamos las decisiones donde deben estar.</p>',
    },
    {
      question: '¿Dónde se alojan y procesan nuestros datos? ¿Cumplís el RGPD y el EU AI Act?',
      answer:
        '<p>La jurisdicción de alojamiento, la base legal del tratamiento y la clasificación de riesgo se determinan y documentan para cada sistema concreto antes del despliegue — no son una promesa genérica de web, porque dependen de qué datos entran y desde dónde. Lo que sí es estructural: diseñamos bajo marco europeo, y todo sistema que influya en una decisión de empleo parte de la premisa del Anexo III del Reglamento (UE) 2024/1689 como categoría de alto riesgo, más el Artículo 22 del RGPD sobre decisiones automatizadas.</p>',
    },
    {
      question: '¿Cómo evitáis que un modelo introduzca sesgo en la selección?',
      answer:
        '<p>Con auditoría de sesgo obligatoria <em>antes</em> de que un modelo influya en una decisión real, no después: cribado de impacto dispar frente al umbral de la regla del 4/5, documentación de qué variables alimentan el modelo y con qué peso — nunca una puntuación de caja negra — y re-validación periódica, porque un modelo que no se mantiene se degrada en silencio.</p>',
    },
    {
      question: '¿Ofrecéis equidad retributiva o benchmarking salarial?',
      answer:
        '<p>Sí, es el punto de entrada de la práctica de Compensación &amp; Total Rewards: una auditoría de equidad retributiva o un benchmark de mercado para un conjunto de roles definido, siempre mostrando la brecha bruta y la ajustada por separado. Reportar solo una de las dos es engañoso en cualquier dirección. La Directiva (UE) 2023/970 de Transparencia Retributiva es el marco de referencia, y su plazo de transposición ya ha pasado.</p>',
    },
    {
      question: '¿Cómo os integráis con nuestro ATS o HRIS actual?',
      answer:
        '<p>No pedimos sustituir la plataforma que ya tienes. Si ya operas Workday, SAP SuccessFactors, Visier o similar, el trabajo se apoya en esos sistemas como fuente de datos y, cuando corresponde, actuamos como capa independiente de validación de metodología y gobernanza sobre ellos. El alcance técnico de la integración se define en el diagnóstico inicial, no antes.</p>',
    },
    {
      question: '¿Cómo empiezo?',
      answer:
        '<p>Con un diagnóstico gratuito de unos 30 minutos: revisamos tu caso concreto y te decimos si hay encaje — incluida la respuesta honesta de que no lo hay, si es el caso. De ahí sale una recomendación de punto de entrada, no una propuesta cerrada.</p>',
    },
    {
      question: '¿Imponéis permanencia o contratos largos?',
      answer:
        '<p>No. Cada práctica tiene un punto de entrada acotado y de alcance cerrado, precisamente para que puedas evaluar el trabajo antes de comprometerte a nada mayor. La relación continua, cuando existe, es una decisión posterior y explícita.</p>',
    },
  ];

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
