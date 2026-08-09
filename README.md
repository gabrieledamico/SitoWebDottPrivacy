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
- `src/app/sitemap.ts` / `src/app/robots.ts` — SEO tecnica.

## Prima del go-live — checklist

Alcuni contenuti sono placeholder da sostituire con i dati reali:

1. **`src/lib/site-config.ts`** — telefono, PEC, P.IVA, indirizzo studio, link booking/Calendly, endpoint form contatti (es. Formspree), profilo LinkedIn.
2. **Loghi clienti** — `src/components/ClientLogos.tsx` mostra al momento i settori serviti come fallback. Una volta ottenuta l'autorizzazione dei clienti, aggiungere i loghi in `public/logos/` e passare l'array `logos` al componente (usato in Home e in `/clienti`).
3. **Casi studio** — i casi in `/clienti` e gli scenari in `/servizi/nis2` sono esempi di percorso costruiti su situazioni ricorrenti, con dettagli anonimizzati. Da sostituire o integrare con casi reali quando pubblicabili.
4. **Form contatti** — senza un `formEndpoint` configurato, il form apre un client email precompilato (`mailto:`) come fallback funzionante. Per una gestione più solida, collegare un endpoint tipo Formspree/Netlify Forms in `site-config.ts`.
5. **Privacy Policy / Cookie Policy** — bozze standard da rivedere con l'informativa definitiva dello studio.

## Deploy

Il sito è compatibile con qualsiasi hosting Next.js (es. Vercel). Tutte le pagine sono generate come contenuto statico (nessuna route dinamica), quindi è possibile anche l'export statico (`output: "export"` in `next.config.ts`) se si preferisce un hosting puramente statico.
