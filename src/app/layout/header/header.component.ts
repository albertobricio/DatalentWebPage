import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  imports: [RouterLink, RouterLinkActive, CtaComponent, MobileMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly navItems = NAV_ITEMS;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly openDropdown = signal<string | null>(null);

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
