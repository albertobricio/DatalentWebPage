import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Foundational button atom. Renders a real <button> or a real <a> with a
 * genuine destination — never a styled <div> or an href-less pseudo-link.
 * See projects/datalent-v2/component-library.md's Button spec.
 *
 * Content is projected once via an `#label` ng-template and rendered with
 * ngTemplateOutlet in whichever branch is active — a raw <ng-content>
 * repeated across @if/@else branches does not reliably project (confirmed
 * by rendering this component in a browser: the button shipped with empty
 * text). ngTemplateOutlet is the standard fix for "same projected content,
 * multiple possible host elements."
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly routerLink = input<string | undefined>(undefined);
  readonly queryParams = input<Record<string, string> | undefined>(undefined);
  readonly href = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
}
