import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ContainerVariant = 'default' | 'prose';

/**
 * Wraps the .container / .container--prose classes from
 * src/styles/theme/_container.scss as a component, so templates compose
 * layout via markup rather than remembering the right utility class.
 */
@Component({
  selector: 'app-container',
  standalone: true,
  template: `
    <div [class]="variant() === 'prose' ? 'container--prose' : 'container'">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  readonly variant = input<ContainerVariant>('default');
}
