import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A single labeled data point. Purely presentational — this component does
 * not source or validate the value it's given; whichever page uses it is
 * responsible for that value being real and, where required, sourced, per
 * .claude/memory/non-fabrication-policy.md. `value` is typed as a string
 * rather than a number so a qualitative marker (e.g. "6") is as valid a use
 * as a sourced metric — this component makes no claim about what kind of
 * fact it's displaying.
 */
@Component({
  selector: 'app-stat',
  standalone: true,
  template: `
    <div class="stat">
      <p class="stat__value">{{ value() }}</p>
      <p class="stat__label">{{ label() }}</p>
    </div>
  `,
  styleUrl: './stat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatComponent {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
}
