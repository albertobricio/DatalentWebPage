import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-main-topbar',
  imports: [CommonModule],
  templateUrl: './main-topbar.component.html',
  styleUrls: ['./main-topbar.component.scss', '../home/home.component.scss']
})
export class MainTopbarComponent {
    mobileMenuOpen = false;

    scrollToSection(sectionId: string) {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen = false;
    }
}
