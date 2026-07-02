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
      name: 'Criterio senior, escala boutique',
      statement: 'Cada cuenta liderada por un experto senior del área.',
    },
    {
      marker: '04',
      name: 'Ciclo de vida del talento, integrado',
      statement: 'Seis prácticas, un solo sistema.',
    },
  ];
}
