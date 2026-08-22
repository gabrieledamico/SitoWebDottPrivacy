/**
 * "Il DNA della doppia competenza" — scena 3D procedurale per la pagina Chi sono.
 *
 * Il rendering è una funzione PURA del solo `progress` (0 → 1): nessun timer,
 * nessuno stato interno. È la proprietà che rende la sequenza scroll-driven
 * perfettamente allineata fotogramma per fotogramma e reversibile allo scroll up,
 * esattamente come una sequenza di immagini pre-renderizzata.
 *
 * Metafora: una doppia elica in cui il filamento ambra porta il lessico giuridico
 * (GDPR, NIS2, ISO 27001) e quello verde-acqua il lessico tecnico (AES, SIEM, EDR).
 * I "byte" viaggiano lungo i ponti che uniscono i due filamenti; sul finale le due
 * eliche si intrecciano in un unico cordone di luce.
 */

// ---------------------------------------------------------------- utilities

const TAU = Math.PI * 2;

const clamp = (v: number, min = 0, max = 1) => (v < min ? min : v > max ? max : v);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const fract = (x: number) => x - Math.floor(x);

/** PRNG deterministico: la nuvola di byte è identica a ogni reload e a ogni resize. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ------------------------------------------------------------------ palette

type RGB = readonly [number, number, number];

const LEGAL: RGB = [230, 155, 60]; // --color-amber, schiarito per il fondo scuro
const LEGAL_HI: RGB = [250, 213, 156];
const TECH: RGB = [32, 190, 178]; // --color-teal, schiarito per il fondo scuro
const TECH_HI: RGB = [141, 243, 232];
const PAPER: RGB = [250, 248, 244];

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];

// ------------------------------------------------------------------ lessico

const LEGAL_TOKENS = [
  "Art. 32",
  "GDPR",
  "NIS2",
  "DPIA",
  "Art. 5",
  "ISO 27001",
  "Reg. 679",
  "D.Lgs. 138",
  "Art. 28",
  "Garante",
  "LIA",
  "Art. 30",
  "Annex A",
  "Art. 33",
  "Reg. UE",
  "Art. 35",
];

const TECH_TOKENS = [
  "01001101",
  "0xA3F1",
  "</>",
  "AES-256",
  "SHA-256",
  "TLS 1.3",
  "EDR",
  "SIEM",
  "RTO/RPO",
  "3-2-1",
  "MFA",
  "0110",
  "VLAN",
  "IAM",
  "10110",
  "PKI",
];

// ------------------------------------------------------- geometria elica

/** Dimensione del pool di semi: l'elica è idealmente infinita, i semi si ripetono. */
const SEED_POOL = 240;
/** Rotazione, in radianti, tra un rung e il successivo → 18 coppie per giro. */
const DPHASE = TAU / 18;

type RungSeed = {
  legal: string;
  tech: string;
  /** ritardo di formazione: la nuvola di byte si ricompone in modo scaglionato */
  delay: number;
  /** posizione iniziale nella nuvola (unità normalizzate) */
  sx: number;
  sy: number;
  sz: number;
  sx2: number;
  sy2: number;
  sz2: number;
  /** quali nodi mostrano l'etichetta testuale (gli altri restano puntini) */
  labelled: boolean;
};

const SEEDS: RungSeed[] = (() => {
  const rnd = mulberry32(0x5eed1a7e);
  const out: RungSeed[] = [];
  for (let i = 0; i < SEED_POOL; i++) {
    out.push({
      legal: LEGAL_TOKENS[Math.floor(rnd() * LEGAL_TOKENS.length)],
      tech: TECH_TOKENS[Math.floor(rnd() * TECH_TOKENS.length)],
      delay: rnd() * 0.15,
      sx: (rnd() - 0.5) * 2.2,
      sy: (rnd() - 0.5) * 1.8,
      sz: (rnd() - 0.5) * 1.6,
      sx2: (rnd() - 0.5) * 2.2,
      sy2: (rnd() - 0.5) * 1.8,
      sz2: (rnd() - 0.5) * 1.6,
      labelled: rnd() < 0.62,
    });
  }
  return out;
})();

