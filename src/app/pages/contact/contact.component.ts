import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { EmailService } from '../../providers/email.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SeoService } from '../../shared/seo.service';

interface ServiceOption {
  readonly value: string;
  readonly label: string;
}

/**
 * Matches the six practices (service-catalog.md) plus a general/other
 * fallback — this is the qualification signal page-specs.md's Contact
 * entry exists to capture, closing docs/business-audit-v2.md's "every
 * lead tagged Consulta general" finding.
 */
const SERVICE_OPTIONS: readonly ServiceOption[] = [
  { value: 'general', label: 'Diagnóstico general' },
  { value: 'agentic-ai', label: 'Agentic AI para RR. HH.' },
  { value: 'people-analytics', label: 'People Analytics' },
  { value: 'compensacion-total-rewards', label: 'Compensación y Total Rewards' },
  { value: 'gobernanza-ia', label: 'Gobernanza de IA' },
  { value: 'workforce-intelligence', label: 'Workforce Intelligence' },
  { value: 'otro', label: 'Otro' },
];

const MOTIVO_LABELS: Readonly<Record<string, string>> = {
  diagnostico: 'Diagnóstico gratuito',
  briefing: 'Briefing ejecutivo',
};

const MOTIVO_DEFAULT_SERVICE: Readonly<Record<string, string>> = {
  diagnostico: 'general',
  briefing: 'otro',
};

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, BadgeComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly emailService = inject(EmailService);
  private readonly seo = inject(SeoService);

  protected readonly serviceOptions = SERVICE_OPTIONS;
  protected readonly contactEmail = environment.contactEmail;

  protected readonly submitting = signal(false);
  protected readonly submitStatus = signal<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  protected readonly contextLabel = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    empresa: [''],
    servicio: ['general', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.maxLength(2000)]],
    privacidad: [false, [Validators.requiredTrue]],
  });

  constructor() {
    this.seo.set({
      title: 'Contacto | Datalent Solutions',
      description:
        'Habla con Datalent Solutions sobre agentic AI para RR. HH., people analytics, compensación o gobernanza de IA. Respuesta de un especialista en menos de 24 horas hábiles.',
      path: '/contacto',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contacto | Datalent Solutions',
        about: {
          '@type': 'Organization',
          name: 'Datalent Solutions',
          email: environment.contactEmail,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Tarancón',
            addressRegion: 'Cuenca',
            addressCountry: 'ES',
          },
        },
      },
    });

    const motivo = this.route.snapshot.queryParamMap.get('motivo');
    if (motivo) {
      this.applyMotivo(motivo);
    }
  }


  protected async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitStatus.set(null);

    const value = this.form.getRawValue();
    const serviceLabel =
      this.serviceOptions.find((option) => option.value === value.servicio)?.label ??
      value.servicio;

    const payload = {
      from_name: value.nombre,
      from_email: value.email,
      company: value.empresa,
      service_interest: serviceLabel,
      message: value.mensaje,
      to_email: this.contactEmail,
    };

    const success = await this.emailService.sendMail(payload);
    this.submitting.set(false);

    if (success) {
      this.submitStatus.set({
        type: 'success',
        message: 'Gracias. Hemos recibido tu solicitud y te responderemos en menos de 24 horas hábiles.',
      });
      this.form.reset({ servicio: 'general', privacidad: false });
    } else {
      this.submitStatus.set({
        type: 'error',
        message: `No hemos podido enviar tu solicitud. Escríbenos directamente a ${this.contactEmail}.`,
      });
    }
  }

  private applyMotivo(motivo: string): void {
    const matchedService = this.serviceOptions.find((option) => option.value === motivo);
    if (matchedService) {
      this.form.controls.servicio.setValue(matchedService.value);
      this.contextLabel.set(matchedService.label);
      return;
    }

    const label = MOTIVO_LABELS[motivo];
    const defaultService = MOTIVO_DEFAULT_SERVICE[motivo];
    if (label && defaultService) {
      this.form.controls.servicio.setValue(defaultService);
      this.contextLabel.set(label);
    }
  }
}
