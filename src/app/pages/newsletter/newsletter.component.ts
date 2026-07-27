import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { EmailService } from '../../providers/email.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SectionComponent } from '../../shared/components/section/section.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

/**
 * "El Radar Agéntico" — the recurring format `.claude/templates/newsletter-issue-template.md`
 * and `docs/business-audit-v2.md`'s Page 2 rewrite already specify (H1,
 * subtitle, and the four-segment structure below are used verbatim from
 * that approved rewrite, not invented here).
 *
 * Sprint 7 rebuild replaces the old page, which had drifted from this
 * approved copy in two ways: it never adopted the "El Radar Agéntico"
 * name every other page already uses to refer to it, and it published
 * unsourced/uncheckable stats ("70% de precisión... Harvard Business
 * Review, 2025", "redujo su rotación un 32%") that violate
 * `.claude/memory/non-fabrication-policy.md`. This page now describes the
 * recurring FORMAT honestly (what a subscriber receives each issue)
 * rather than fabricating a first issue's content — no real issue exists
 * yet per `roadmap.md` Phase 1.
 */
@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, SectionComponent, CardComponent, BadgeComponent],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly emailService = inject(EmailService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  protected readonly submitting = signal(false);
  protected readonly submitStatus = signal<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.title.setTitle('El Radar Agéntico | Newsletter quincenal | Datalent Solutions');
    this.meta.updateTag({
      name: 'description',
      content:
        'Cada dos semanas, un caso real o un patrón de mercado donde IA agéntica y criterio humano se combinaron para una mejor decisión de talento — con la fuente siempre citada.',
    });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitStatus.set(null);

    const { email } = this.form.getRawValue();
    const payload = {
      from_name: 'Suscripción — El Radar Agéntico',
      from_email: email,
      service_interest: 'Newsletter',
      message: `Nueva suscripción a El Radar Agéntico: ${email}`,
      to_email: environment.contactEmail,
    };

    const success = await this.emailService.sendMail(payload);
    this.submitting.set(false);

    if (success) {
      this.submitStatus.set({
        type: 'success',
        message: 'Gracias. Te avisaremos en el próximo envío de El Radar Agéntico.',
      });
      this.form.reset();
    } else {
      this.submitStatus.set({
        type: 'error',
        message: `No hemos podido registrar tu suscripción. Escríbenos a ${environment.contactEmail}.`,
      });
    }
  }
}
