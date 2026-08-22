# DottPrivacy.it — sito web

Sito istituzionale di Gabriele D'Amico / DottPrivacy. Next.js 16 (App Router) + Tailwind CSS v4, tutte le pagine prerenderizzate come contenuto statico.

## Sviluppo

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build di produzione (genera pagine statiche)
npm run start   # avvia il build di produzione
npm run lint    # ESLint
```

## Struttura

- `src/app/` — pagine (App Router): home, `chi-sono`, `servizi/{nis2,iso27001,gdpr-dpo,cybersecurity-advisory}`, `clienti`, `contatti`, `privacy`, `cookie-policy`.
- `src/components/` — componenti condivisi (Header, Footer, Hero, sezioni riutilizzabili).
- `src/lib/site-config.ts` — dati reali dello studio e voci di navigazione.
- `src/components/chi-sono/` — sequenza 3D scroll-driven della pagina Chi sono (vedi sotto).
- `src/app/sitemap.ts` / `src/app/robots.ts` — SEO tecnica.

## La sequenza 3D di "Chi sono"

`/chi-sono` apre con una sequenza **scroll-driven** in stile Apple (AirPods / iPhone):
un contenitore alto più viewport, un palco interno `sticky` e un fotogramma che è
funzione pura della posizione di scroll. Scroll down avanza, scroll up riavvolge,
senza salti e senza scarti di allineamento.

- `src/components/chi-sono/dualityScene.ts` — la scena: una doppia elica in cui il
  filamento ambra porta il lessico giuridico (GDPR, NIS2, ISO 27001, art. 32) e quello
  verde-acqua il lessico tecnico (AES-256, SIEM, EDR, RTO/RPO), con i byte che
  viaggiano lungo i ponti che li uniscono. Cinque capitoli: due nuvole contrapposte →
  formazione dell'elica → immersione → intreccio → cordone unico di luce.
- `src/components/chi-sono/DualityScrollSequence.tsx` — il motore di scroll, il canvas
  e le didascalie.

Perché il rendering è **procedurale su canvas** e non una cartella di JPEG:

- l'allineamento è garantito per costruzione (stessa geometria, stessa camera, ogni
  fotogramma dipende solo da `progress`);
- disegna alla risoluzione nativa dello schermo, Retina inclusa — nessuna immagine
  da ricomprimere e nessun aliasing di scala;
- non aggiunge nulla al peso della pagina (una sequenza Apple-style di 150 frame
  full-page costa decine di MB).

### Sostituire la scena con una sequenza di immagini pre-renderizzata

Se in futuro si producesse una sequenza vera (export da Blender, Cinema 4D o After
Effects), il motore la riproduce senza modifiche: si mettono i file in `public/` e si
passano due prop.

```tsx
<DualityScrollSequence
  frameSrcPattern="/sequences/chi-sono/{i}.webp"
  frameCount={180}
  framePad={4}
/>
```

`{i}` viene sostituito con l'indice 1-based con zero-padding (`0001`, `0002`, …). I
fotogrammi vengono precaricati e disegnati con inquadratura *cover* identica per
ciascuno, quindi l'allineamento resta perfetto a qualsiasi proporzione di viewport.
Consigli per l'export: 1920×1080 o superiore, WebP/AVIF qualità ~75, 150–200
fotogrammi, camera bloccata (nessun movimento non voluto tra un frame e l'altro).

### Accessibilità e prestazioni

- `prefers-reduced-motion: reduce` → la sezione collassa a una sola schermata e
  mostra un fotogramma statico, senza scroll pinning.
- Le didascalie sono testo reale nel DOM (selezionabile e indicizzabile), aggiornate
  fuori dal ciclo di render di React per non causare re-render a ogni fotogramma.
- Il `devicePixelRatio` è limitato a 2 (1.5 sui dispositivi con poca memoria, dove
  viene ridotto anche il numero di particelle).
- Costo misurato: ~3 ms per fotogramma (p90 ~7 ms) con backing store 3840×2160.

## Prima del go-live — checklist

Alcuni contenuti sono placeholder da sostituire con i dati reali:

1. **`src/lib/site-config.ts`** — telefono, PEC, P.IVA, indirizzo studio, link booking/Calendly, endpoint form contatti (es. Formspree), profilo LinkedIn.
2. **Loghi clienti** — `src/components/ClientLogos.tsx` mostra al momento i settori serviti come fallback. Una volta ottenuta l'autorizzazione dei clienti, aggiungere i loghi in `public/logos/` e passare l'array `logos` al componente (usato in Home e in `/clienti`).
3. **Casi studio** — i casi in `/clienti` e gli scenari in `/servizi/nis2` sono esempi di percorso costruiti su situazioni ricorrenti, con dettagli anonimizzati. Da sostituire o integrare con casi reali quando pubblicabili.
4. **Form contatti** — senza un `formEndpoint` configurato, il form apre un client email precompilato (`mailto:`) come fallback funzionante. Per una gestione più solida, collegare un endpoint tipo Formspree/Netlify Forms in `site-config.ts`.
5. **Privacy Policy / Cookie Policy** — bozze standard da rivedere con l'informativa definitiva dello studio.

## Deploy

Il sito è compatibile con qualsiasi hosting Next.js (es. Vercel). Tutte le pagine sono generate come contenuto statico (nessuna route dinamica), quindi è possibile anche l'export statico (`output: "export"` in `next.config.ts`) se si preferisce un hosting puramente statico.
