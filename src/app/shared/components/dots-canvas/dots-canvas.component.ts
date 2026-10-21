import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type DotsVariant = 'flow' | 'match' | 'radar' | 'shield' | 'field';

interface Dot {
  /** Posición final, en unidades normalizadas 0–1 del canvas. */
  readonly x: number;
  readonly y: number;
  /** Desplazamiento de partida mientras la tarjeta entra en pantalla. */
  readonly sx: number;
  readonly sy: number;
  readonly r: number;
  /** Fase propia, para que no parpadeen todos a la vez. */
  readonly phase: number;
}

interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/**
 * Micro-canvas de puntos de las tarjetas de solución (Flow, Match, Radar,
 * Shield) y, con la variante `field`, la constelación del hero de Home. Canvas 2D sin dependencias: la CSP es `script-src 'self'` y una
 * librería 3D para cuatro ilustraciones de 160px no compensaba su peso.
 *
 * Reacciona a dos cosas:
 *  · Scroll: los puntos llegan dispersos y se ensamblan en su figura a medida
 *    que la tarjeta entra en el viewport.
 *  · Cursor: cada variante tiene su respuesta (acelera el flujo, estrecha el
 *    cono, sigue el barrido, abre una onda en la malla).
 *
 * Solo anima mientras es visible (IntersectionObserver). Con
 * prefers-reduced-motion dibuja un único fotograma ya ensamblado y no vuelve
 * a pintar. En el prerender (Puppeteer) el canvas sale vacío, que es lo
 * correcto: es decorativo y va con aria-hidden.
 */
