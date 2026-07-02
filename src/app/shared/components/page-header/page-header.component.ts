import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A section-level heading block (H2 + optional intro paragraph), used
 * repeatedly within a page body — distinct from HeroComponent, which is
 * the single top-of-page H1 block. See page-wireframes.md's "Qué Hacemos",
 * "Nuestras Prácticas" level of hierarchy.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <header class="page-header">
      <h2>{{ title() }}</h2>
      @if (description()) {
        <p class="page-header__description">{{ description() }}</p>
      }
    </header>
  `,
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
}
