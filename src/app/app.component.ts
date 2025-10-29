import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  showCookieBanner = localStorage.getItem('cookiesDatalentAccepted') === null;

  acceptCookies() {
    localStorage.setItem('cookiesDatalentAccepted', 'true');
    this.showCookieBanner = false;
  }
}
