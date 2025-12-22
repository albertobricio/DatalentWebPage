import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-main-topbar',
  imports: [CommonModule],
  templateUrl: './main-topbar.component.html',
  styleUrls: ['./main-topbar.component.scss', '../home/home.component.scss']
})
export class MainTopbarComponent {
  mobileMenuOpen = false;
  private router = inject(Router);

  scrollToSection(sectionId: string) {
    this.router.navigate(['/']);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  openNewsletter(): void {
    this.router.navigate(['newsletter']);
  }

  isNewsletterRoute(): boolean {
    return this.router.url === '/newsletter';
  }
  
  openfaq(): void {
    this.router.navigate(['faq']);
  }

  isfaq(): boolean {
    return this.router.url === '/faq';
  }

  openf(section: string): void {
    console.log(`Opening section: ${section}`);

    const el = document.querySelector(`[data-section="${section}"]`);
    if (el) {
      (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`No se encontró el elemento con data-section="${section}"`);
    }
  }
}
