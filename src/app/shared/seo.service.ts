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
}

const ORIGIN = 'https://datalentsolutions.com';

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
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

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
    this.setJsonLd(cfg.jsonLd);
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

  private setJsonLd(data: SeoConfig['jsonLd']): void {
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
