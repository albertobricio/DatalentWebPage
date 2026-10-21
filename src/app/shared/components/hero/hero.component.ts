import { ChangeDetectionStrategy, Component, computed, input, viewChild } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';
import { CtaComponent, CTA_LABELS, CtaVariant } from '../cta/cta.component';
import { ButtonComponent } from '../button/button.component';
import { DotsCanvasComponent, DotsVariant } from '../dots-canvas/dots-canvas.component';

/**
 * PageHeroComponent — see component-library.md. Content is constrained to a
 * readable max-width and left-aligned, never centered, at every breakpoint:
 * centered hero text at long headline lengths reads as "landing page
 * template," not "consulting firm" (a deliberate, stated choice carried
 * over from home-wireframe.md / page-wireframes.md).
 *
 * `secondaryCtaVariant` exists for pages whose wireframe calls for a
 * dual-CTA hero (primary + ghost).
 *
 * `dotsVariant` pinta a la derecha el canvas de puntos interactivo: la
 * constelación (`field`) en Home y, en cada página de práctica, la figura de
 * la solución a la que pertenece (Flow, Radar, Shield). Sustituye a la marca
 * de señal que antes ocupaba ese hueco solo en Home y dejaba media pantalla
 * vacía en el resto. El cursor se recoge en todo el hero, no solo encima del
 * canvas, para que la animación responda desde el primer movimiento.
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [BreadcrumbComponent, CtaComponent, ButtonComponent, DotsCanvasComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly ctaVariant = input<CtaVariant>('briefing');
  readonly secondaryCtaVariant = input<CtaVariant | undefined>(undefined);
  readonly breadcrumbItems = input<BreadcrumbItem[] | undefined>(undefined);
  readonly dotsVariant = input<DotsVariant | undefined>(undefined);

  protected readonly dots = viewChild(DotsCanvasComponent);

  protected readonly secondaryCtaLabel = computed(() => {
    const variant = this.secondaryCtaVariant();
    return variant ? CTA_LABELS[variant] : '';
  });
  protected readonly secondaryCtaQueryParams = computed(() => ({
    motivo: this.secondaryCtaVariant(),
  }));
}
