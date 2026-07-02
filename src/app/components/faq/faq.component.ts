import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FaqAccordionComponent,
  FaqItem,
} from '../../shared/components/faq-accordion/faq-accordion.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [FaqAccordionComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, AfterViewInit {
  private router = inject(Router);

  protected readonly items: readonly FaqItem[] = [
    {
      question: '1.¿Qué hace exactamente Datalent Solutions?',
      answer:
        '<p>Integramos <strong>datos, tecnología y talento humano</strong> para acelerar la transformación de las organizaciones. A través de analítica avanzada, IA generativa y conocimiento del comportamiento humano, ayudamos a las empresas a tomar decisiones más humanas, más inteligentes y más rentables.</p>',
    },
    {
      question: '2.¿Cuánto tiempo lleva implementar una solución?',
      answer:
        '<p>Depende del tipo de proyecto y del nivel de madurez digital de tu empresa. Nuestros procesos generan resultados visibles entre <strong>4 semanas y 6 meses</strong>, siempre con una metodología ágil y basada en evidencia.</p>',
    },
    {
      question: '3.¿Por qué elegir Datalent Solutions?',
      answer:
        '<p>Porque unimos <strong>inteligencia y humanidad</strong>. Nuestro enfoque combina ciencia de datos, inteligencia artificial y desarrollo humano para crear culturas organizacionales sostenibles y maximizar el rendimiento del talento.</p>',
    },
    {
      question: '4.¿Qué servicios ofrecéis?',
      answer:
        '<ul><li><strong>Smart Recruitment</strong> | Reclutamiento Predictivo con IA.</li><li><strong>People Analytics</strong> | Diagnóstico y desarrollo del capital humano.</li><li><strong>Upskilling & Reskilling</strong> | Formación personalizada y medible.</li><li><strong>IA & Automatizaciones</strong> | Flujos inteligentes para PYMES y startups.</li></ul>',
    },
    {
      question: '5.¿Qué tipo de resultados puedo esperar?',
      answer:
        '<ul><li>Reducción de rotación de talento hasta un <strong>35 %</strong>.</li><li>Mayor compromiso y satisfacción del equipo.</li><li>Procesos automatizados y eficientes.</li><li>Dashboards personalizados con métricas claras.</li></ul>',
    },
    {
      question: '6.¿Imponéis permanencia o contratos largos?',
      answer:
        '<p>No. Creemos en relaciones basadas en <strong>confianza y resultados</strong>, no en cláusulas. Nuestros clientes permanecen porque ven el impacto real.</p>',
    },
    {
      question: '7.¿Dónde operáis?',
      answer:
        '<p>Trabajamos globalmente en <strong>Latinoamérica y Europa</strong>, de forma presencial o remota, adaptándonos a la realidad de cada cliente.</p>',
    },
    {
      question: '8.¿Cómo empiezo?',
      answer:
        '<p>Agenda una <strong>reunión de diagnóstico gratuita</strong>. En menos de 60 min analizaremos tu caso y te presentaremos una hoja de ruta inicial. Si tu empresa cumple los criterios de acceso, nuestro equipo directivo te acompañará personalmente.</p>',
    },
    {
      question: '9.¿Cuál es vuestro mensaje central?',
      answer:
        '<blockquote>“En un mundo guiado por los datos, el valor más grande sigue estando en las personas. Datalent Solutions une ambos mundos: inteligencia y humanidad.”</blockquote>',
    },
  ];

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
