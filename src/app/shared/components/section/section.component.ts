import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SectionBackground = 'primary' | 'secondary' | 'inverse';

/**
 * Page-section wrapper carrying the generous vertical rhythm
 * design-system.md calls for (space.2xl/3xl) and the three approved
 * surface treatments. See projects/datalent-v2/spacing-system.md's
 * "Section Rhythm" note: this spacing is deliberate, not padding to be
 * trimmed for density.
 */
@Component({
  selector: 'app-section',
  standalone: true,
  template: `
    <section class="section section--{{ background() }}">
      <ng-content />
    </section>
  `,
  styleUrl: './section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
  readonly background = input<SectionBackground>('primary');
}
