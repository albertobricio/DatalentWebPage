import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Pillar {
  readonly marker: string;
  readonly name: string;
  readonly statement: string;
}

/**
 * The four positioning pillars (positioning.md), verbatim, in every use.
 * No inputs by design: these statements are canonical and must not drift
 * between pages, so the only way to change them is to edit this file (and
 * positioning.md alongside it) — never to pass different copy per call
 * site. Statements are qualitative and falsifiable, never a percentage,
 * per page-specs.md's Required Evidence rule for Home.
 */
@Component({
  selector: 'app-pillar-proof-block',
  standalone: true,
  templateUrl: './pillar-proof-block.component.html',
  styleUrl: './pillar-proof-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PillarProofBlockComponent {
  protected readonly pillars: readonly Pillar[] = [
    {
      marker: '01',
      name: 'Autonomía gobernada',
      statement:
        'Cada agente opera con límites de autonomía documentados y un punto de control humano.',
    },
    {
      marker: '02',
      name: 'Diseñado en Europa',
      statement: 'Datos alojados y gobernados bajo marco europeo, RGPD y EU AI Act.',
    },
    {
      marker: '03',
      // Sprint 7 honesty pass: this previously read "Cada cuenta liderada por
      // un experto senior del área", which implies a bench of area
      // specialists. Datalent is currently a single practitioner operating as
      // autónoma, pre-incorporation, so that claim asserted a scale that does
      // not exist — the same class of problem as the fabricated statistics
      // removed elsewhere in this sprint, and especially costly for a firm
      // whose product is regulatory trust. The honest version is also the
      // stronger one: no hand-off, no junior layer, ever.
      name: 'Criterio senior, trato directo',
      statement: 'Trabajas siempre con quien diseña y ejecuta. Sin equipos junior de por medio.',
    },
    {
      marker: '04',
      name: 'Ciclo de vida del talento, integrado',
      statement: 'Seis prácticas, un solo sistema.',
    },
  ];
}
