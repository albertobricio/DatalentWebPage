import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A real semantic blockquote, for sourced citations (e.g. a regulatory
 * reference or a newsletter citation per non-fabrication-policy.md's
 * sourcing discipline) or, once real ones exist, attributed client
 * testimonials — never an unattributed quote presented as a testimonial,
 * the pattern docs/website-audit.md found on the current site.
 */
@Component({
  selector: 'app-quote',
  standalone: true,
  template: `
    <blockquote class="quote">
      <p class="quote__text"><ng-content /></p>
      @if (attribution()) {
        <footer class="quote__attribution">— {{ attribution() }}</footer>
      }
    </blockquote>
  `,
  styleUrl: './quote.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteComponent {
  readonly attribution = input<string | undefined>(undefined);
}
