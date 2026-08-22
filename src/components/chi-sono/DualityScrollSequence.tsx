"use client";

import { useEffect, useRef } from "react";
import { drawDualityFrame, type SceneFonts } from "./dualityScene";

/**
 * Sequenza scroll-driven full-page (modello Apple AirPods / iPhone).
 *
 * Il contenitore esterno è alto più viewport; il "palco" interno è `sticky`,
 * quindi resta fermo mentre si scorre. Ogni fotogramma è una funzione pura
 * della posizione di scroll: scroll down avanza, scroll up riavvolge, e le
 * inquadrature restano perfettamente allineate perché la geometria è la stessa
 * a ogni fotogramma.
 *
 * Due sorgenti possibili per i fotogrammi:
 *
 * 1. **procedurale** (default) — la scena 3D è disegnata su canvas alla
 *    risoluzione nativa dello schermo (Retina incluso). Nessun asset da
 *    scaricare, nitidezza a qualsiasi dimensione.
 * 2. **sequenza di immagini** — passando `frameSrcPattern` + `frameCount` il
 *    componente precarica una sequenza pre-renderizzata (es. export da Blender
 *    o After Effects) e la riproduce con lo stesso motore di scroll. Le
 *    immagini vengono disegnate con inquadratura "cover" identica per ogni
 *    fotogramma, quindi l'allineamento è garantito.
 */

type Caption = {
  from: number;
  to: number;
  eyebrow: string;
  title: string;
  text: string;
};

const CAPTIONS: Caption[] = [
  {
    from: -0.05,
    to: 0.21,
    eyebrow: "Origine",
    title: "Due alfabeti che di solito non si parlano",
    text: "Da una parte il testo normativo. Dall'altra il byte. Nella maggior parte dei progetti di compliance restano due mondi separati, affidati a due fornitori diversi.",
  },
  {
    from: 0.21,
    to: 0.45,
    eyebrow: "Il legame",
    title: "Ogni norma ha un corrispettivo tecnico",
    text: "L'art. 32 GDPR non è una frase da citare: è cifratura, segmentazione di rete, logging, backup testati. Ogni ponte dell'elica lega un obbligo a un controllo che qualcuno deve verificare davvero.",
  },
  {
    from: 0.45,
    to: 0.68,
    eyebrow: "L'immersione",
    title: "Dentro l'infrastruttura, non sopra",
    text: "Leggo un asset inventory prima di scrivere una policy. Valido una Business Impact Analysis sui RTO/RPO reali. Verifico i 93 controlli dell'Annex A uno per uno, con l'evidenza tecnica in mano.",
  },
  {
    from: 0.68,
    to: 0.87,
    eyebrow: "La convergenza",
    title: "I due filamenti diventano uno",
    text: "Quando normativa e architettura smettono di essere due documenti scollegati, la conformità smette di essere carta: diventa una proprietà verificabile del sistema.",
  },
  {
    from: 0.87,
    to: 1.05,
    eyebrow: "Il risultato",
    title: "Gabriele D'Amico",
    text: "Consulente privacy e cybersecurity. DPO esterno, ISO 27001 Lead Auditor, specialista NIS2 — con la parte tecnica condotta in prima persona, non delegata.",
  },
];

const clamp = (v: number, min = 0, max = 1) => (v < min ? min : v > max ? max : v);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/** Opacità della didascalia: dissolvenza in entrata e in uscita dentro la sua finestra. */
function captionOpacity(c: Caption, p: number) {
  const span = c.to - c.from;
  const fade = Math.min(0.055, span * 0.3);
  const inn = smoothstep(c.from, c.from + fade, p);
  const out = 1 - smoothstep(c.to - fade, c.to, p);
  return clamp(Math.min(inn, out));
}

function readFonts(): SceneFonts {
  if (typeof window === "undefined") {
    return { mono: "ui-monospace, monospace", display: "system-ui, sans-serif" };
  }
  const cs = getComputedStyle(document.documentElement);
  const mono = cs.getPropertyValue("--font-ibm-plex-mono").trim();
  const display = cs.getPropertyValue("--font-space-grotesk").trim();
  return {
    mono: mono ? `${mono}, ui-monospace, monospace` : "ui-monospace, monospace",
    display: display ? `${display}, system-ui, sans-serif` : "system-ui, sans-serif",
  };
}