@Component({
  selector: 'app-dots-canvas',
  standalone: true,
  template: `<canvas #canvas class="dots-canvas" aria-hidden="true"></canvas>`,
  styleUrl: './dots-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotsCanvasComponent {
  readonly variant = input.required<DotsVariant>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  private ctx: CanvasRenderingContext2D | null = null;
  private width = 0;
  private height = 0;
  private dots: Dot[] = [];
  private base: Rgb = { r: 165, g: 160, b: 143 };
  private accent: Rgb = { r: 147, g: 170, b: 222 };

  private pointer: { x: number; y: number } | null = null;
  /** 0 = reposo, 1 = cursor encima. Se suaviza para que no haya saltos. */
  private hover = 0;
  private hoverTarget = 0;
  /** 0 = puntos dispersos, 1 = figura ensamblada. Lo marca el scroll. */
  private assembly = 0;
  private time = 0;
  private lastFrame = 0;
  private frameId = 0;
  private visible = false;
  private reducedMotion = false;

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    afterNextRender(() => this.init());
  }

  /** La tarjeta contenedora reenvía aquí el cursor; las coordenadas son de viewport. */
  setPointer(clientX: number, clientY: number): void {
    const rect = this.canvasRef().nativeElement.getBoundingClientRect();
    this.pointer = {
      x: (clientX - rect.left) / Math.max(rect.width, 1),
      y: (clientY - rect.top) / Math.max(rect.height, 1),
    };
    this.hoverTarget = 1;
  }

  clearPointer(): void {
    this.pointer = null;
    this.hoverTarget = 0;
  }

  private init(): void {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) {
      return;
    }

    const style = getComputedStyle(canvas);
    this.base = parseColor(style.getPropertyValue('--dots-base')) ?? this.base;
    this.accent = parseColor(style.getPropertyValue('--dots-accent')) ?? this.accent;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = motionQuery.matches;

    this.dots = buildDots(this.variant());

    const resize = new ResizeObserver(() => {
      this.resize();
      if (this.reducedMotion || !this.visible) {
        this.renderStatic();
      }
    });
    resize.observe(canvas);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible && !this.reducedMotion) {
          this.start();
        } else {
          this.stop();
        }
      },
      { rootMargin: '80px' },
    );
    intersection.observe(canvas);

    this.destroyRef.onDestroy(() => {
      this.stop();
      resize.disconnect();
      intersection.disconnect();
    });

    this.resize();
    this.renderStatic();
  }

  private resize(): void {
    const canvas = this.canvasRef().nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private renderStatic(): void {
    this.assembly = 1;
    this.draw();
  }

  private start(): void {
    if (this.frameId) {
      return;
    }
    this.lastFrame = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - this.lastFrame) / 1000, 0.05);
      this.lastFrame = now;
      this.time += dt;
      this.hover += (this.hoverTarget - this.hover) * Math.min(dt * 6, 1);
      this.assembly += (this.scrollProgress() - this.assembly) * Math.min(dt * 4, 1);
      this.draw();
      this.frameId = requestAnimationFrame(loop);
    };
    this.frameId = requestAnimationFrame(loop);
  }

  private stop(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }
  }

  /** 0 cuando la tarjeta asoma por abajo, 1 cuando ha subido un 45 % del viewport. */
  private scrollProgress(): number {
    const rect = this.canvasRef().nativeElement.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    return clamp((vh - rect.top) / (vh * 0.45), 0, 1);
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx || !this.width || !this.height) {
      return;
    }
    ctx.clearRect(0, 0, this.width, this.height);
    switch (this.variant()) {
      case 'flow':
        this.drawFlow(ctx);
        break;
      case 'match':
        this.drawMatch(ctx);
        break;
      case 'radar':
        this.drawRadar(ctx);
        break;
      case 'shield':
        this.drawShield(ctx);
        break;
      case 'field':
        this.drawField(ctx);
        break;
    }
  }

  // ── Posicionado común ────────────────────────────────────────────────

  /** Pasa una posición normalizada a píxeles, encajada en un área cuadrada centrada. */
  private px(x: number, y: number): [number, number] {
    const size = Math.min(this.width, this.height);
    const ox = (this.width - size) / 2;
    const oy = (this.height - size) / 2;
    return [ox + x * size, oy + y * size];
  }

  private dotPosition(d: Dot): [number, number] {
    const spread = 1 - easeOutCubic(this.assembly);
    return this.px(d.x + d.sx * spread, d.y + d.sy * spread);
  }

  private pointerDistance(x: number, y: number): number {
    if (!this.pointer) {
      return Infinity;
    }
    const size = Math.min(this.width, this.height);
    const cx = this.pointer.x * this.width;
    const cy = this.pointer.y * this.height;
    return Math.hypot(x - cx, y - cy) / size;
  }

  private fill(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, mix: number, alpha: number): void {
    const c = mixRgb(this.base, this.accent, clamp(mix, 0, 1));
    ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${clamp(alpha, 0, 1) * this.assemblyAlpha()})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  private assemblyAlpha(): number {
    return 0.25 + 0.75 * this.assembly;
  }

  // ── Flow: red de nodos con paquetes que recorren las aristas ─────────

  private drawFlow(ctx: CanvasRenderingContext2D): void {
    const nodes = FLOW_NODES.map(([x, y], i) => {
      const d = this.dots[i];
      const [nx, ny] = this.dotPosition({ ...d, x, y });
      return { x: nx, y: ny };
    });

    // Aristas punteadas.
    for (const [a, b] of FLOW_EDGES) {
      const from = nodes[a];
      const to = nodes[b];
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      const steps = Math.max(Math.floor(length / 7), 1);
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        this.fill(ctx, lerp(from.x, to.x, t), lerp(from.y, to.y, t), 0.9, 0, 0.45);
      }
    }

    // Paquetes en tránsito: más rápidos y más numerosos con el cursor encima.
    const speed = 0.22 + this.hover * 0.55;
    FLOW_EDGES.forEach(([a, b], edgeIndex) => {
      const from = nodes[a];
      const to = nodes[b];
      const packets = 1 + Math.round(this.hover);
      for (let p = 0; p < packets; p++) {
        const t = (this.time * speed + edgeIndex * 0.37 + p / packets) % 1;
        this.fill(ctx, lerp(from.x, to.x, t), lerp(from.y, to.y, t), 2, 1, 0.95);
      }
    });

    // Nodos: se encienden al acercar el cursor.
    nodes.forEach((n, i) => {
      const near = 1 - clamp(this.pointerDistance(n.x, n.y) / 0.35, 0, 1);
      const pulse = 0.5 + 0.5 * Math.sin(this.time * 2 + this.dots[i].phase);
      this.fill(ctx, n.x, n.y, 4 + near * 2.5, 0.35 + near * 0.65, 0.85);
      this.fill(ctx, n.x, n.y, 7 + pulse * 3 + near * 4, 1, 0.08 + near * 0.18);
    });
  }

  // ── Match: los puntos convergen en un foco ───────────────────────────

  private drawMatch(ctx: CanvasRenderingContext2D): void {
    const [fx, fy] = this.px(0.5, 0.8);
    // Con hover el cono se estrecha y el flujo hacia el foco se acelera.
    const narrow = 1 - this.hover * 0.45;
    const speed = 0.12 + this.hover * 0.3;

    for (const d of this.dots) {
      const t = (this.time * speed + d.phase) % 1;
      const startX = 0.5 + (d.x - 0.5) * narrow;
      const [sx, sy] = this.dotPosition({ ...d, x: startX, y: d.y });
      const eased = t * t;
      let x = lerp(sx, fx, eased);
      let y = lerp(sy, fy, eased);

      // Atracción suave hacia el cursor.
      if (this.pointer) {
        const near = 1 - clamp(this.pointerDistance(x, y) / 0.3, 0, 1);
        x = lerp(x, this.pointer.x * this.width, near * 0.25);
        y = lerp(y, this.pointer.y * this.height, near * 0.25);
      }
      this.fill(ctx, x, y, d.r * (1 - eased * 0.4), eased, 0.3 + eased * 0.6);
    }

    // Foco con anillo que late.
    const pulse = 0.5 + 0.5 * Math.sin(this.time * 3);
    this.fill(ctx, fx, fy, 5 + this.hover * 1.5, 1, 1);
    ctx.strokeStyle = rgba(this.accent, (0.25 + pulse * 0.35) * this.assemblyAlpha());
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(fx, fy, 10 + pulse * 4 + this.hover * 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ── Radar: anillos de puntos que se encienden al paso del barrido ────

  private drawRadar(ctx: CanvasRenderingContext2D): void {
    const [cx, cy] = this.px(0.5, 0.5);
    const size = Math.min(this.width, this.height);
    let sweep = (this.time * (0.9 + this.hover * 1.6)) % (Math.PI * 2);
    // Con el cursor encima, el barrido se orienta hacia él.
    if (this.pointer) {
      const target = Math.atan2(this.pointer.y * this.height - cy, this.pointer.x * this.width - cx);
      sweep = lerpAngle(sweep, target, this.hover * 0.6);
    }

    for (const d of this.dots) {
      const [x, y] = this.dotPosition(d);
      const angle = Math.atan2(y - cy, x - cx);
      // Distancia angular por detrás del barrido: brilla justo al pasar y se apaga después.
      const behind = (sweep - angle + Math.PI * 4) % (Math.PI * 2);
      const glow = Math.max(0, 1 - behind / 1.6);
      this.fill(ctx, x, y, d.r + glow * 1.4, glow, 0.4 + glow * 0.6);
    }

    // Línea del barrido.
    const radius = size * 0.44;
    ctx.strokeStyle = rgba(this.accent, 0.55 * this.assemblyAlpha());
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweep) * radius, cy + Math.sin(sweep) * radius);
    ctx.stroke();
    this.fill(ctx, cx, cy, 3.5, 1, 1);
  }

  // ── Shield: malla hexagonal en forma de escudo con onda ──────────────

  private drawShield(ctx: CanvasRenderingContext2D): void {
    const origin = this.pointer
      ? { x: this.pointer.x * this.width, y: this.pointer.y * this.height }
      : (() => {
          const [x, y] = this.px(0.5, 0.42);
          return { x, y };
        })();
    const size = Math.min(this.width, this.height);
    const speed = 1.6 + this.hover * 2.2;
    const amplitude = 0.35 + this.hover * 0.65;

    for (const d of this.dots) {
      const [x, y] = this.dotPosition(d);
      const dist = Math.hypot(x - origin.x, y - origin.y) / size;
      const wave = Math.max(0, Math.sin(dist * 18 - this.time * speed));
      const lift = wave * amplitude;
      this.fill(ctx, x, y, d.r + lift * 1.2, lift, 0.45 + lift * 0.55);
    }
  }

  // ── Field: constelación del hero ──────────────────────────────────────
  // Ocupa todo el rectángulo (no el cuadrado centrado de las tarjetas). Los
  // puntos derivan despacio, se enlazan con sus vecinos cercanos y, con el
  // cursor, se acercan a él y le tienden enlaces.

  private drawField(ctx: CanvasRenderingContext2D): void {
    const spread = 1 - easeOutCubic(this.assembly);
    const unit = Math.max(this.width, this.height);
    const pointer = this.pointer
      ? { x: this.pointer.x * this.width, y: this.pointer.y * this.height }
      : null;

    const points = this.dots.map((d) => {
      const driftX = Math.sin(this.time * 0.35 + d.phase * 6.28) * 0.012;
      const driftY = Math.cos(this.time * 0.3 + d.phase * 6.28) * 0.012;
      let x = (d.x + driftX + d.sx * spread) * this.width;
      let y = (d.y + driftY + d.sy * spread) * this.height;
      let near = 0;
      if (pointer) {
        const dist = Math.hypot(x - pointer.x, y - pointer.y) / unit;
        near = (1 - clamp(dist / 0.22, 0, 1)) * this.hover;
        x = lerp(x, pointer.x, near * 0.18);
        y = lerp(y, pointer.y, near * 0.18);
      }
      return { x, y, r: d.r, near };
    });

    const linkDistance = unit * 0.13;
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > linkDistance) {
          continue;
        }
        const strength = 1 - dist / linkDistance;
        const lit = Math.max(a.near, b.near);
        ctx.strokeStyle = rgba(
          mixRgb(this.base, this.accent, lit),
          (0.18 + lit * 0.35) * strength * this.assemblyAlpha(),
        );
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    if (pointer) {
      for (const p of points) {
        if (p.near > 0.05) {
          ctx.strokeStyle = rgba(this.accent, p.near * 0.45 * this.assemblyAlpha());
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }

    points.forEach((p, i) => {
      // Uno de cada nueve puntos es un "agente": acento fijo y pulso propio.
      const agent = i % 9 === 4;
      const pulse = agent ? 0.5 + 0.5 * Math.sin(this.time * 2 + this.dots[i].phase * 6.28) : 0;
      const mix = agent ? 1 : p.near;
      this.fill(ctx, p.x, p.y, p.r + (agent ? 1.2 + pulse : 0) + p.near * 1.5, mix, 0.45 + mix * 0.5);
    });
  }
}

