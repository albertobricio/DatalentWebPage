import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AURA_FLOW,
  AURA_INICIO,
  AURA_NOTA_GOBERNANZA,
  AuraAction,
  AuraOption,
  AuraStep,
} from './aura-flow';

interface Turno {
  readonly quien: 'aura' | 'tu';
  readonly lineas: readonly string[];
}

/**
 * Aura, el asistente guiado del sitio.
 *
 * Por qué es determinista y no un modelo de lenguaje: el sitio se sirve
 * estático desde GitHub Pages, sin backend. Una clave de API de un proveedor
 * de modelos es un secreto, y en un bundle de Angular la lee cualquiera. Pero
 * además hay una razón de fondo mejor: este sitio afirma en dos páginas que
 * un chatbot no es un agente y que no usamos «agente» como etiqueta de
 * marketing. Un widget conversacional generativo y sin gobernanza en la home
 * de una firma que vende gobernanza de IA es la contradicción más cara que
 * podríamos permitirnos.
 *
 * Así que Aura hace lo contrario: guion cerrado, respuestas que salen de
 * SITE_FAQ_ITEMS (la misma fuente que /faq), cero generación de texto, cero
 * datos que salgan del navegador, y una nota de gobernanza siempre visible
 * declarando qué es, qué no puede hacer y dónde está la persona. Es el mismo
 * estándar que la práctica de Gobernanza de IA exige a los sistemas de sus
 * clientes, aplicado al propio escaparate.
 *
 * La v1 ya tuvo un botón de chatbot flotante que no abría nada
 * (docs/architecture.md), y la auditoría lo marcó como problema de
 * credibilidad. Este funciona.
 */
@Component({
  selector: 'app-aura',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './aura.component.html',
  styleUrl: './aura.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuraComponent {
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly lanzador = viewChild<ElementRef<HTMLButtonElement>>('lanzador');
  private readonly hilo = viewChild<ElementRef<HTMLElement>>('hilo');

  protected readonly abierto = signal(false);
  protected readonly paso = signal<AuraStep>(this.buscar(AURA_INICIO));
  protected readonly turnos = signal<readonly Turno[]>([]);

  protected readonly nota = AURA_NOTA_GOBERNANZA;

  protected abrir(): void {
    if (this.turnos().length === 0) {
      const inicio = this.buscar(AURA_INICIO);
      this.paso.set(inicio);
      this.turnos.set([{ quien: 'aura', lineas: inicio.says }]);
    }
    this.abierto.set(true);
    // Disparado por un clic, así que estamos en navegador con seguridad.
    setTimeout(() => this.panel()?.nativeElement.focus(), 0);
  }

  protected cerrar(): void {
    this.abierto.set(false);
    setTimeout(() => this.lanzador()?.nativeElement.focus(), 0);
  }

  /** Escape cierra el panel, como cualquier diálogo. */
  @HostListener('document:keydown.escape')
  protected alPulsarEscape(): void {
    if (this.abierto()) this.cerrar();
  }

  protected elegir(opcion: AuraOption): void {
    const siguiente = this.buscar(opcion.nextId);
    this.turnos.update((t) => [
      ...t,
      { quien: 'tu', lineas: [opcion.label] },
      { quien: 'aura', lineas: siguiente.says },
    ]);
    this.paso.set(siguiente);
    this.bajarAlFinal();
  }

  /** Reinicia la conversación sin recargar la página. */
  protected reiniciar(): void {
    const inicio = this.buscar(AURA_INICIO);
    this.paso.set(inicio);
    this.turnos.set([{ quien: 'aura', lineas: inicio.says }]);
    this.bajarAlFinal();
  }

  protected paramsDe(accion: AuraAction): Record<string, string> {
    return accion.motivo ? { motivo: accion.motivo } : {};
  }

  /** Navegar cierra el panel: el visitante ya ha llegado a donde iba. */
  protected alNavegar(): void {
    this.abierto.set(false);
  }

  private bajarAlFinal(): void {
    setTimeout(() => {
      const el = this.hilo()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }

  private buscar(id: string): AuraStep {
    const paso = AURA_FLOW.find((p) => p.id === id);
    // El guion es estático y cerrado, así que esto solo puede fallar por un
    // error de programación al editar aura-flow.ts. Falla ruidosamente en vez
    // de dejar a Aura muda.
    if (!paso) throw new Error(`Aura: no existe el paso "${id}" en AURA_FLOW`);
    return paso;
  }
}
