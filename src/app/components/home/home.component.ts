import { AfterViewInit, Component, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RevealDirective } from '../../directives/reveal.directive';
import { environment } from '../../../environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
    //MapComponent
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
      { name: 'description', content: 'Datalent Solutions es una consultora especializada en People Analytics, Gobierno del Dato, e IA aplicada a procesos empresariales' },
      { name: 'keywords', content: 'gobierno del dato, people analytics, ia aplicada, Tarancón' },
      { name: 'author', content: 'Datalent Solutions' },
      { rel: 'canonical', href: 'https://www.datalentsolutions.com' }
    ]);
  }
  
  ngAfterViewInit(): void {
    try { lucide.createIcons(); } catch (e) {}
    // Run one update of active link/sticky header on init
    this.renderTrustIndexGoogleReviews();
  }

  private renderTrustIndexGoogleReviews(): void {
    const script = this.renderer.createElement('script');
    script.src = "https://cdn.trustindex.io/loader.js?69a8a5a57a63688be59604730bd";
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(document.getElementById("googleReviews"), script);
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
      from_name: form.value.nombre || '',
      from_email: form.value.email || '',
      company: form.value.empresa || '',
      service_interest: 'Consulta general',
      message: form.value.mensaje || '',
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
