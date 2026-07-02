import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '../card/card.component';

/**
 * One trust statement — see component-library.md's TrustFooterStripComponent
 * anatomy. A consuming page composes 2–3 of these inside its own flex/grid
 * wrapper to form the horizontal strip (Agentic AI, AI Governance, People
 * Analytics, Compensation & Total Rewards pages, per sprint-01.md);
 * TrustCard itself stays agnostic of its position in that layout.
 */
@Component({
  selector: 'app-trust-card',
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card class="trust-card">
      <span class="trust-card__marker" aria-hidden="true"></span>
      <p class="trust-card__statement"><ng-content /></p>
    </app-card>
  `,
  styleUrl: './trust-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustCardComponent {}
