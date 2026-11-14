import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CtaComponent } from '../../shared/components/cta/cta.component';
import { SeoService } from '../../shared/seo.service';

interface Salida {
  readonly label: string;
  readonly path: string;
  readonly detalle: string;
}

/**
 * Página de error 404.
 *
 * GitHub Pages sirve dist/404.html con estado HTTP 404 para cualquier ruta
 * que no exista. Ese archivo lo genera prerender.mjs a partir de este
 * componente, así que el visitante ve la página ya pintada y, cuando Angular
 * arranca, la ruta comodín vuelve a renderizar lo mismo.
 *
 * Lleva noindex: no es contenido que deba aparecer en un buscador.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, CtaComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  protected readonly salidas: readonly Salida[] = [
    { label: 'Soluciones', path: '/servicios', detalle: 'Flow, Match, Radar y Shield' },
    { label: 'Por qué Datalent', path: '/por-que-datalent', detalle: 'Qué sostenemos y qué no somos' },
    { label: 'Preguntas frecuentes', path: '/faq', detalle: 'Datos, supervisión humana y precios' },
    { label: 'Contacto', path: '/contacto', detalle: 'Respuesta en menos de 24 horas hábiles' },
  ];

  constructor() {
    inject(SeoService).set({
      title: 'Página no encontrada | Datalent Solutions',
      description: 'La página que buscas no existe o ha cambiado de dirección.',
      path: '/404',
      noindex: true,
    });
  }
}
