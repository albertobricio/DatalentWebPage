import { Component } from '@angular/core';
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

  acceptCookies(): void {
    localStorage.setItem('cookiesDatalentAccepted', 'true');
    this.showCookieBanner = false;
  }

  rejectCookies(): void {
    this.showCookieBanner = false;
  }
}
