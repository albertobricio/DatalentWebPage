import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {

  // índice del desplegable abierto
  openIndex: number | null = 0; // si quieres que ninguno salga abierto pon null

  // aquí va toda la info del FAQ en formato desplegable
  faqs = [
    {
      title: '¿Qué servicios ofrece Datalent Solutions?',
      content: [
        'Ofrecemos soluciones de analítica de talento y automatización orientadas a resultados:',
        '- Recruitment Predictivo',
        '- Diagnóstico y Desarrollo Organizacional',
        '- Upskilling & Reskilling',
        '- IA y Automatización para PYMES',
        'Diseñamos la solución según el nivel de madurez digital y de talento de la empresa.'
      ]
    },
    {
      title: '¿En qué consiste el Recruitment Predictivo?',
      content: [
        'Integramos datos (skills, motivación y encaje cultural) para reducir errores de contratación.',
        'Validamos técnica y culturalmente a los perfiles.',
        'Reducimos el time-to-hire y aumentamos la retención.'
      ]
    },
    {
      title: '¿Qué es el Diagnóstico y Desarrollo Organizacional?',
      content: [
        'Analizamos cultura, compromiso y desempeño para identificar palancas de crecimiento.',
        'Te ayudamos a tomar decisiones basadas en datos humanos, no solo en percepciones.',
        'Ideal para empresas que están escalando o quieren profesionalizar RRHH.'
      ]
    },
    {
      title: '¿Qué diferencia a Datalent Solutions de otras consultoras?',
      content: [
        'Combinamos evidencia (datos, analítica, IA) con empatía humana.',
        'No entregamos informes que nadie lee: proponemos acciones aplicables.',
        'Conocemos el mercado de España y Europa, por lo que adaptamos los perfiles y la comunicación.'
      ]
    },
    {
      title: '¿Trabajan con empresas internacionales o solo España?',
      content: [
        'Sí, trabajamos con empresas de España y Europa.',
        'Adaptamos el idioma, huso horario y la estrategia de talento al contexto del cliente.'
      ]
    },
    {
      title: '¿Puedo pedir una consulta general antes de contratar un servicio?',
      content: [
        'Claro. Puedes elegir “Consulta General” y te orientamos sobre qué servicio encaja más con tu caso.',
        'No todas las empresas necesitan lo mismo: a veces es diagnóstico primero, otras es automatizar.'
      ]
    },
    {
      title: '¿Cómo puedo contactar con vosotros?',
      content: [
        'Puedes usar el formulario de la web o escribir directamente a gmorales@datalentsolutions.com.',
        'Si ya sabes el servicio que te interesa, indícalo: nos ayuda a ser más ágiles.'
      ]
    }
  ];

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
