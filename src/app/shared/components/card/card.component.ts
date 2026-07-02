import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Generic card shell — padding, border, radius, optional hover elevation.
 * FeatureCardComponent and TrustCardComponent both compose this rather than
 * each declaring their own card-shell CSS, so the visual treatment of "a
 * card" only ever needs to change in one place.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  template: `<div class="card" [class.card--hoverable]="hoverable()"><ng-content /></div>`,
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly hoverable = input(false);
}
