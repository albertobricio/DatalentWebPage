import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NgIf],
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
