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

## Pagina temporanea — Banca ore "La Terra dei Bambini"

Pagina riservata e temporanea (`/terra-dei-bambini`), fuori dal menu del sito e
non indicizzata, per raccogliere le adesioni delle famiglie ai gruppi di lavoro
del progetto parentale 2026/2027. Va rimossa a raccolta conclusa.

- `/terra-dei-bambini` — password condivisa con le famiglie, regolamento,
  gruppi con posti residui aggiornati in tempo reale e modulo di adesione.
- `/terra-dei-bambini/admin` — password separata, solo per chi gestisce la
  raccolta: elenco con i numeri di telefono, copia numeri per gruppo, export CSV
  e possibilità di liberare un posto assegnato per errore.
- Gruppi, capienze, testi e posti già assegnati: `src/lib/terra-dei-bambini/config.ts`.

### Configurazione

Servono un database Postgres e due password, da impostare come variabili
d'ambiente (vedi `.env.example`; in locale usa `.env.local`):

| Variabile | A cosa serve |
| --- | --- |
| `DATABASE_URL` (o `POSTGRES_URL`) | Postgres dove salvare le adesioni. Va bene qualsiasi provider (Neon, Vercel Postgres, Supabase, Railway). Su Vercel: Storage → crea il database → la variabile viene aggiunta da sola, con il nome che usa quel provider: il codice accetta entrambi i nomi. |
| `TDB_PASSWORD` | Password condivisa con le famiglie. |
| `TDB_ADMIN_PASSWORD` | Password della pagina di gestione. Diversa dalla precedente. |
| `TDB_SESSION_SECRET` | Facoltativa: chiave di firma dei cookie di sessione. Se assente viene derivata dalle password. |

La tabella `tdb_slots` viene creata e popolata da sola alla prima apertura della
pagina: un record per ogni posto disponibile. L'adesione occupa il primo posto
libero con una singola `UPDATE ... FOR UPDATE SKIP LOCKED`, quindi due famiglie
che confermano nello stesso istante non possono prendere lo stesso posto; il
numero di telefono ha un indice univoco, così ogni famiglia occupa un solo posto.

### A raccolta conclusa

1. Esporta il CSV dalla pagina di gestione.
2. Elimina `src/app/terra-dei-bambini/`, `src/app/api/terra-dei-bambini/`,
   `src/components/terra-dei-bambini/`, `src/lib/terra-dei-bambini/` e la
   dipendenza `pg`.
3. Cancella i dati dal database: `DROP TABLE tdb_slots;` (o elimina il database).
4. Rimuovi le variabili d'ambiente `TDB_*` e `DATABASE_URL`.

## Deploy

Il sito è compatibile con qualsiasi hosting Next.js (es. Vercel). Tutte le pagine sono generate come contenuto statico (nessuna route dinamica), quindi è possibile anche l'export statico (`output: "export"` in `next.config.ts`) se si preferisce un hosting puramente statico.
