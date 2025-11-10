import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss', '../home/home.component.scss']
})
export class FooterComponent {
    
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

    openNewsletter(): void {
        this.router.navigate(['newsletter']);
    }

    openFaq(): void {
        this.router.navigate(['faq']);
    }
}
