#!/usr/bin/env python3
"""CLI del Pay Transparency Compliance Agent.

    python agent/cli.py estado              diagnóstico, sin credenciales
    python agent/cli.py guard <fichero>     pasa un texto por la guardia
    python agent/cli.py casos               lista la suite de regresión
    python agent/cli.py preguntar "..."     consulta al asistente (requiere clave)
    python agent/cli.py eval [--replay F]   ejecuta la suite de regresión
                             [--only A1,B4] [--juez] [--out F]
    python agent/cli.py oferta <fichero>    analiza una oferta de empleo
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from pta import corpus as corpus_mod  # noqa: E402
from pta import evalsuite, guard, prompts, registry  # noqa: E402


def cmd_estado() -> int:
    c = corpus_mod.cargar()
    reg = registry.cargar()
    print("Pay Transparency Compliance Agent · estado\n")
    print(f"  prompt de sistema   {prompts.VERSION}")
    print(f"  corpus              {len(c.documentos)} documentos, "
          f"{c.caracteres:,} chars, ~{c.tokens_aprox:,} tokens")
    print(f"  estrategia          {'RAG NECESARIO' if c.necesita_rag else 'corpus en prompt (sin RAG)'}"
          f"  ·  umbral {corpus_mod.LIMITE_SIN_RAG:,} tokens")
    print(f"\n  registro            {len(reg)} instrumentos")
    for ref in registry.refs():
        i = reg[ref]
        n = len(i.articulos)
        aviso = "  ⚠ cuantías/contenido sin verificar" if i.sin_verificar else ""
        print(f"    {i.estado('ES') or '-':<15} {ref:<32} {n:>2} art. verificados"
              f"  [{i.verificacion}]{aviso}")

    casos = evalsuite.cargar()
    print(f"\n  suite de regresión  {len(casos)} casos")
    for b, cs in evalsuite.por_bloque(casos).items():
        print(f"    {b:<45} {len(cs):>2}")

    import os
    tiene = bool(os.environ.get("ANTHROPIC_API_KEY"))
    print(f"\n  credenciales        {'presentes' if tiene else 'AUSENTES'}")
    if not tiene:
        print("    El asistente no puede ejecutarse. Define ANTHROPIC_API_KEY")
        print("    o autentica con:  ant auth login")
    return 0


def cmd_guard(path: str) -> int:
    texto = Path(path).read_text(encoding="utf-8")
    res = guard.revisar(texto)
    print(guard.render(res))
    return 0 if res.apto else 1


def cmd_casos() -> int:
    for c in evalsuite.cargar():
        print(f"[{c.id:>6}] {c.bloque}")
        print(f"         P: {c.pregunta}")
        print(f"         E: {c.esperado[:150]}{'…' if len(c.esperado) > 150 else ''}\n")
    return 0


def cmd_oferta(path: str) -> int:
    from pta import ofertas
    a = ofertas.analizar(Path(path).read_text(encoding="utf-8"))
    print(ofertas.render(a))
    return 0 if a.nivel == "BAJO" else 1


def cmd_eval(args: list[str]) -> int:
    import json
    from pta import harness

    def opt(nombre, defecto=None):
        return args[args.index(nombre) + 1] if nombre in args else defecto

    casos = evalsuite.cargar()
    if (only := opt("--only")):
        pedidos = {x.strip() for x in only.split(",")}
        casos = [c for c in casos if c.id in pedidos]
        if not casos:
            print(f"ningún caso coincide con {sorted(pedidos)}")
            return 2

    replay = opt("--replay")
    juez = None
    if replay:
        grabadas = harness.cargar_replay(Path(replay))
        faltan = [c.id for c in casos if not c.bloqueado and c.id not in grabadas]
        if faltan:
            print(f"replay incompleto, faltan respuestas para: {', '.join(faltan)}")
            casos = [c for c in casos if c.bloqueado or c.id in grabadas]
        def responder(caso):
            return grabadas[caso.id], {}
        modo = f"replay · {Path(replay).name}"
    else:
        from pta.assistant import preguntar
        def responder(caso):
            r = preguntar(caso.pregunta)
            return r.texto, r.uso
        modo = "en vivo"
        if "--juez" in args:
            import anthropic
            cliente = anthropic.Anthropic()
            juez = lambda c, t: harness.evaluar_juez(c, t, cliente)
            modo += " · con juez"

    print(f"suite de regresión · {len(casos)} casos · modo {modo}\n")
    vs = harness.ejecutar(casos, responder, juez)
    print(harness.resumen(vs))
    if (out := opt("--out")):
        harness.guardar(vs, Path(out))
        print(f"  resultados en {out}\n")
    return 0 if not any(v.estado == "FALLA" for v in vs) else 1


def cmd_preguntar(pregunta: str) -> int:
    from pta.assistant import preguntar
    r = preguntar(pregunta)
    print(r.texto)
    print("\n" + "─" * 70)
    print(guard.render(r.revision))
    print(f"intentos {r.intentos} · tokens in {r.uso['input']} out {r.uso['output']} "
          f"· caché lectura {r.uso['cache_read']} escritura {r.uso['cache_write']}")
    return 0 if r.apto else 1


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2
    cmd, *args = argv[1:]
    if cmd == "estado":
        return cmd_estado()
    if cmd == "guard" and args:
        return cmd_guard(args[0])
    if cmd == "oferta" and args:
        return cmd_oferta(args[0])
    if cmd == "eval":
        return cmd_eval(args)
    if cmd == "casos":
        return cmd_casos()
    if cmd == "preguntar" and args:
        return cmd_preguntar(" ".join(args))
    print(__doc__)
    return 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
