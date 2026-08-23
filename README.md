# Banca ore — La Terra dei Bambini

Applicazione temporanea per raccogliere le adesioni delle famiglie ai gruppi di
lavoro del progetto parentale "La Terra dei Bambini", anno 2026/2027.
Next.js 16 (App Router) + Tailwind CSS v4, dati su Postgres.

> Il sito professionale DottPrivacy che stava in questo repository è conservato
> sul branch `sito-professionale-restyling`, insieme a tutte le sue pagine.
> Questo branch ospita soltanto la raccolta delle adesioni.

## Pagine

- `/` — rimanda a `/terra-dei-bambini`.
- `/terra-dei-bambini` — password condivisa con le famiglie, testo del
  regolamento, gruppi con posti residui aggiornati in tempo reale e modulo di
  adesione (nominativo, genitori, telefono).
- `/terra-dei-bambini/admin` — password separata, per chi gestisce la raccolta:
  elenco con i numeri di telefono, copia numeri per gruppo, export CSV e
  possibilità di liberare un posto assegnato per errore.

Gruppi, capienze, testi e posti già assegnati stanno in
`src/lib/terra-dei-bambini/config.ts`: si modificano lì, senza toccare altro.

## Grafica

Bianco, panna e verde salvia; caratteri Fraunces (titoli) e Nunito (testo).
Lo sfondo è vivo: `SfondoVivo.tsx` disegna su canvas foglie che scendono piano,
scansano il dito o il cursore e si moltiplicano a ogni tocco. Con
`prefers-reduced-motion` il prato resta fermo, disegnato una volta sola.

Il logo dell'associazione è `public/terra-dei-bambini.webp`, ricavato da una
foto del disegno: fondo reso trasparente e ritagliato. Se arriva il file
originale dall'associazione basta sostituirlo mantenendo lo stesso nome (le
proporzioni indicate in `AlberoAnimato.tsx` sono 820x789).

Nulla è indicizzabile: `robots.txt` blocca tutto e ogni pagina è `noindex`.

## Sviluppo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build di produzione
npm run lint    # ESLint
```

Serve un Postgres raggiungibile e le variabili d'ambiente qui sotto in
`.env.local`.

## Configurazione

| Variabile | A cosa serve |
| --- | --- |
| `DATABASE_URL` (o `POSTGRES_URL`) | Postgres dove salvare le adesioni. Va bene qualsiasi provider (Neon, Vercel Postgres, Supabase, Railway). Su Vercel: Storage → collega il database → la variabile viene aggiunta da sola, con il nome che usa quel provider: il codice accetta entrambi i nomi. |
| `TDB_PASSWORD` | Password condivisa con le famiglie. |
| `TDB_ADMIN_PASSWORD` | Password della pagina di gestione. Diversa dalla precedente. |
| `TDB_SESSION_SECRET` | Facoltativa: chiave di firma dei cookie di sessione. Se assente viene derivata dalle password. |

Vedi `.env.example`.

## Come funziona la prenotazione dei posti

La tabella `tdb_slots` viene creata e popolata da sola alla prima apertura della
pagina: un record per ogni posto disponibile. L'adesione occupa il primo posto
libero con una singola `UPDATE ... FOR UPDATE SKIP LOCKED`, quindi due famiglie
che confermano nello stesso istante non possono prendere lo stesso posto; il
numero di telefono ha un indice univoco, così ogni famiglia occupa un solo posto.

Alle altre famiglie è visibile il solo nominativo: i numeri di telefono non
escono mai dal server se non nella pagina di gestione.

## A raccolta conclusa

1. Esporta il CSV dalla pagina di gestione.
2. Cancella i dati dal database: `DROP TABLE tdb_slots;` (o elimina il database).
3. Rimuovi le variabili d'ambiente e metti offline il deployment.