const seedAt = (k: number) => SEEDS[((k % SEED_POOL) + SEED_POOL) % SEED_POOL];

/** Pulviscolo di byte lontani: dà profondità e fa "viaggiare" l'aria attorno all'elica. */
const DUST = (() => {
  const rnd = mulberry32(0x0d757c0d);
  return Array.from({ length: 190 }, () => ({
    ang: rnd() * TAU,
    rad: 1.4 + rnd() * 3.6,
    y: rnd(),
    tech: rnd() < 0.5,
    glyph: rnd() < 0.5 ? "0" : "1",
    speed: 0.5 + rnd() * 1.6,
  }));
})();

// -------------------------------------------------------------- glow sprite

const glowCache = new Map<string, HTMLCanvasElement>();

function glowSprite(color: RGB): HTMLCanvasElement | null {
  const key = color.join(",");
  const cached = glowCache.get(key);
  if (cached) return cached;
  if (typeof document === "undefined") return null;

  const size = 128;
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const g = cv.getContext("2d");
  if (!g) return null;

  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, rgba(color, 0.95));
  grad.addColorStop(0.22, rgba(color, 0.4));
  grad.addColorStop(0.55, rgba(color, 0.1));
  grad.addColorStop(1, rgba(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);

  glowCache.set(key, cv);
  return cv;
}

function drawGlow(
  ctx: CanvasRenderingContext2D,
  color: RGB,
  x: number,
  y: number,
  radius: number,
  alpha: number,
) {
  const sprite = glowSprite(color);
  if (!sprite || alpha <= 0.004) return;
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
  ctx.globalAlpha = 1;
}

// ----------------------------------------------------------------- tipi API

export type SceneFonts = {
  mono: string;
  display: string;
};

export type SceneFrame = {
  /** 0 → 1, mappato 1:1 sullo scroll della sezione */
  progress: number;
  /** dimensioni in pixel CSS (il contesto è già scalato per il devicePixelRatio) */
  width: number;
  height: number;
  fonts: SceneFonts;
  /** riduce il numero di elementi su dispositivi meno potenti */
  quality?: number;
};

type Projected = {
  x: number;
  y: number;
  scale: number;
  zc: number;
  alpha: number;
  /** 0 = ancora byte disperso nella nuvola, 1 = agganciato all'elica */
  form: number;
  visible: boolean;
};

type Item =
  | { kind: "seg"; k: number; strand: 0 | 1; zc: number }
  | { kind: "rung"; k: number; zc: number }
  | { kind: "node"; k: number; strand: 0 | 1; zc: number };

const HIDDEN: Projected = { x: 0, y: 0, scale: 0, zc: 1e9, alpha: 0, form: 0, visible: false };

// --------------------------------------------------------------- rendering

