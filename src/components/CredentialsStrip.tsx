import Container from "./Container";

const credentials = [
  "ISO 27001 Lead Auditor",
  "NIS2 Specialist",
  "DPO esterno — ~10 mandati attivi",
  "Cybersecurity Advisory",
];

export default function CredentialsStrip() {
  return (
    <div className="border-b border-line bg-white">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
        {credentials.map((credential) => (
          <span
            key={credential}
            className="font-mono text-xs uppercase tracking-widest text-muted"
          >
            {credential}
          </span>
        ))}
      </Container>
    </div>
  );
}
