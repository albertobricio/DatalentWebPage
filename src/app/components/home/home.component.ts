import { AfterViewInit, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RevealDirective } from '../../directives/reveal.directive';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';
import { MapComponent } from '../map/map.component';

declare const lucide: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective, MapComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  mobileMenuOpen = false;
  formStatus = '';
  privacyConsentChecked = false;

  ngAfterViewInit(): void {
    try { lucide.createIcons(); } catch (e) {}
    // Run one update of active link/sticky header on init
    this.updateScrollState();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updateScrollState();
  }

  private updateScrollState(): void {
    const header = document.getElementById('main-header');
    const navLinks = Array.from(document.querySelectorAll('.nav-link')) as HTMLElement[];
    const sections = Array.from(document.querySelectorAll('section')) as HTMLElement[];

    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('bg-gray-900/95');
        header.classList.remove('bg-dark-base/95');
      } else {
        header.classList.remove('bg-gray-900/95');
        header.classList.add('bg-dark-base/95');
      }
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.formStatus = 'Enviando...';

    const payload = {
      from_name: form.value.name || '',
      from_email: form.value.email || '',
      phone: form.value.phone || '',
      company: form.value.company || '',
      service_interest: form.value.serviceInterest || '',
      message: form.value.message || '',
      to_email: environment.contactEmail
    };

    try {
      // Try sending with EmailJS (client-side). Replace environment placeholders with real values.
      await emailjs.send(
        environment.emailjsServiceId,
        environment.emailjsTemplateId,
        payload,
        environment.emailjsPublicKey
      );

      this.formStatus = '¡Gracias! Tu mensaje ha sido enviado exitosamente.';
      form.resetForm();
      try { lucide.createIcons(); } catch (e) {}
    } catch (err) {
      console.error('EmailJS send error:', err);
      // Fallback: open user's mail client with a prefilled mailto link
      try {
        const subject = encodeURIComponent('Consulta desde web - ' + (payload.company || payload.from_name));
        const bodyLines = [
          `Nombre: ${payload.from_name}`,
          `Email: ${payload.from_email}`,
          `Teléfono: ${payload.phone}`,
          `Empresa: ${payload.company}`,
          `Servicio de interés: ${payload.service_interest}`,
          '',
          payload.message
        ];
        const body = encodeURIComponent(bodyLines.join('\n'));
        window.location.href = `mailto:${environment.contactEmail}?subject=${subject}&body=${body}`;
        this.formStatus = 'Se abrió tu cliente de correo para finalizar el envío.';
      } catch (mailtoErr) {
        console.error('Mailto fallback error:', mailtoErr);
        this.formStatus = 'Error al enviar el formulario. Intenta contactarnos en ' + environment.contactEmail;
      }
    }
  }
}
