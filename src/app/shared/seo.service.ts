import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  /** Full <title>. */
  readonly title: string;
  readonly description: string;
  readonly keywords?: string;
  /** Route path with leading slash, e.g. '/servicios/people-analytics'. Drives canonical + og:url. */
  readonly path: string;
  /** Defaults to `title` when omitted. */
  readonly ogTitle?: string;
  /** Defaults to `description` when omitted. */
  readonly ogDescription?: string;
  /** Page-level structured data (Service, ContactPage…). The site-wide Organization block lives in index.html. */
  readonly jsonLd?: Record<string, unknown>;
  /**
   * La misma lista que pinta <app-breadcrumb>. Con ella se emite un
   * BreadcrumbList, que es lo que permite al buscador mostrar la ruta
   * ("Soluciones > Gobernanza de IA") en lugar de la URL en el resultado.
   */
  readonly breadcrumbs?: readonly SeoBreadcrumb[];
  /**
   * Las preguntas que la página muestra en su acordeón. Se emiten como
   * FAQPage. Solo deben pasarse preguntas visibles en la página: marcar
   * contenido que el visitante no ve incumple las directrices de datos
   * estructurados.
   */
  readonly faq?: readonly SeoFaq[];
  /** Para páginas que no deben indexarse (la de error 404). */
  readonly noindex?: boolean;
}

export interface SeoBreadcrumb {
  readonly label: string;
  readonly url?: string;
}

export interface SeoFaq {
  readonly question: string;
  /** Puede traer HTML; se convierte a texto plano antes de emitirlo. */
  readonly answer: string;
}

const ORIGIN = 'https://datalentsolutions.com';

/**
 * La directiva de index.html. Antes `set()` la sustituía por un escueto
 * "index, follow" en cuanto arrancaba cualquier página, con lo que se perdían
 * max-snippet y max-image-preview: los permisos que dejan al buscador mostrar
 * un fragmento largo y la imagen grande en el resultado.
 */
const ROBOTS_INDEX =
  'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

/** Deja en texto plano una respuesta del FAQ escrita con marcado. */
function toPlainText(html: string): string {
  return html
    .replace(/<\/(p|li|blockquote)>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * One place that owns every per-page SEO tag.
 *
 * Why this exists (Sprint 7): canonical handling had been added ad hoc to
 * only two pages, so the other eight served the index.html canonical —
 * `<link rel="canonical" href="https://datalentsolutions.com">` — which
 * tells Google that /faq, /contacto, /newsletter and three service pages are
 * duplicates of the homepage and should be dropped from the index. That is
 * worse than having no canonical at all. It was largely inert while nothing
 * was prerendered; prerendering bakes it into static HTML where crawlers
 * definitely honour it, so it had to be fixed at the same time.
 *
 * It also collapses six near-identical copies of the JSON-LD injection code
 * and two of the canonical code that had accumulated across Sprints 3-6.
 *
 * Page-level JSON-LD is replaced on every `set()` rather than cleaned up in
 * each component's ngOnDestroy — every routed page calls `set()`, so the
 * previous page's block can never survive a navigation, and that removes the
 * OnDestroy boilerplate from six components.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  private static readonly JSON_LD_ID = 'page-structured-data';

  set(cfg: SeoConfig): void {
    const url = `${ORIGIN}${cfg.path === '/' ? '' : cfg.path}`;

    this.titleService.setTitle(cfg.title);
    this.meta.updateTag({ name: 'description', content: cfg.description });
    if (cfg.keywords) {
      this.meta.updateTag({ name: 'keywords', content: cfg.keywords });
    }
    this.meta.updateTag({
      name: 'robots',
      content: cfg.noindex ? 'noindex, follow' : ROBOTS_INDEX,
    });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: cfg.ogTitle ?? cfg.title });
    this.meta.updateTag({
      property: 'og:description',
      content: cfg.ogDescription ?? cfg.description,
    });
    this.meta.updateTag({ property: 'og:url', content: url });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: cfg.ogTitle ?? cfg.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: cfg.ogDescription ?? cfg.description,
    });

    this.setCanonical(url);
    this.setJsonLd(this.buildJsonLd(cfg, url));
  }

  /**
   * Junta en un solo bloque los datos propios de la página, las migas y las
   * preguntas frecuentes. Con más de un nodo se emite un @graph, que es la
   * forma de declarar varias entidades en un mismo script sin repetir
   * @context ni depender de varios <script> con el mismo id.
   */
  private buildJsonLd(cfg: SeoConfig, url: string): Record<string, unknown> | undefined {
    const nodes: Record<string, unknown>[] = [];

    if (cfg.jsonLd) {
      const { '@context': _context, ...node } = cfg.jsonLd;
      nodes.push({ url, ...node });
    }

    if (cfg.breadcrumbs && cfg.breadcrumbs.length > 1) {
      nodes.push({
        '@type': 'BreadcrumbList',
        itemListElement: cfg.breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.label,
          // El último elemento es la página actual, lleve o no `url`.
          item:
            index === cfg.breadcrumbs!.length - 1 || !crumb.url
              ? url
              : `${ORIGIN}${crumb.url === '/' ? '/' : crumb.url}`,
        })),
      });
    }

    if (cfg.faq?.length) {
      nodes.push({
        '@type': 'FAQPage',
        mainEntity: cfg.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: toPlainText(item.answer) },
        })),
      });
    }

    if (nodes.length === 0) {
      return undefined;
    }
    return nodes.length === 1
      ? { '@context': 'https://schema.org', ...nodes[0] }
      : { '@context': 'https://schema.org', '@graph': nodes };
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data: Record<string, unknown> | undefined): void {
    const existing = this.doc.getElementById(SeoService.JSON_LD_ID);
    if (existing) {
      existing.remove();
    }
    if (!data) {
      return;
    }
    const script = this.doc.createElement('script');
    script.id = SeoService.JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}
