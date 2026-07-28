import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface AutonomyStep {
  readonly label: string;
}

/**
 * El diagrama de límite de autonomía que `illustration-style.md` especifica
 * como "Primary Use Case", construido con la misma gramática que la marca:
 * círculo sólido y arco abierto, las mismas primitivas de
 * `logo-principles.md`, ahora haciendo trabajo explicativo en vez de trabajo
 * de identidad.
 *
 * Dos decisiones que cargan el argumento y conviene no deshacer sin pensarlo:
 *
 * 1. El círculo de supervisión humana está FUERA del arco. Dibujarlo dentro
 *    diría que la persona es un paso más del flujo, que es justo lo contrario
 *    del Pilar 1 de `positioning.md`.
 * 2. El arco se abre solo por el punto de escalado. La apertura es el
 *    mecanismo, no un adorno.
 *
 * Monocromo más acento, sin relleno degradado ni ilustración de personas, por
 * la regla de `design-system.md` contra los clichés visuales de "IA".
 *
 * Accesibilidad: el SVG es `role="img"` con título y descripción enlazados por
 * aria-labelledby, porque `illustration-style.md` exige que el significado de
 * un diagrama no dependa solo de la interpretación visual.
 */
@Component({
  selector: 'app-autonomy-boundary-diagram',
  standalone: true,
  templateUrl: './autonomy-boundary-diagram.component.html',
  styleUrl: './autonomy-boundary-diagram.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutonomyBoundaryDiagramComponent {
  /** Rótulo del ejemplo concreto que ilustra el diagrama. */
  readonly caption = input.required<string>();

  /**
   * Pasos que el agente ejecuta solo. Dos o tres, per illustration-style.md.
   *
   * Máximo ~34 caracteres por etiqueta. El texto de un SVG no se ajusta solo:
   * a 14px, una etiqueta más larga se sale del arco y llega a solaparse con el
   * punto de escalado. El detalle largo va en la copia de la página, que es
   * donde puede fluir.
   */
  readonly steps = input.required<readonly AutonomyStep[]>();

  /** Qué postura de supervisión aplica en el punto de escalado. */
  readonly oversightLabel = input('Supervisión humana');
  readonly oversightDetail = input('HITL: aprueba antes de que se ejecute');

  /** Nota al pie con el nivel de autonomía real del despliegue. */
  readonly footnote = input.required<string>();

  /** Texto alternativo completo, obligatorio: el diagrama no puede depender de la vista. */
  readonly description = input.required<string>();

  /** Coordenada Y de cada paso, repartida alrededor del centro del arco (215). */
  protected stepY(index: number, total: number): number {
    const separacion = 58;
    return 215 - ((total - 1) * separacion) / 2 + index * separacion;
  }
}
