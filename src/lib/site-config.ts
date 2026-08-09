// Dati reali dello studio: sostituire i placeholder prima del go-live.
export const siteConfig = {
  name: "DottPrivacy",
  fullName: "Gabriele D'Amico — DottPrivacy",
  tagline:
    "Il consulente che parla sia il linguaggio del Garante che quello del tuo IT manager.",
  url: "https://www.dottprivacy.it",
  email: "gdamico@dottprivacy.it",
  phone: "+39 000 000 0000", // TODO: inserire numero reale
  pec: "gabrieledamico@pec.it", // TODO: verificare indirizzo PEC reale
  piva: "IT00000000000", // TODO: inserire P.IVA reale
  address: {
    street: "Via da definire, 1", // TODO: inserire indirizzo reale
    city: "Milano",
    zip: "20100",
    country: "IT",
  },
  bookingUrl: "", // TODO: link Calendly / booking, se disponibile
  formEndpoint: "", // TODO: endpoint Formspree/altro per il form contatti
  socials: {
    linkedin: "https://www.linkedin.com/", // TODO: profilo LinkedIn reale
  },
  stats: {
    activeClients: "100+",
    dpoMandates: "10+",
  },
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/chi-sono", label: "Chi sono" },
  {
    href: "/servizi/nis2",
    label: "Servizi",
    children: [
      { href: "/servizi/nis2", label: "NIS2" },
      { href: "/servizi/iso27001", label: "ISO 27001" },
      { href: "/servizi/gdpr-dpo", label: "GDPR & DPO esterno" },
      { href: "/servizi/cybersecurity-advisory", label: "Cybersecurity Advisory" },
    ],
  },
  { href: "/clienti", label: "Clienti" },
  { href: "/contatti", label: "Contatti" },
];
