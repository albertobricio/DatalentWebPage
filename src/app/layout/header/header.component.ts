import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { NAV_ITEMS } from '../nav-items';
import { CtaComponent } from '../../shared/components/cta/cta.component';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';

/**
 * Sticky site header. Desktop: wordmark, full nav with disclosure dropdowns
 * for Servicios/Recursos, both persistent CTAs (site-map.md's "Primary CTA
 * Placement"). Mobile: wordmark + hamburger trigger only, CTAs live inside
 * the mobile menu panel to keep the bar compact.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CtaComponent, MobileMenuComponent, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly navItems = NAV_ITEMS;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly openDropdown = signal<string | null>(null);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);

  /**
   * "Soluciones" es un botón que abre un desplegable, no un enlace, así que
   * routerLinkActive no puede marcarlo. Sin esto, en cualquier página de
   * /servicios la cabecera no indicaba en qué sección estaba el visitante.
   */
  protected readonly inServices = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/servicios')),
    ),
    { initialValue: false },
  );

  /** Escape cierra el desplegable, como cualquier menú. */
  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeDropdowns();
  }

  /** Un clic fuera de la cabecera también lo cierra; antes se quedaba abierto. */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.openDropdown() && !this.host.nativeElement.contains(event.target as Node)) {
      this.closeDropdowns();
    }
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected toggleDropdown(label: string): void {
    this.openDropdown.update((current) => (current === label ? null : label));
  }

  protected closeDropdowns(): void {
    this.openDropdown.set(null);
  }
}
