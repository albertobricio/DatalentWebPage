import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface TimelineStep {
  label: string;
  description: string;
}

/**
 * A numbered sequence — the natural fit for service-catalog.md's own
 * three-stage shape (Entry Point → Design & Deployment → Retained), used by
 * every Wave 1 service page's "Qué Hacemos" block per page-wireframes.md.
 */
@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  readonly steps = input.required<TimelineStep[]>();
}
