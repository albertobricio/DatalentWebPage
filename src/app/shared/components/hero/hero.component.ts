import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';
import { CtaComponent, CtaVariant } from '../cta/cta.component';

/**
 * PageHeroComponent — see component-library.md. Content is constrained to a
 * readable max-width and left-aligned, never centered, at every breakpoint:
 * centered hero text at long headline lengths reads as "landing page
 * template," not "consulting firm" (a deliberate, stated choice carried
 * over from home-wireframe.md / page-wireframes.md).
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [BreadcrumbComponent, CtaComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly ctaVariant = input<CtaVariant>('briefing');
  readonly breadcrumbItems = input<BreadcrumbItem[] | undefined>(undefined);
}
