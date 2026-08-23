import Image from "next/image";

/** Foglioline che si staccano dalla chioma e scendono, sfalsate nel tempo. */
const foglieCadenti = [
  { sinistra: "26%", alto: "18%", deriva: "-46px", discesa: "210px", giro: "-240deg", ritardo: "0s", scala: 1 },
  { sinistra: "62%", alto: "14%", deriva: "38px", discesa: "240px", giro: "200deg", ritardo: "2.4s", scala: 0.8 },
  { sinistra: "44%", alto: "26%", deriva: "-18px", discesa: "190px", giro: "300deg", ritardo: "4.8s", scala: 0.9 },
  { sinistra: "74%", alto: "24%", deriva: "26px", discesa: "170px", giro: "-180deg", ritardo: "6.6s", scala: 0.7 },
];

export default function AlberoAnimato({
  larghezza = "clamp(200px, 46vw, 340px)",
  priorita = false,
}: {
  larghezza?: string;
  priorita?: boolean;
}) {
  return (
    <div className="relative mx-auto" style={{ width: larghezza }}>
      {/* alone morbido dietro l'albero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-14%] rounded-full opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(211,223,196,0.9), rgba(247,243,232,0) 70%)",
        }}
      />

      <Image
        src="/terra-dei-bambini.webp"
        alt="La Terra dei Bambini APS — albero con il bambino tra le radici"
        width={820}
        height={789}
        priority={priorita}
        sizes="(max-width: 640px) 60vw, 340px"
        className="respira relative h-auto w-full"
      />

      {foglieCadenti.map((foglia) => (
        <span
          key={foglia.sinistra + foglia.ritardo}
          aria-hidden
          className="foglia-cade pointer-events-none absolute"
          style={{
            left: foglia.sinistra,
            top: foglia.alto,
            animationDelay: foglia.ritardo,
            transform: `scale(${foglia.scala})`,
            ["--deriva" as string]: foglia.deriva,
            ["--discesa" as string]: foglia.discesa,
            ["--giro" as string]: foglia.giro,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1c3.2 2.1 4.6 5 4.6 7.4A4.6 4.6 0 0 1 8 15a4.6 4.6 0 0 1-4.6-6.6C3.4 6 4.8 3.1 8 1Z"
              fill="#9caf88"
              fillOpacity="0.85"
            />
            <path d="M8 3.4V13" stroke="#38492f" strokeOpacity="0.3" strokeWidth="0.9" />
          </svg>
        </span>
      ))}
    </div>
  );
}
