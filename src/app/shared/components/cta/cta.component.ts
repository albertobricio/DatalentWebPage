import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export type CtaVariant = 'diagnostico' | 'briefing';

export const CTA_LABELS: Record<CtaVariant, string> = {
  diagnostico: 'Solicitar diagnóstico gratuito',
  briefing: 'Reservar briefing ejecutivo',
};

/**
 * The site's only two call-to-action buttons. No third variant exists — a
 * page needing a different action uses the ghost Button variant instead,
 * per component-library.md's CtaButtonComponent spec and page-specs.md's
 * Cross-Page Consistency Note.
 */
@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-button variant="primary" routerLink="/contacto" [queryParams]="queryParams()">
      {{ label() }}
    </app-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaComponent {
  readonly variant = input.required<CtaVariant>();

  protected readonly label = computed(() => CTA_LABELS[this.variant()]);
  protected readonly queryParams = computed(() => ({ motivo: this.variant() }));
}
