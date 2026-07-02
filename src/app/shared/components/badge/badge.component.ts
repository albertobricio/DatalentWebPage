import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'accent';

/**
 * See projects/datalent-v2/component-library.md's Badge / Tag spec.
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge badge--{{ variant() }}"><ng-content /></span>`,
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
}
