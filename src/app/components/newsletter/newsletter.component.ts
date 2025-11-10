import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmailService } from 'src/app/providers/email.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'app-newsletter',
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  private emailService = inject(EmailService);
  formStatus = '';

  ngOnInit(): void {
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('scroll'));
  }

  sendMailToSubscribe(): void {
    const emailInput = (document.getElementById('email') as HTMLInputElement);
    const email = emailInput.value;
    const body = `Hola,\n\nMe gustaría suscribirme al newsletter. Mi correo es: ${email}\n\nGracias.`;

    const payload = {
      from_name: 'Suscripción al Newsletter de Datalent',
      from_email: email || '',
      phone: '',
      company: '',
      service_interest: 'Newsletter Subscription',
      message: body || '',
      to_email: environment.contactEmail
    };

    this.emailService.sendMail(payload).then(success => {
      if (success) {
        this.formStatus = '¡Gracias! Te has suscrito exitosamente al newsletter.';
      } else {
        this.formStatus = 'Error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.';
      }
    });
  }
    
}
