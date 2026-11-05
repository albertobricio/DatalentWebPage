import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Decisión de cookies, compartida entre el aviso (AppComponent) y el enlace
 * "Configurar cookies" del pie.
 *
 * Antes la decisión vivía solo en AppComponent y, una vez tomada, no había
 * forma de cambiarla. El RGPD (art. 7.3) exige que retirar el consentimiento
 * sea tan fácil como darlo, así que el pie puede volver a abrir el aviso.
 *
 * 'cookiesDatalentAccepted' es la clave antigua; se sigue leyendo para no
 * volver a preguntar a quien ya aceptó.
 */
@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Si el aviso está a la vista. */
  readonly bannerVisible = signal(this.isBrowser && !this.readConsent());

  /**
   * Sube cada vez que alguien reabre el aviso desde el pie, para que
   * AppComponent le lleve el foco. En la carga inicial vale 0 y el aviso no
   * roba el foco a nadie.
   */
  readonly focusRequest = signal(0);

  accept(): void {
    if (!this.isBrowser) {
      return;
    }
    this.storeConsent('accepted');
    this.bannerVisible.set(false);
    window.gtag?.('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
  }

  reject(): void {
    if (!this.isBrowser) {
      return;
    }
    this.storeConsent('rejected');
    this.bannerVisible.set(false);
    window.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
  }

  /** Vuelve a mostrar el aviso para cambiar la decisión ya tomada. */
  reopen(): void {
    if (!this.isBrowser) {
      return;
    }
    this.bannerVisible.set(true);
    this.focusRequest.update((n) => n + 1);
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
