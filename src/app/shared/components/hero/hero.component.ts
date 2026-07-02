import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';
import { CtaComponent, CTA_LABELS, CtaVariant } from '../cta/cta.component';
import { ButtonComponent } from '../button/button.component';

/**
 * PageHeroComponent — see component-library.md. Content is constrained to a
 * readable max-width and left-aligned, never centered, at every breakpoint:
 * centered hero text at long headline lengths reads as "landing page
 * template," not "consulting firm" (a deliberate, stated choice carried
 * over from home-wireframe.md / page-wireframes.md).
 *
 * `secondaryCtaVariant` and `showSignalMark` exist only for Home, whose
 * wireframe calls for a dual-CTA hero (primary + ghost) and the signal
 * mark as supporting visual (logo-principles.md: solid circle + one open
 * arc, single color, no gradient/glow). Both default off so every other
 * page using this component is unaffected.
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [BreadcrumbComponent, CtaComponent, ButtonComponent],
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
  readonly showSignalMark = input(false);

  protected readonly secondaryCtaLabel = computed(() => {
    const variant = this.secondaryCtaVariant();
    return variant ? CTA_LABELS[variant] : '';
  });
  protected readonly secondaryCtaQueryParams = computed(() => ({
    motivo: this.secondaryCtaVariant(),
  }));
}