export default function DualityScrollSequence({
  frameSrcPattern,
  frameCount = 0,
  framePad = 4,
  className = "",
}: {
  /** es. "/sequences/chi-sono/{i}.webp" — `{i}` viene sostituito con l'indice 1-based. */
  frameSrcPattern?: string;
  frameCount?: number;
  framePad?: number;
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;

    let fonts = readFonts();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let target = reduced ? 0.55 : 0;
    let current = target;
    let dirty = true;
    let raf = 0;

    // ---- eventuale sequenza di immagini pre-renderizzata -------------------
    const useImages = Boolean(frameSrcPattern) && frameCount > 0;
    const images: HTMLImageElement[] = [];
    if (useImages && frameSrcPattern) {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = frameSrcPattern.replace(
          "{i}",
          String(i + 1).padStart(framePad, "0"),
        );
        img.onload = () => {
          dirty = true;
        };
        images.push(img);
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextW = Math.max(1, Math.round(rect.width));
      const nextH = Math.max(1, Math.round(rect.height));
      const nextDpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
      if (nextW === width && nextH === height && nextDpr === dpr) return;
      width = nextW;
      height = nextH;
      dpr = nextDpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
    };

    const drawImageFrame = (p: number) => {
      const idx = clamp(Math.round(p * (frameCount - 1)), 0, frameCount - 1);
      let img: HTMLImageElement | undefined;
      for (let i = idx; i >= 0; i--) {
        if (images[i]?.complete && images[i].naturalWidth > 0) {
          img = images[i];
          break;
        }
      }
      ctx.fillStyle = "#04080f";
      ctx.fillRect(0, 0, width, height);
      if (!img) return;
      // inquadratura "cover" identica per ogni fotogramma → allineamento perfetto
      const s = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
    };

    const paint = (p: number) => {
      if (useImages) {
        drawImageFrame(p);
      } else {
        drawDualityFrame(ctx, {
          progress: p,
          width,
          height,
          fonts,
          quality: lowPower ? 0.55 : 1,
        });
      }

      // didascalie e indicatore di avanzamento, aggiornati fuori da React
      for (let i = 0; i < CAPTIONS.length; i++) {
        const el = captionRefs.current[i];
        if (!el) continue;
        const o = captionOpacity(CAPTIONS[i], p);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${((1 - o) * 18).toFixed(2)}px, 0)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      }
      if (railRef.current) railRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - smoothstep(0.005, 0.05, p));
      }
    };

    const measure = () => {
      if (reduced) return;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      target = travel > 0 ? clamp(-rect.top / travel) : 0;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      resize();
      const delta = target - current;
      if (Math.abs(delta) > 0.00015) {
        // leggero smorzamento: rende lo scrub fluido senza sfasare i fotogrammi
        current += delta * 0.16;
        dirty = true;
      } else if (current !== target) {
        current = target;
        dirty = true;
      }
      if (!dirty) return;
      dirty = false;
      paint(current);
    };

    const onScroll = () => measure();

    resize();
    measure();
    current = target;
    paint(current);
    raf = requestAnimationFrame(tick);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // i font Next vengono caricati in modo asincrono: ridisegna quando sono pronti
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        fonts = readFonts();
        dirty = true;
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [frameSrcPattern, frameCount, framePad]);

  return (
    <section
      ref={sectionRef}
      aria-label="Il DNA della doppia competenza: legale e IT"
      className={`relative bg-[#04080f] motion-safe:h-[380vh] motion-safe:md:h-[520vh] ${className}`}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full"
        />

        {/* velatura in basso: garantisce il contrasto del testo su qualsiasi fotogramma */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#060d18] via-[#060d18]/72 to-transparent"
        />

        {/* indicatore di avanzamento della sequenza */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-paper/15 md:block lg:right-8"
        >
          <div
            ref={railRef}
            className="h-full w-full origin-top bg-gradient-to-b from-amber to-teal"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        {/* didascalie: testo reale nel DOM, quindi selezionabile e indicizzabile */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="mx-auto w-full max-w-content px-6 pb-16 lg:px-8 lg:pb-20">
            <div className="relative min-h-[13.5rem] sm:min-h-[12rem]">
              {CAPTIONS.map((caption, i) => (
                <div
                  key={caption.eyebrow}
                  ref={(el) => {
                    captionRefs.current[i] = el;
                  }}
                  className="absolute inset-x-0 bottom-0 max-w-2xl will-change-[opacity,transform]"
                  style={{ opacity: 0, visibility: "hidden" }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest text-paper/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {caption.eyebrow}
                  </span>
                  <h2 className="text-balance mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-3xl lg:text-4xl">
                    {caption.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-paper/70 sm:text-base">
                    {caption.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* invito allo scroll, solo all'inizio della sequenza */}
        <div
          ref={hintRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-28 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-paper/45 motion-reduce:hidden"
        >
          Scorri
          <span className="h-8 w-px bg-gradient-to-b from-paper/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
