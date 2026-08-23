"use client";

import { useEffect, useRef } from "react";

/**
 * Sfondo vivo: foglie e semini che scendono piano sulla carta panna.
 * Scansano il dito o il cursore quando ci passa vicino, e a ogni tocco ne
 * nasce una manciata nuova. Chi ha chiesto meno animazioni al sistema
 * operativo vede un prato fermo, disegnato una volta sola.
 */

type Foglia = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  giro: number;
  velGiro: number;
  raggio: number;
  tinta: string;
  fase: number;
  nata: boolean;
  vita: number;
};

const TINTE = [
  "rgba(156, 175, 136, 0.55)",
  "rgba(109, 130, 89, 0.42)",
  "rgba(211, 223, 196, 0.75)",
  "rgba(192, 132, 87, 0.28)",
];

const RAGGIO_DITO = 130;

function nuovaFoglia(w: number, h: number, dallAlto: boolean): Foglia {
  return {
    x: Math.random() * w,
    y: dallAlto ? -20 - Math.random() * h * 0.4 : Math.random() * h,
    vx: (Math.random() - 0.5) * 0.18,
    vy: 0.12 + Math.random() * 0.28,
    giro: Math.random() * Math.PI * 2,
    velGiro: (Math.random() - 0.5) * 0.012,
    raggio: 7 + Math.random() * 11,
    tinta: TINTE[Math.floor(Math.random() * TINTE.length)],
    fase: Math.random() * Math.PI * 2,
    nata: false,
    vita: 1,
  };
}

function disegnaFoglia(ctx: CanvasRenderingContext2D, f: Foglia) {
  const r = f.raggio;
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.giro);
  ctx.globalAlpha = f.vita;
  ctx.fillStyle = f.tinta;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.78, -r * 0.15, 0, r);
  ctx.quadraticCurveTo(-r * 0.78, -r * 0.15, 0, -r);
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 73, 47, 0.22)";
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.85);
  ctx.lineTo(0, r * 0.85);
  ctx.stroke();
  ctx.restore();
}

export default function SfondoVivo() {
  const rif = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = rif.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fermo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let foglie: Foglia[] = [];
    let animazione = 0;
    const dito = { x: -9999, y: -9999, attivo: false };

    const quante = () => Math.round(Math.min(34, Math.max(12, window.innerWidth / 46)));

    const dimensiona = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      foglie = Array.from({ length: quante() }, () => nuovaFoglia(w, h, false));
      if (fermo) disegnaTutto();
    };

    function disegnaTutto() {
      ctx!.clearRect(0, 0, w, h);
      for (const f of foglie) disegnaFoglia(ctx!, f);
    }

    const passo = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = foglie.length - 1; i >= 0; i -= 1) {
        const f = foglie[i];

        f.fase += 0.01;
        f.x += f.vx + Math.sin(f.fase) * 0.22;
        f.y += f.vy;
        f.giro += f.velGiro;

        if (dito.attivo) {
          const dx = f.x - dito.x;
          const dy = f.y - dito.y;
          const dist = Math.hypot(dx, dy);
          if (dist < RAGGIO_DITO && dist > 0.5) {
            const spinta = (1 - dist / RAGGIO_DITO) * 0.9;
            f.x += (dx / dist) * spinta * 2.4;
            f.y += (dy / dist) * spinta * 2.4;
            f.giro += spinta * 0.05;
          }
        }

        // le foglie nate da un tocco si spengono piano, le altre girano in tondo
        if (f.nata) {
          f.vx *= 0.985;
          f.vy = Math.min(f.vy + 0.006, 0.9);
          f.vita -= 0.006;
          if (f.vita <= 0) {
            foglie.splice(i, 1);
            continue;
          }
        } else if (f.y - f.raggio > h) {
          Object.assign(f, nuovaFoglia(w, h, true));
        } else if (f.x < -40) {
          f.x = w + 30;
        } else if (f.x > w + 40) {
          f.x = -30;
        }

        disegnaFoglia(ctx, f);
      }

      animazione = window.requestAnimationFrame(passo);
    };

    const muovi = (e: PointerEvent) => {
      dito.x = e.clientX;
      dito.y = e.clientY;
      dito.attivo = true;
    };

    const esci = () => {
      dito.attivo = false;
      dito.x = -9999;
      dito.y = -9999;
    };

    const tocca = (e: PointerEvent) => {
      if (foglie.length > quante() + 26) return;
      for (let i = 0; i < 7; i += 1) {
        const angolo = (Math.PI * 2 * i) / 7 + Math.random();
        const f = nuovaFoglia(w, h, false);
        f.x = e.clientX;
        f.y = e.clientY;
        f.vx = Math.cos(angolo) * (0.9 + Math.random() * 1.1);
        f.vy = Math.sin(angolo) * (0.9 + Math.random() * 1.1) - 0.4;
        f.velGiro = (Math.random() - 0.5) * 0.1;
        f.nata = true;
        foglie.push(f);
      }
    };

    const visibilita = () => {
      if (document.visibilityState === "hidden") {
        window.cancelAnimationFrame(animazione);
      } else if (!fermo) {
        animazione = window.requestAnimationFrame(passo);
      }
    };

    dimensiona();
    window.addEventListener("resize", dimensiona);

    if (!fermo) {
      animazione = window.requestAnimationFrame(passo);
      window.addEventListener("pointermove", muovi, { passive: true });
      window.addEventListener("pointerdown", tocca, { passive: true });
      window.addEventListener("pointerleave", esci);
      document.addEventListener("visibilitychange", visibilita);
    }

    return () => {
      window.cancelAnimationFrame(animazione);
      window.removeEventListener("resize", dimensiona);
      window.removeEventListener("pointermove", muovi);
      window.removeEventListener("pointerdown", tocca);
      window.removeEventListener("pointerleave", esci);
      document.removeEventListener("visibilitychange", visibilita);
    };
  }, []);

  return (
    <canvas
      ref={rif}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
