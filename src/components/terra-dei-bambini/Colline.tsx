/** Colline morbide che chiudono la testata, come il prato del disegno. */
export default function Colline({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`block h-16 w-full sm:h-24 ${className}`}
    >
      <path
        d="M0 78c120-26 240-38 360-24 120 15 240 55 360 55s240-40 360-55c120-14 240-2 360 24v42H0V78Z"
        fill="var(--color-salvia-tenue)"
      />
      <path
        d="M0 98c140-30 260-26 380-8 120 17 250 30 340 30s220-13 340-30c120-18 240-22 380 8v22H0V98Z"
        fill="var(--color-salvia-chiara)"
      />
    </svg>
  );
}
