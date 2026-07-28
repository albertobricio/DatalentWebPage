import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { AuraComponent } from './shared/aura/aura.component';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ButtonComponent, AuraComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly showCookieBanner = signal(
    this.isBrowser && !localStorage.getItem('cookiesDatalentAccepted'),
  );

  protected acceptCookies(): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem('cookiesDatalentAccepted', 'true');
    this.showCookieBanner.set(false);
    window.gtag?.('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
  }

  protected rejectCookies(): void {
    if (!this.isBrowser) {
      return;
    }
    this.showCookieBanner.set(false);
    window.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
  }
}
