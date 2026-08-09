import Container from "./Container";
import { siteConfig } from "@/lib/site-config";

const stats = [
  {
    value: siteConfig.stats.activeClients,
    label: "Clienti attivi",
  },
  {
    value: siteConfig.stats.dpoMandates,
    label: "Mandati come DPO esterno",
  },
  {
    value: "2",
    label: "Discipline presidiate: normativa e tecnica",
  },
  {
    value: "360°",
    label: "Da gap analysis a verifica tecnica sul campo",
  },
];

export default function StatsBand() {
  return (
    <section className="border-y border-line bg-paper-dim">
      <Container className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <div className="font-display text-4xl font-semibold tracking-tight text-ink">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-muted">{stat.label}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}
