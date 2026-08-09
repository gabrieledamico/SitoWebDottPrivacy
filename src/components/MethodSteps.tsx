export type MethodStep = {
  number: string;
  title: string;
  description: string;
  detail?: string;
};

export default function MethodSteps({ steps }: { steps: MethodStep[] }) {
  return (
    <ol className="relative flex flex-col gap-0">
      {steps.map((step, index) => (
        <li key={step.number} className="relative flex gap-6 pb-10 last:pb-0">
          {index < steps.length - 1 && (
            <span className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-line-dark/40" />
          )}
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-teal/40 bg-teal-dim font-mono text-sm font-medium text-teal">
            {step.number}
          </span>
          <div className="pt-1.5">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
              {step.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {step.description}
            </p>
            {step.detail && (
              <p className="mt-2 max-w-2xl font-mono text-xs leading-relaxed text-ink/50">
                {step.detail}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
