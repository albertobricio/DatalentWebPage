import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CONTACT_LIMITS, EmailService } from '../../providers/email.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SeoService } from '../../shared/seo.service';

interface ServiceOption {
  readonly value: string;
  /** Lo que ve el visitante: el problema, no el nombre del producto. */
  readonly label: string;
  /** Lo que llega en el email, para saber a qué solución corresponde. */
  readonly brand: string;
}

/**
 * Las cuatro soluciones más un diagnóstico general y "otro". Es la señal de
 * cualificación que el formulario existe para capturar (docs/business-audit-v2.md:
 * "todos los leads etiquetados como Consulta general").
 *
 * El value coincide con la variante de cada solución, así que
 * /contacto?motivo=radar llega con Radar ya elegido (ver applyMotivo).
 */
const SERVICE_OPTIONS: readonly ServiceOption[] = [
  { value: 'general', label: 'Todavía no lo sé: quiero un diagnóstico', brand: 'Diagnóstico general' },
  { value: 'match', label: 'Encontrar y contratar personal', brand: 'Datalent Match' },
  { value: 'flow', label: 'Papeleo y tareas repetitivas de personal', brand: 'Datalent Flow' },
  { value: 'radar', label: 'Que no se me vaya la gente y organizar la plantilla', brand: 'Datalent Radar' },
  { value: 'shield', label: 'Usar IA sin problemas legales', brand: 'Datalent Shield' },
  { value: 'otro', label: 'Otra cosa', brand: 'Otro' },
];

/**
 * Tamaño de empresa, opcional. Los tramos son los de la definición europea de
 * pyme (Recomendación 2003/361/CE: micro, pequeña, mediana y grande por
 * número de personas), que es como se segmenta este mercado. Sirve para
 * preparar el diagnóstico antes de la llamada en lugar de preguntarlo en ella.
 */
const COMPANY_SIZES: readonly { readonly value: string; readonly label: string }[] = [
  { value: '', label: 'Prefiero no indicarlo' },
  { value: 'micro', label: 'Menos de 10 personas' },
  { value: 'pequena', label: 'De 10 a 49 personas' },
  { value: 'mediana', label: 'De 50 a 249 personas' },
  { value: 'grande', label: '250 personas o más' },
];

// 'briefing' ya no lo genera ningún botón; se mantiene para que los enlaces
// antiguos con ?motivo=briefing sigan llegando al diagnóstico.
const MOTIVO_LABELS: Readonly<Record<string, string>> = {
  diagnostico: 'Diagnóstico gratuito',
  briefing: 'Diagnóstico gratuito',
};

const MOTIVO_DEFAULT_SERVICE: Readonly<Record<string, string>> = {
  diagnostico: 'general',
  briefing: 'general',
};

/**
 * Menos de esto entre abrir la página y enviar no lo hace una persona: hay
 * cuatro campos obligatorios y una casilla. Los bots que rellenan formularios
 * envían en milisegundos.
 */
const MIN_FILL_MS = 3000;

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
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly confirmation = viewChild<ElementRef<HTMLElement>>('confirmation');
  private readonly openedAt = Date.now();

  protected readonly serviceOptions = SERVICE_OPTIONS;
  protected readonly companySizes = COMPANY_SIZES;
  protected readonly limits = CONTACT_LIMITS;
  protected readonly contactEmail = environment.contactEmail;

  protected readonly submitting = signal(false);
  /** Enviado con éxito: el formulario se sustituye por la confirmación. */
  protected readonly sent = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly contextLabel = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(CONTACT_LIMITS.nombre)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(CONTACT_LIMITS.email)]],
    telefono: [
      '',
      [Validators.pattern(/^[0-9+() .-]{6,}$/), Validators.maxLength(CONTACT_LIMITS.telefono)],
    ],
    empresa: ['', [Validators.maxLength(CONTACT_LIMITS.empresa)]],
    tamano: [''],
    servicio: ['general', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.maxLength(CONTACT_LIMITS.mensaje)]],
    privacidad: [false, [Validators.requiredTrue]],
    // Campo trampa: invisible para una persona, irresistible para un bot que
    // rellena todo lo que encuentra. Ver el comentario en la plantilla.
    referencia: [''],
  });

  constructor() {
    this.seo.set({
      title: 'Contacto y diagnóstico gratuito | Datalent Solutions',
      description:
        'Pide un diagnóstico gratuito de 30 minutos sobre IA para RR. HH., people analytics, retribución o gobernanza de IA. Respuesta en menos de 24 horas hábiles.',
      path: '/contacto',
      breadcrumbs: [{ label: 'Inicio', url: '/' }, { label: 'Contacto' }],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contacto | Datalent Solutions',
        about: {
          '@type': 'Organization',
          '@id': 'https://datalentsolutions.com/#organization',
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
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }

    const value = this.form.getRawValue();
    const fallback = `No hemos podido enviar tu solicitud. Escríbenos directamente a ${this.contactEmail}.`;

    // Trampa rellenada o envío instantáneo: casi seguro un bot. Se responde
    // con el mismo mensaje de error que un fallo de red, que ofrece el correo
    // directo. Así una persona marcada por error (un gestor de contraseñas
    // que rellene el campo oculto) no pierde la vía de contacto, y al bot no
    // se le dice qué ha fallado.
    if (value.referencia || Date.now() - this.openedAt < MIN_FILL_MS) {
      this.errorMessage.set(fallback);
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const option = this.serviceOptions.find((item) => item.value === value.servicio);
    const serviceLabel = option ? `${option.label} (${option.brand})` : value.servicio;
    const sizeLabel = this.companySizes.find((item) => item.value === value.tamano && item.value)?.label ?? '';

    // Los dos datos de cualificación van también al principio del mensaje:
    // la plantilla de EmailJS no los conoce todavía como variables propias.
    const extras = [
      sizeLabel ? `Tamaño de la empresa: ${sizeLabel}` : '',
      value.telefono ? `Teléfono: ${value.telefono}` : '',
    ].filter(Boolean);
    const message = extras.length ? `${extras.join('\n')}\n\n${value.mensaje}` : value.mensaje;

    const result = await this.emailService.sendMail({
      from_name: value.nombre,
      from_email: value.email,
      company: value.empresa,
      service_interest: serviceLabel,
      message,
      to_email: this.contactEmail,
      company_size: sizeLabel,
      phone: value.telefono,
    });
    this.submitting.set(false);

    switch (result) {
      case 'ok':
        this.sent.set(true);
        // La confirmación sustituye al formulario. Sin mover el foco, quien
        // navega con teclado o lector de pantalla se queda en un botón que
        // ya no existe y no se entera de que el envío ha salido bien.
        setTimeout(() => this.confirmation()?.nativeElement.focus(), 0);
        break;
      case 'cooldown':
        this.errorMessage.set(
          `Acabas de enviar una solicitud y ya la tenemos. Si quieres añadir algo, escríbenos a ${this.contactEmail}.`,
        );
        break;
      case 'invalid':
        this.errorMessage.set(
          `Hay algún dato que no podemos enviar tal como está. Revísalo o escríbenos a ${this.contactEmail}.`,
        );
        break;
      default:
        this.errorMessage.set(fallback);
    }
  }

  /** Lleva el foco al primer campo con error, en el orden del formulario. */
  private focusFirstInvalid(): void {
    this.host.nativeElement
      .querySelector<HTMLElement>('input.ng-invalid, select.ng-invalid, textarea.ng-invalid')
      ?.focus();
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