// ── Geometría de cada variante ─────────────────────────────────────────

const FLOW_NODES: readonly (readonly [number, number])[] = [
  [0.22, 0.28],
  [0.5, 0.2],
  [0.78, 0.28],
  [0.14, 0.72],
  [0.5, 0.58],
  [0.86, 0.72],
];

const FLOW_EDGES: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [2, 5],
  [3, 4],
  [4, 5],
  [1, 4],
];

function buildDots(variant: DotsVariant): Dot[] {
  const random = seeded(variant.length * 9973 + variant.charCodeAt(0));
  const make = (x: number, y: number, r: number): Dot => ({
    x,
    y,
    sx: (random() - 0.5) * 0.9,
    sy: (random() - 0.5) * 0.9,
    r,
    phase: random(),
  });

  switch (variant) {
    case 'flow':
      return FLOW_NODES.map(([x, y]) => make(x, y, 4));

    case 'match': {
      // Puntos de arranque repartidos por la boca del cono.
      const dots: Dot[] = [];
      for (let i = 0; i < 46; i++) {
        dots.push(make(0.08 + random() * 0.84, 0.05 + random() * 0.18, 1.4 + random() * 1.1));
      }
      return dots;
    }

    case 'radar': {
      const dots: Dot[] = [];
      [0.14, 0.24, 0.34, 0.43].forEach((radius, ring) => {
        const count = 10 + ring * 7;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2 + ring * 0.3;
          dots.push(make(0.5 + Math.cos(a) * radius, 0.5 + Math.sin(a) * radius, 1.3));
        }
      });
      return dots;
    }

    case 'field': {
      // Rejilla con jitter: cubre el área de forma pareja sin verse cuadriculada.
      const dots: Dot[] = [];
      const cols = 13;
      const rows = 9;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col + 0.5 + (random() - 0.5) * 0.8) / cols;
          const y = (row + 0.5 + (random() - 0.5) * 0.8) / rows;
          dots.push(make(x, y, 1.2 + random() * 1.3));
        }
      }
      return dots;
    }

    case 'shield': {
      const dots: Dot[] = [];
      const step = 0.075;
      for (let row = 0; row * step * 0.87 < 1; row++) {
        const y = 0.1 + row * step * 0.87;
        const offset = row % 2 ? step / 2 : 0;
        for (let x = 0.1 + offset; x < 0.92; x += step) {
          if (insideShield(x, y)) {
            dots.push(make(x, y, 1.5));
          }
        }
      }
      return dots;
    }
  }
}

/** Escudo: rectángulo redondeado arriba que se estrecha hasta una punta abajo. */
function insideShield(x: number, y: number): boolean {
  const top = 0.1;
  const shoulder = 0.52;
  const tip = 0.92;
  if (y < top || y > tip) {
    return false;
  }
  const halfWidth = y < shoulder ? 0.34 : 0.34 * (1 - (y - shoulder) / (tip - shoulder));
  return Math.abs(x - 0.5) <= halfWidth;
}

// ── Utilidades ─────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpAngle(a: number, b: number, t: number): number {
  const diff = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return a + diff * t;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t)),
  };
}

function rgba(c: Rgb, alpha: number): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${clamp(alpha, 0, 1)})`;
}

function parseColor(value: string): Rgb | null {
  const hex = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!hex) {
    return null;
  }
  const n = parseInt(hex[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** PRNG determinista: la misma variante dibuja siempre la misma figura. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
