# Iconography

> **CORREGIDO EL 28-07-2026.** Este documento especificaba un sistema de iconos
> basado en Lucide. **Lucide se eliminó del sitio por seguridad**: se cargaba
> desde `https://unpkg.com` sin atributo `integrity`, es decir 358 kB de
> JavaScript ejecutable de un CDN de terceros sin comprobación de integridad, y
> servía a un `IconComponent` que no se usaba en ninguna plantilla. Ver
> `docs/seguridad.md`.
>
> **El sitio v2 no tiene sistema de iconos.** Los únicos glifos que aparecen son
> la flecha `→` de los enlaces de texto (marcado real, con `aria-hidden`), el
> `▾` del desplegable de navegación, la `×` de cerrar, y SVG en línea propios:
> el logotipo, el diagrama de límite de autonomía y el avatar de Aura.
>
> Lo que sigue vigente de este documento son sus PRINCIPIOS, no su
> implementación: construcción geométrica de trazo único, nada de emoji como
> icono funcional o decorativo (regla que se aplicó al eliminar los cuatro
> emoji de la newsletter), y un glifo por concepto en lugar de variedad visual.
>
> Si algún día se reintroduce un sistema de iconos, la condición es que se
> empaquete con el sitio, nunca desde un CDN externo, y que exista una página
> que realmente lo use.

**Objective this document serves:** a real, evidence-based icon system — built on what's actually already loaded on the current site rather than introducing a new dependency, and directly fixing two concrete findings from `docs/website-audit.md`.

## The Starting Fact This Builds On

The current site already loads the Lucide icon library (`main-topbar.component.html`'s `<i data-lucide="message-circle">`, loaded via `<script src="https://unpkg.com/lucide@latest">` in `index.html`). Two things about this are worth naming: it's a genuinely good choice of library (a consistent, well-drawn, open-source line-icon set, appropriate for the restrained direction `design-system.md` calls for) — and it's currently unpinned to a version (`@latest`), which `docs/website-audit.md`'s Performance section flagged as a real risk (an unannounced breaking change could ship straight to production). Website v2's iconography system keeps Lucide and fixes the pinning problem, rather than introducing a new library and creating a second migration cost for no visual benefit.

## Icon Style Rules

- **Line-based only, single consistent stroke weight.** No filled/solid icon variant, no duotone, no gradient fill — matching `design-tokens.md`'s restraint principle and Lucide's own default construction, which already satisfies this.
- **Single color only** — `color.ink` on light surfaces, `color.paper`/white on dark surfaces, `color.signal` only for an icon that is itself an active/interactive control (e.g., inside a `Button` component per `component-library.md`). Never a second accent color applied to an icon just for visual variety.
- **Consistent size grid**, tied directly to `design-tokens.md`'s spacing scale rather than an arbitrary icon-specific size system: 16px (inline with `type.body-sm`/`type.label` text), 24px (default, paired with `type.body`), 32px (section markers, paired with `type.h3`). No other sizes are approved — a fourth size means a broken system, not a design choice.
- **No emoji, ever, as a functional or decorative icon.** This directly closes `docs/website-audit.md`'s specific finding: the current "Qué Resolvemos" section uses raw emoji (⏱️ 🎯 ✓ 🚀 ⚙️ 📊) as card icons, with no `aria-hidden` and no accessible alternative — both a visual-inconsistency problem (emoji rendering varies by OS/browser, breaking the restrained aesthetic unpredictably) and the accessibility problem `docs/website-audit.md` already documented. Every one of those six placements is replaced by a real Lucide glyph under this system.

## Icon Selection Discipline

An icon is chosen for semantic accuracy, not decorative appeal — each of the six practice areas gets exactly one assigned glyph, used consistently everywhere that practice is represented (navigation, service cards, section markers), never swapped for visual variety page to page. This mirrors `design-system.md` Pillar 4's "one system, not six disconnected treatments" principle applied at the icon layer specifically.

| Practice | Assigned glyph concept | Replaces (current site) |
|---|---|---|
| Agentic AI | A bounded-motion glyph (e.g., Lucide's `workflow` or `git-branch`-family mark — precise, geometric, not a robot/circuit cliché) | — (new) |
| People Analytics | A data/chart glyph (`bar-chart-2` or equivalent) | The 📊 emoji in "Decisiones Impulsadas por Datos" |
| Compensation & Total Rewards | A balance/scale glyph (`scale` or equivalent) | — (new) |
| AI Governance | A shield or checkpoint glyph (`shield-check` or equivalent) | The ✓ emoji in "Selección sin Riesgos" |
| Workforce Intelligence | A forward/trend glyph (`trending-up` or equivalent) | — (new) |
| (general speed/efficiency concept) | A clock/motion glyph (`clock` or equivalent) | The ⏱️ emoji in "Contrataciones Más Ágiles" |

Exact Lucide glyph names are a naming-library decision for implementation, not fixed permanently by this document — the *concept* per row is the specified constraint; the closest available real Lucide glyph satisfying that concept is selected at build time.

## Accessibility Rules

- **Every functional icon (inside a button or link with no visible text) has a real accessible name** via `aria-label`, per `component-library.md`'s Button spec.
- **Every purely decorative icon** (one that always appears alongside its own text label, adding no independent meaning) is marked `aria-hidden="true"` — this is the specific, correct fix for the emoji-with-no-`aria-hidden` problem `docs/website-audit.md` found; the fix isn't just "use a real icon instead of an emoji," it's "use a real icon *and* mark it correctly."
- **Icons never carry meaning alone.** Per `design-tokens.md`'s "never color alone" rule extended here: an icon supplementing a status (success/warning/error) always appears with text, never as the sole indicator.

## Implementation Note (Non-Binding on This Document, Flagged for `sprint-01.md`'s Successor)

Pin the Lucide version at build time rather than continuing to load `@latest` — this is a one-line technical fix, not a design decision, but it's recorded here because it's the direct prerequisite for this icon system being reliable: a system built on an unpinned dependency can silently change out from under the very consistency rules this document specifies.

## Cross-Document Consistency Note

Icon color values are exclusively `design-tokens.md`'s existing `color.ink`/`color.paper`/`color.signal` tokens — no new color is introduced for iconography. Icon sizing is exclusively derived from `design-tokens.md`'s spacing scale. The geometric, single-stroke construction logic here is the same visual discipline `logo-principles.md`'s signal mark and `illustration-style.md`'s diagrams use — one construction grammar across mark, icon, and diagram, not three unrelated visual systems.
