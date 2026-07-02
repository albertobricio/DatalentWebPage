import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavItem } from '../nav-items';
import { CtaComponent } from '../../shared/components/cta/cta.component';

/**
 * See component-library.md's MobileNav spec: aria-expanded on the trigger
 * (owned by HeaderComponent) reflects state accurately; focus is trapped
 * within the open panel; Escape closes it and returns focus to the trigger.
 */
@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterLink, CtaComponent],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  readonly open = input(false);
  readonly items = input.required<readonly NavItem[]>();
  readonly closed = output<void>();

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      if (this.open()) {
        document.body.style.overflow = 'hidden';
        queueMicrotask(() => this.focusFirstElement());
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.tab', ['$event'])
  protected onTab(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }
    const focusable = this.getFocusable();
    if (focusable.length === 0) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected onBackdropClick(): void {
    this.closed.emit();
  }

  protected onLinkClick(): void {
    this.closed.emit();
  }

  private focusFirstElement(): void {
    this.getFocusable()[0]?.focus();
  }

  private getFocusable(): HTMLElement[] {
    const panelEl = this.panel()?.nativeElement;
    if (!panelEl) {
      return [];
    }
    return Array.from(
      panelEl.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  }
}
