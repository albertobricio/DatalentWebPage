import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface FaqItem {
  readonly question: string;
  /**
   * Static, developer-authored HTML — may contain inline markup
   * (<strong>, <ul>, <blockquote>) since some FAQ answers need it. Never
   * bind user-submitted content here: this is rendered via [innerHTML]
   * relying on Angular's default sanitizer, which is safe only because
   * every caller of this component supplies fixed, compile-time strings.
   */
  readonly answer: string;
}

/**
 * FaqAccordionItem — see component-library.md. Native <details>/<summary>
 * semantics (free keyboard support: Tab to focus, Enter/Space to toggle —
 * docs/website-audit.md flagged this as a genuine existing strength worth
 * preserving, not replacing with custom JS). Extracted in Sprint 4.5 from
 * three near-identical copies (FAQ page, Agentic AI, Compensation & Total
 * Rewards) into one component so the accordion markup, styling, and
 * cross-browser marker fix exist in exactly one place.
 */
@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  templateUrl: './faq-accordion.component.html',
  styleUrl: './faq-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqAccordionComponent {
  readonly items = input.required<readonly FaqItem[]>();
}
