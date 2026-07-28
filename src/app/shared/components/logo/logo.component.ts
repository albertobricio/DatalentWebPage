import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

let instancia = 0;

/**
 * El símbolo de Datalent Solutions.
 *
 * ATENCIÓN: es una RECONSTRUCCIÓN geométrica hecha a partir de una imagen del
 * logotipo, no el archivo de marca original. Se aproxima mucho, pero no es
 * idéntica: las terminaciones de los arcos del original están cortadas en
 * bisel y aquí son perpendiculares, y los colores están estimados a ojo, no
 * muestreados del archivo. En cuanto exista `logo-datalent-simbolo.svg` con
 * el vector real, este componente debe sustituirse por él.
 *
 * El wordmark NO se reconstruye: son letras de dibujo propio y sustituirlas
 * por una tipografía del sistema se notaría. "Datalent Solutions" sigue
 * siendo texto en la tipografía del sitio, que además es escalable,
 * seleccionable y accesible.
 *
 * El degradado es lo único del sitio que usa cian. La paleta de interfaz son
 * neutros cálidos con un único acento azul marino; el logotipo se queda con
 * su colorimetría propia y actúa como firma.
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  /**
   * 'dark' aclara el degradado para fondos oscuros. El degradado original
   * termina en un azul marino que sobre --color-ink baja de 2:1.
   */
  readonly tone = input<'light' | 'dark'>('light');

  /**
   * Cada instancia necesita su propio id de degradado: los ids de SVG son
   * globales al documento y Angular no los encapsula, así que dos logos en la
   * misma página (cabecera y pie) compartirían definición y la segunda
   * referencia apuntaría a la primera.
   */
  protected readonly gradId = `datalent-logo-${++instancia}`;

  protected readonly paradas = computed(() =>
    this.tone() === 'dark'
      ? ['#7fd6d2', '#7ab6cd', '#7d9dba', '#8fa9de']
      : ['#2ec9c4', '#2b96b4', '#22608e', '#1b3f6b'],
  );
}