export function drawDualityFrame(ctx: CanvasRenderingContext2D, frame: SceneFrame) {
  const { width: w, height: h, fonts } = frame;
  const p = clamp(frame.progress);
  const quality = frame.quality ?? 1;

  // ---- curve di regia (tutte funzioni pure di p) --------------------------
  const formed = smoothstep(0.0, 0.3, p); // la nuvola si è ricomposta
  const approach = smoothstep(0.04, 0.58, p); // la camera entra nell'elica
  const immersion = smoothstep(0.28, 0.74, p); // ampiezza / respiro dell'elica
  const braid = smoothstep(0.7, 0.95, p); // i due filamenti si intrecciano
  const resolve = smoothstep(0.87, 1, p); // il cordone di luce finale
  const bloom = 0.58 + 0.42 * smoothstep(0.05, 0.42, p);

  // ---- camera -------------------------------------------------------------
  const cx = w / 2;
  const cy = h * 0.46;
  /** lato di riferimento: mantiene la stessa composizione su desktop e mobile */
  const unit = Math.min(w * 0.95, h);
  const f = h * 1.05; // focale
  const camZ = lerp(f * 1.32, f * 0.56, approach);
  const pitch = h * 0.0205; // distanza verticale tra due coppie, in unità mondo
  const camY = p * h * 7.4;
  const spin = p * TAU * 1.4 + 0.55;
  const radius = unit * 0.185 * lerp(0.82, 1.3, immersion) * (1 - 0.78 * braid);

  // ---- fondale ------------------------------------------------------------
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0d1a2c");
  bg.addColorStop(0.5, "#0a1524");
  bg.addColorStop(1, "#060d18");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // due aloni che ricordano la dualità cromatica del sito
  const aura = (color: RGB, ax: number, ay: number, ar: number, alpha: number) => {
    const g = ctx.createRadialGradient(ax, ay, 0, ax, ay, ar);
    g.addColorStop(0, rgba(color, alpha));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };
  const auraStrength = 0.07 + 0.1 * bloom;
  aura(LEGAL, w * 0.18, h * 0.26, Math.max(w, h) * 0.68, auraStrength);
  aura(TECH, w * 0.84, h * 0.72, Math.max(w, h) * 0.68, auraStrength);

  // ---- pulviscolo di byte (dietro l'elica) --------------------------------
  ctx.font = `500 ${Math.max(9, Math.round(h * 0.0145))}px ${fonts.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const dustCount = Math.round(DUST.length * quality);
  for (let i = 0; i < dustCount; i++) {
    const d = DUST[i];
    const wy = fract(d.y + p * 0.6 * d.speed) * 2.6 - 1.3;
    const ang = d.ang + spin * 0.4;
    const x = Math.cos(ang) * radius * d.rad;
    const z = Math.sin(ang) * radius * d.rad + camZ;
    if (z < f * 0.14) continue;
    const s = f / z;
    const sx = cx + x * s;
    const sy = cy + wy * h * 1.15 * s;
    if (sx < -40 || sx > w + 40 || sy < -40 || sy > h + 40) continue;
    ctx.fillStyle = rgba(d.tech ? TECH : LEGAL, clamp(s * 0.55, 0, 0.46) * bloom);
    ctx.fillText(d.glyph, sx, sy);
  }

  // ---- finestra di rung effettivamente proiettati -------------------------
  const kCenter = Math.round(camY / pitch);
  const minScale = f / (camZ + radius);
  const span = Math.min(
    170,
    Math.ceil((h * 0.75) / (pitch * minScale)) + 8 + Math.ceil(70 * (1 - formed)),
  );
  const kStart = kCenter - span;
  const kEnd = kCenter + span;

  const proj: Projected[] = new Array((kEnd - kStart + 1) * 2);
  const at = (k: number, strand: 0 | 1): Projected =>
    k < kStart || k > kEnd ? HIDDEN : proj[(k - kStart) * 2 + strand];

  for (let k = kStart; k <= kEnd; k++) {
    const seed = seedAt(k);
    const form = smoothstep(seed.delay, seed.delay + 0.22, p);
    for (const strand of [0, 1] as const) {
      const phase = k * DPHASE + spin + strand * Math.PI;
      let wx = Math.cos(phase) * radius;
      let wz = Math.sin(phase) * radius;
      let wy = k * pitch - camY;

      if (form < 1) {
        // partenza: due nuvole contrapposte — il lessico giuridico a sinistra,
        // quello tecnico a destra — che si ricompongono in modo scaglionato
        const side = strand === 0 ? -1 : 1;
        const spread = strand === 0 ? seed.sx : seed.sx2;
        const dx = side * (0.17 + Math.abs(spread) * 0.2) * w;
        const dy = (strand === 0 ? seed.sy : seed.sy2) * h * 0.4;
        const dz = (strand === 0 ? seed.sz : seed.sz2) * radius * 1.3;
        wx = lerp(wx + dx, wx, form);
        wy = lerp(wy + dy, wy, form);
        wz = lerp(wz + dz, wz, form);
      }

      const zc = wz + camZ;
      const idx = (k - kStart) * 2 + strand;
      if (zc < f * 0.12) {
        proj[idx] = HIDDEN;
        continue;
      }
      const scale = f / zc;
      const x = cx + wx * scale;
      const y = cy + wy * scale;

      const edge = smoothstep(-0.55, -0.02, y / h) * (1 - smoothstep(1.04, 1.55, y / h));
      const depth = Math.pow(clamp((scale - 0.15) / 0.85), 1.2);
      const nearFade = 1 - 0.82 * smoothstep(2.4, 4.6, scale);
      const alpha = clamp(depth * edge * nearFade * (0.78 + 0.22 * form));
      proj[idx] = {
        x,
        y,
        scale,
        zc,
        alpha,
        form,
        visible: alpha > 0.008 && x > -w * 0.7 && x < w * 1.7 && y > -h * 0.6 && y < h * 1.6,
      };
    }
  }

  // ---- lista degli elementi, ordinata dal più lontano al più vicino -------
  const items: Item[] = [];
  for (let k = kStart; k <= kEnd; k++) {
    const a = at(k, 0);
    const b = at(k, 1);
    if (a.visible || b.visible) items.push({ kind: "rung", k, zc: (a.zc + b.zc) / 2 });
    for (const strand of [0, 1] as const) {
      const cur = strand === 0 ? a : b;
      const nxt = at(k + 1, strand);
      if (cur.visible) items.push({ kind: "node", k, strand, zc: cur.zc });
      if (cur.visible || nxt.visible) {
        items.push({ kind: "seg", k, strand, zc: (cur.zc + nxt.zc) / 2 });
      }
    }
  }
  items.sort((m, n) => n.zc - m.zc);

  // ---- impulso di luce che percorre l'elica ------------------------------
  const pulseY = fract(p * 3.2) * 1.4 - 0.2;
  const pulseAt = (y: number) => {
    const d = (y / h - pulseY) / 0.15;
    return Math.exp(-d * d);
  };

  const strandColor = (strand: 0 | 1): RGB => {
    const base = strand === 0 ? LEGAL : TECH;
    // sul finale i due filamenti convergono verso lo stesso colore
    return mix(base, mix(LEGAL, TECH, 0.5), braid * 0.42);
  };

  const labelEvery = w < 640 ? 5 : 3;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const item of items) {
    if (item.kind === "seg") {
      const a = at(item.k, item.strand);
      const b = at(item.k + 1, item.strand);
      const bond = Math.min(a.form, b.form);
      const alpha = Math.min(a.alpha, b.alpha) * bond * bond * bond;
      if (alpha < 0.012) continue;
      const col = strandColor(item.strand);
      const boost = pulseAt((a.y + b.y) / 2);
      ctx.strokeStyle = rgba(mix(col, PAPER, boost * 0.6), alpha * (0.62 + 0.38 * boost));
      ctx.lineWidth = Math.max(0.7, a.scale * (2.1 + 2.2 * boost));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      continue;
    }

    if (item.kind === "rung") {
      const a = at(item.k, 0);
      const b = at(item.k, 1);
      const bond = Math.min(a.form, b.form);
      const alpha = Math.min(a.alpha, b.alpha) * 0.46 * bond * bond * bond;
      if (alpha < 0.012) continue;

      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, rgba(strandColor(0), alpha));
      grad.addColorStop(0.5, rgba(PAPER, alpha * 0.3));
      grad.addColorStop(1, rgba(strandColor(1), alpha));
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.5, ((a.scale + b.scale) / 2) * 0.95);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      // il byte che viaggia dal diritto alla tecnica e ritorno
      const q = fract(item.k * 0.371 + p * 4.4);
      const px = lerp(a.x, b.x, q);
      const py = lerp(a.y, b.y, q);
      const ps = lerp(a.scale, b.scale, q);
      const pc = mix(strandColor(0), strandColor(1), q);
      drawGlow(ctx, pc, px, py, Math.max(5, ps * 15), alpha * 0.9);
      ctx.fillStyle = rgba(mix(pc, PAPER, 0.4), Math.min(1, alpha * 1.8));
      const psize = Math.max(1.3, ps * 2.8);
      ctx.fillRect(px - psize / 2, py - psize / 2, psize, psize);
      continue;
    }

    // ---- nodo -------------------------------------------------------------
    const n = at(item.k, item.strand);
    const seed = seedAt(item.k);
    const col = strandColor(item.strand);
    const boost = pulseAt(n.y);
    const lit = mix(col, item.strand === 0 ? LEGAL_HI : TECH_HI, 0.3 + 0.7 * boost);

    drawGlow(
      ctx,
      lit,
      n.x,
      n.y,
      Math.min(unit * 0.16, Math.max(7, n.scale * (22 + 30 * boost))),
      n.alpha * (0.34 + 0.5 * boost),
    );

    const dot = Math.max(1.1, n.scale * (2.2 + 1.6 * boost) * (0.45 + 0.55 * n.form));
    ctx.fillStyle = rgba(mix(lit, PAPER, 0.3 + 0.5 * boost), n.alpha);
    ctx.beginPath();
    ctx.arc(n.x, n.y, dot, 0, TAU);
    ctx.fill();

    // finché il byte non si è agganciato all'elica lo si legge come cifra
    if (n.form < 0.94) {
      const gs = clamp(n.scale * 13, 10, Math.min(24, unit * 0.055));
      ctx.font = `500 ${gs.toFixed(1)}px ${fonts.mono}`;
      ctx.textAlign = "center";
      ctx.fillStyle = rgba(lit, n.alpha * (1 - n.form) * 0.95);
      ctx.fillText(
        item.strand === 0 ? "§" : item.k % 2 === 0 ? "1" : "0",
        n.x,
        n.y - gs * 0.85,
      );
    }

    // etichetta leggibile solo sui nodi vicini: niente rumore tipografico
    if (!seed.labelled || item.k % labelEvery !== 0 || braid > 0.6) continue;
    const labelAlpha = n.alpha * smoothstep(0.95, 1.5, n.scale) * (1 - braid * 1.7);
    if (labelAlpha < 0.035) continue;

    const fs = clamp(n.scale * 10.5, 10, Math.min(24, unit * 0.05));
    ctx.font = `500 ${fs.toFixed(1)}px ${fonts.mono}`;
    ctx.textAlign = item.strand === 0 ? "right" : "left";
    const offset = (dot + fs * 0.62) * (item.strand === 0 ? -1 : 1);
    const text = item.strand === 0 ? seed.legal : seed.tech;

    ctx.fillStyle = rgba(mix(lit, PAPER, 0.5), Math.min(1, labelAlpha * 1.25));
    ctx.fillText(text, n.x + offset, n.y);
    ctx.textAlign = "center";
  }

  // ---- cordone di luce finale --------------------------------------------
  if (resolve > 0.001) {
    const beamW = w * lerp(0.1, 0.038, resolve);
    const beam = ctx.createLinearGradient(cx - beamW, 0, cx + beamW, 0);
    beam.addColorStop(0, rgba(LEGAL, 0));
    beam.addColorStop(0.34, rgba(LEGAL, 0.3 * resolve));
    beam.addColorStop(0.5, rgba(PAPER, 0.5 * resolve));
    beam.addColorStop(0.66, rgba(TECH, 0.3 * resolve));
    beam.addColorStop(1, rgba(TECH, 0));
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = beam;
    ctx.fillRect(cx - beamW, 0, beamW * 2, h);
    ctx.globalCompositeOperation = "source-over";
  }

  // ---- vignettatura -------------------------------------------------------
  const vig = ctx.createRadialGradient(cx, cy, h * 0.3, cx, cy, Math.max(w, h) * 0.85);
  vig.addColorStop(0, "rgba(4,8,15,0)");
  vig.addColorStop(1, "rgba(4,8,15,0.55)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}
