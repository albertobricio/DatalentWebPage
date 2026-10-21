import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DotsCanvasComponent, DotsVariant } from '../dots-canvas/dots-canvas.component';

interface PillarLink {
  readonly label: string;
  readonly path: string;
}

interface Pillar {
  readonly variant: DotsVariant;
  readonly name: string;
  readonly engine: string;
  readonly claim: string;
  readonly description: string;
  /** Riesgo y punto de control humano: regla 3 de .claude/CLAUDE.md. */
  readonly governance: string;
  readonly primary: PillarLink;
  readonly related?: readonly PillarLink[];
}

/**
 * Las cuatro soluciones (Flow, Match, Radar, Shield) que sustituyen a la
 * parrilla de cinco prácticas en Home y en /servicios.
 *
 * Las URL de servicio no cambian: cada solución enlaza a las páginas de
 * práctica existentes, que son las que posicionan y llevan el schema Service.
 * Radar agrupa tres de ellas (People Analytics, Compensación y Workforce
 * Intelligence), así que enlaza a las tres.
 *
 * Copy: el brief pedía "filtrado de candidatos sin sesgos cognitivos". No se
 * puede prometer ausencia de sesgo, y el cribado es alto riesgo en el Anexo
 * III del Reglamento de IA; se dice lo que sí se hace (auditoría de sesgo,
 * decisión final humana).
 */
@Component({
  selector: 'app-service-pillars',
  standalone: true,
  imports: [RouterLink, DotsCanvasComponent],
  templateUrl: './service-pillars.component.html',
  styleUrl: './service-pillars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePillarsComponent {
  readonly heading = input('Cuatro soluciones, un mismo estándar de gobernanza');

  protected readonly pillars: readonly Pillar[] = [
    {
      variant: 'flow',
      name: 'Datalent Flow',
      engine: 'HR FlowEngine',
      claim: 'Flujos de trabajo agénticos e inteligencia operativa interna.',
      description:
        'Agentes que resuelven de principio a fin trámites, consultas internas, onboarding y operaciones de RR. HH. dentro de límites de autonomía documentados, y que escalan a una persona cada excepción y cada decisión que afecta a alguien.',
      governance: 'Riesgo clasificado por flujo antes de desplegar · Human-in-the-loop',
      primary: { label: 'Ver Agentic AI para RR. HH.', path: '/servicios/agentic-ai-rrhh' },
    },
    {
      variant: 'match',
      name: 'Datalent Match',
      engine: 'TalentScope',
      claim: 'Reclutamiento agéntico y selección de precisión.',
      description:
        'Atracción, cribado y evaluaciones conversacionales con criterios explícitos y auditoría de sesgo antes y durante el uso, para acortar los tiempos de contratación sin delegar la decisión.',
      governance: 'Alto riesgo (Anexo III, Reglamento de IA) · La decisión final es siempre humana',
      primary: { label: 'Ver Agentic AI para RR. HH.', path: '/servicios/agentic-ai-rrhh' },
    },
    {
      variant: 'radar',
      name: 'Datalent Radar',
      engine: 'PeopleRadar',
      claim: 'People Analytics y planificación estratégica de plantilla.',
      description:
        'Diagnósticos de compromiso, clima y equidad retributiva, y simulación de escenarios de plantilla, con la metodología y el linaje de los datos a la vista para decidir con evidencia.',
      governance: 'Metodología documentada · Nunca un único escenario presentado como certeza',
      primary: { label: 'Ver People Analytics', path: '/servicios/people-analytics' },
      related: [
        { label: 'Compensación', path: '/servicios/compensacion-total-rewards' },
        { label: 'Workforce Intelligence', path: '/servicios/workforce-intelligence' },
      ],
    },
    {
      variant: 'shield',
      name: 'Datalent Shield',
      engine: 'EthicShield',
      claim: 'Auditoría, gobernanza y cumplimiento normativo en IA.',
      description:
        'Clasificación de riesgo, auditoría ética y de sesgo, y adecuación legal de los sistemas de IA de RR. HH., propios o de proveedor, conforme al Reglamento (UE) 2024/1689 de IA y al RGPD.',
      governance: 'El punto de entrada más rápido: la clasificación de riesgo de un sistema concreto',
      primary: { label: 'Ver Gobernanza de IA', path: '/servicios/gobernanza-ia' },
    },
  ];

  protected onPointerMove(event: PointerEvent, canvas: DotsCanvasComponent): void {
    canvas.setPointer(event.clientX, event.clientY);
  }
}
