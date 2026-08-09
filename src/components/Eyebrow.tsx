export default function Eyebrow({
  children,
  tone = "amber",
}: {
  children: React.ReactNode;
  tone?: "amber" | "teal" | "paper";
}) {
  const toneClasses = {
    amber: "text-amber border-amber/40 bg-amber/10",
    teal: "text-teal border-teal/40 bg-teal/10",
    paper: "text-paper border-paper/30 bg-paper/10",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-widest ${toneClasses}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
