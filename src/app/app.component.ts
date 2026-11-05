import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { AuraComponent } from './shared/aura/aura.component';
import { CookieConsentService } from './shared/cookie-consent.service';

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
  // La decisión de cookies vive en CookieConsentService para que el enlace
  // "Configurar cookies" del pie pueda volver a abrir el aviso. Antes solo se
  // recordaba "Aceptar"; ahora se guarda la decisión, sea cual sea.
  private readonly consent = inject(CookieConsentService);
  protected readonly showCookieBanner = this.consent.bannerVisible;

  private readonly cookieBanner = viewChild<ElementRef<HTMLElement>>('cookieBanner');

  constructor() {
    // El scroll a anclas del router (/servicios#radar) ignora scroll-margin-top
    // y dejaba el destino debajo de la cabecera fija. 96px = cabecera + aire.
    inject(ViewportScroller).setOffset([0, 96]);

    // Al reabrir el aviso desde el pie, el foco va al aviso: si no, quien
    // navega con teclado o lector de pantalla no sabría que ha aparecido.
    effect(() => {
      if (this.consent.focusRequest() > 0) {
        this.cookieBanner()?.nativeElement.focus();
      }
    });
  }

  protected acceptCookies(): void {
    this.consent.accept();
  }

  protected rejectCookies(): void {
    this.consent.reject();
  }
}
