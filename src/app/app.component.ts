import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { MainTopbarComponent } from './components/main-topbar/main-topbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FooterComponent, MainTopbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showCookieBanner = !localStorage.getItem('cookiesDatalentAccepted');

  constructor(private router: Router) {}

  isNewsletterRoute(): boolean {
    return this.router.url.includes('newsletter');
  }

  isFaq(): boolean {
    return this.router.url.includes('faq');
  }

  acceptCookies(): void {
    localStorage.setItem('cookiesDatalentAccepted', 'true');
    this.showCookieBanner = false;
  }

  rejectCookies(): void {
    this.showCookieBanner = false;
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

    if (this.isNewsletterRoute()) {
      current = 'newsletter';
    } else if (this.isFaq()) {
      current = 'faq';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  }
}
