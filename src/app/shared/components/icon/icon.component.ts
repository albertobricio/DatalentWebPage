import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type IconSize = 'sm' | 'md' | 'lg';

declare const lucide: { createIcons: () => void } | undefined;

/**
 * Wraps the Lucide icon set already loaded in src/index.html (pinned to a
 * fixed version — see projects/datalent-v2/iconography.md). Every icon is
 * either purely decorative (aria-hidden, always paired with visible text
 * elsewhere) or carries a real accessible name via `label` — never both
 * unlabeled and the sole conveyor of meaning.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <i
      class="icon icon--{{ size() }}"
      [attr.data-lucide]="name()"
      [attr.aria-hidden]="label() ? null : 'true'"
      [attr.aria-label]="label() ?? null"
    ></i>
  `,
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements AfterViewInit {
  readonly name = input.required<string>();
  readonly label = input<string | undefined>(undefined);
  readonly size = input<IconSize>('md');

  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}
