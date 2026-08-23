// Pagina temporanea, non collegata al resto del sito: raccolta adesioni alla
// banca ore del progetto parentale "La Terra dei Bambini" per l'anno 2026-2027.
// Da rimuovere (insieme alla tabella sul database) a raccolta conclusa.

export const tdbConfig = {
  slug: "terra-dei-bambini",
  // Il nome dell'associazione lo aggiunge il template del layout.
  title: "Banca ore 2026/2027",
  subtitle: "Partecipazione attiva delle famiglie alla Terra",
  intro:
    "Ogni famiglia sceglie un gruppo in cui mettere a disposizione le proprie 20 ore di servizio. I posti si aggiornano in tempo reale: quando un gruppo è al completo non è più selezionabile.",
};

/** Testo del regolamento, riportato integralmente come da documento associativo. */
export const regolamento = {
  heading: "Regolamento e patto di corresponsabilità — La Terra dei Bambini",
  section: "1.2 — Il ruolo della famiglia",
  paragraphs: [
    "La famiglia e La terra dei Bambini hanno un ruolo sinergico e fondamentale nella vita del bambino: supportano, accompagnano, aiutano (se necessario) e sostengono la sua crescita emotiva, cognitiva e psicologica. La responsabilità degli adulti impegnati nella nascita dell'embrione dell'uomo di domani è di vitale importanza. È quindi condizione necessaria che le parti coinvolte si tengano forte la mano e sanciscano un patto che faccia da garanzia verso la strada scelta e che abbia come unico fine il bene del bambino.",
    "La dimensione parentale inoltre comporta una partecipazione attiva delle famiglie, che avranno la possibilità di mettere in campo le proprie competenze, conoscenze e professionalità, nonché sostenere e collaborare in modo pratico il buon funzionamento dell'associazione. I genitori potranno essere promotori di iniziative, conferenze e laboratori, così da poter vivere e abbracciare lo spirito associativo e di gruppo, che stimola e permette un confronto, uno scambio e un aiuto reciproco.",
    "Per garantire il buon funzionamento del progetto e mantenere un canale comunicativo attivo fra l'associazione, le educatrici e le famiglie, si fa riferimento ai genitori che in occasione della prima assemblea annuale verranno nominati referenti delle famiglie e ai membri del consiglio direttivo.",
  ],
  highlight:
    "Da settembre 2025 viene istituita, come deciso dall'assemblea dei soci in data 28 gennaio 2025, una banca ore a favore della sostenibilità del progetto. Ogni famiglia si impegna a dedicare almeno 20 ore di servizio in opere di cura, crescita, manutenzione e promozione, inserendosi nei gruppi che verranno individuati dal Consiglio Direttivo secondo le esigenze. Le famiglie che non vogliano o non possano mettere a disposizione il proprio tempo, si impegnano a versare 200 Euro a inizio anno.",
  closing:
    "Crediamo fortemente nella responsabilità di ciascuno nell'essere garante del proprio operato e nell'impegno assunto.",
};

export type TdbGroup = {
  id: string;
  name: string;
  capacity: number;
  /** Attività svolte dal gruppo, una voce per riga. */
  tasks: string[];
  /** Il contatore dei posti non viene mostrato (contributo economico). */
  unlimited?: boolean;
  /** Posti già assegnati fuori dalla pagina: il gruppo nasce chiuso. */
  preassigned?: string[];
  /** Alternativa alle ore di servizio, mostrata a parte in fondo alla pagina. */
  alternative?: boolean;
};

export const tdbGroups: TdbGroup[] = [
  {
    id: "consiglio-direttivo",
    name: "Consiglio direttivo",
    capacity: 3,
    tasks: ["Gestione e indirizzo dell'associazione."],
    preassigned: ["Samuele", "Andrea", "Leda"],
  },
  {
    id: "cura-del-verde",
    name: "Cura del verde",
    capacity: 5,
    tasks: [
      "Taglio del prato e piccole potature.",
      "Pulizia della zona dell'orto, della zona di ingresso e dell'area box.",
    ],
  },
  {
    id: "comunicazione-digitale",
    name: "Comunicazione e parte digitale",
    capacity: 2,
    tasks: [
      "Gestione del sito internet dell'associazione: aggiornamenti e sistemazioni.",
      "Preparazione di volantini e materiale informativo.",
      "Lavoro di restituzione delle foto di fine anno.",
    ],
  },
  {
    id: "manutenzione",
    name: "Manutenzione",
    capacity: 6,
    tasks: [
      "Manutenzione dei giochi dei bambini e degli arredi, montaggio mobili.",
      "Piccole sistemazioni e riparazioni.",
      "Verniciature.",
    ],
  },
  {
    id: "discarica",
    name: "Trasporto materiali e discarica",
    capacity: 1,
    tasks: [
      "Conferimento dei rifiuti in discarica e all'isola ecologica.",
      "Trasporto di materiali per l'associazione: acquisti ingombranti, mobili da montare, materiale per le feste.",
      "Capita di dover spostare cose voluminose: è preferibile avere a disposizione un mezzo adatto, tipo un furgoncino.",
    ],
  },
  {
    id: "feste-giardino-aperto",
    name: "Feste e giardino aperto",
    capacity: 5,
    tasks: [
      "Organizzazione delle feste dell'associazione e del progetto parentale (Natale, fine anno, altro): cibo, attività, eventi, eventuali raccolte.",
      "Organizzazione e gestione del giardino aperto: raccolta delle disponibilità, regole, passaggio delle chiavi.",
      "Preparazione degli spazi per le assemblee.",
    ],
  },
  {
    id: "acquisti",
    name: "Acquisti all'ingrosso e al dettaglio",
    capacity: 2,
    tasks: [
      "Acquisti periodici al dettaglio e acquisti una tantum (IKEA, grandi magazzini).",
      "Piccole commissioni: stampe foto, volantini, lavanderia.",
    ],
  },
  {
    id: "pulizie",
    name: "Pulizie",
    capacity: 8,
    tasks: [
      "Pulizie non ordinarie: pulizia approfondita di vetri, infissi, bocche di lupo, ragnatele, terrazzo e verande.",
      "Pulizie ordinarie della zona associativa e dello spazio dedicato al progetto parentale.",
      "Pulizia delle aree esterne e dei marciapiedi.",
    ],
  },
  {
    id: "contributo-economico",
    name: "Contributo economico",
    capacity: 60,
    unlimited: true,
    alternative: true,
    tasks: [
      "Per chi non vuole o non può mettere a disposizione il proprio tempo: versamento di 200 euro a inizio anno, come previsto dal regolamento.",
    ],
  },
];

export const tdbGroupsById = new Map(tdbGroups.map((group) => [group.id, group]));
