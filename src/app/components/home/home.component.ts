import { AfterViewInit, Component, HostListener, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RevealDirective } from '../../directives/reveal.directive';
import { environment } from '../../../environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NewsletterComponent } from '../newsletter/newsletter.component';
import { EmailService } from 'src/app/providers/email.service';
import { MapComponent } from '../map/map.component';

declare const lucide: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RevealDirective, 
    MapComponent, 
    NewsletterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private renderer = inject(Renderer2);

  private emailService = inject(EmailService);

  formStatus = '';
  privacyConsentChecked = false;

  constructor() {
    this.title.setTitle('Datalent Solutions');
    this.meta.addTags([
      { name: 'description', content: 'Datalent Solutions es una consultora especializada en atracción, reclutamiento, selección,\
        formación y desarrollo de capital humano basado en analítica predictiva, IA y evidencia científica.' },
      { name: 'keywords', content: 'ofertas de trabajo de tarancon, ofertas de empleo de tarancon, vacantes de tarancon, eurofirms, adecco' },
      { name: 'author', content: 'Datalent Solutions' },
      { rel: 'canonical', href: 'https://www.datalentsolutions.com' }
    ]);
  }
  
  ngAfterViewInit(): void {
    try { lucide.createIcons(); } catch (e) {}
    // Run one update of active link/sticky header on init
    this.updateScrollState();
    this.renderTrustIndexGoogleReviews();
  }

  private renderTrustIndexGoogleReviews(): void {
    const script = this.renderer.createElement('script');
    script.src = "https://cdn.trustindex.io/loader.js?69a8a5a57a63688be59604730bd";
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(document.getElementById("googleReviews"), script);
  }

  isNewsletterRoute(): boolean {
    return this.router.url === '/newsletter';
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

    this.emailService.sendMail(payload).then(success => {
      if (success) {
      this.formStatus = '¡Gracias! Tu mensaje ha sido enviado exitosamente.';
    } else {
      this.formStatus = 'Error al enviar el formulario. Intenta contactarnos en ' + environment.contactEmail;
    }
    } );

    try { lucide.createIcons(); } catch (e) {}
    form.resetForm();
  }

}
