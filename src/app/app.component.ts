import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
  private readonly main = viewChild<ElementRef<HTMLElement>>('main');

  constructor() {
    // El scroll a anclas del router (/servicios#radar) ignora scroll-margin-top
    // y dejaba el destino debajo de la cabecera fija. 96px = cabecera + aire.
    inject(ViewportScroller).setOffset([0, 96]);

    // En una SPA, cambiar de ruta no recarga el documento: el foco se queda
    // en el enlace pulsado (a menudo ya fuera de pantalla, en el pie) y un
    // lector de pantalla no anuncia nada. Tras cada navegación el foco pasa
    // al <main>, que es donde empieza la página nueva. La primera carga se
    // salta para no robar el foco al llegar, y las navegaciones a un ancla
    // también, porque de esas se ocupa anchorScrolling.
    const router = inject(Router);
    let firstNavigation = true;
    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (firstNavigation) {
          firstNavigation = false;
          return;
        }
        if (router.parseUrl(event.urlAfterRedirects).fragment) {
          return;
        }
        this.main()?.nativeElement.focus({ preventScroll: true });
      });

    // Mientras el aviso está a la vista, su altura se publica como variable
    // CSS en <html>. _base.scss la usa en scroll-padding-bottom para que el
    // navegador, al llevar el foco a un campo con el tabulador, lo deje por
    // encima del aviso y no debajo (WCAG 2.2, criterio 2.4.11, foco no
    // oculto). La altura cambia con el ancho de pantalla, de ahí el
    // ResizeObserver en lugar de un valor fijo.
    const root = inject(DOCUMENT).documentElement;
    effect((onCleanup) => {
      const banner = this.cookieBanner()?.nativeElement;
      if (!banner || typeof ResizeObserver === 'undefined') {
        return;
      }
      const observer = new ResizeObserver(() => {
        // Un elemento ya retirado del documento mide 0: no es una altura.
        if (!banner.isConnected) {
          return;
        }
        root.style.setProperty(
          '--cookie-banner-height',
          `${Math.ceil(banner.getBoundingClientRect().height)}px`,
        );
      });
      observer.observe(banner);
      onCleanup(() => {
        observer.disconnect();
        root.style.removeProperty('--cookie-banner-height');
      });
    });

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
