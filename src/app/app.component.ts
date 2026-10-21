import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { ViewportScroller, isPlatformBrowser } from '@angular/common';
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

  constructor() {
    // El scroll a anclas del router (/servicios#radar) ignora scroll-margin-top
    // y dejaba el destino debajo de la cabecera fija. 96px = cabecera + aire.
    inject(ViewportScroller).setOffset([0, 96]);
  }

  // Antes solo se recordaba "Aceptar": quien rechazaba volvía a ver el aviso
  // en cada carga de página. Ahora se guarda la decisión, sea cual sea.
  // 'cookiesDatalentAccepted' es la clave antigua; se sigue leyendo para no
  // volver a preguntar a quien ya aceptó.
  protected readonly showCookieBanner = signal(this.isBrowser && !this.readConsent());

  protected acceptCookies(): void {
    if (!this.isBrowser) {
      return;
    }
    this.storeConsent('accepted');
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
    this.storeConsent('rejected');
    this.showCookieBanner.set(false);
    window.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
  }

  private readConsent(): string | null {
    try {
      return (
        localStorage.getItem('cookiesDatalentConsent') ??
        (localStorage.getItem('cookiesDatalentAccepted') ? 'accepted' : null)
      );
    } catch {
      // Navegación privada o almacenamiento bloqueado: se vuelve a preguntar.
      return null;
    }
  }

  private storeConsent(value: 'accepted' | 'rejected'): void {
    try {
      localStorage.setItem('cookiesDatalentConsent', value);
    } catch {
      // Sin almacenamiento la decisión vale solo para esta visita.
    }
  }
}
