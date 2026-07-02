import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

/**
 * Real breadcrumb trail, replacing the current site's hidden, always-static
 * "Inicio"-only block. See component-library.md's BreadcrumbComponent spec.
 * The last item in `items` is treated as the current page (rendered as
 * text with aria-current="page", never a link) regardless of whether it
 * carries a `url`.
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly items = input.required<BreadcrumbItem[]>();
}
