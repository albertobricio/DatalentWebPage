import { AfterViewInit, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RevealDirective } from './reveal.directive';

declare const lucide: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  mobileMenuOpen = false;
  formStatus = '';

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

  async onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.formStatus = 'Enviando...';
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      this.formStatus = '¡Gracias! Tu mensaje ha sido enviado exitosamente.';
      form.resetForm();
      try { lucide.createIcons(); } catch (e) {}
    } catch (err) {
      this.formStatus = 'Error al enviar el formulario.';
    }
  }
}
