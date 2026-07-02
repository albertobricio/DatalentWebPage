import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';
import { RouterLink } from '@angular/router';

/**
 * ServiceCardComponent — see component-library.md. Description copy must
 * match service-catalog.md's Entry Point language verbatim wherever this is
 * used (sprint-01.md's single-source-of-copy rule); this component enforces
 * structure, not content accuracy, which is the consuming page's
 * responsibility.
 */
@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CardComponent, BadgeComponent, RouterLink],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCardComponent {
  readonly badge = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly link = input.required<string>();
  readonly linkLabel = input('Ver servicio');
}
