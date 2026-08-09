import Link from "next/link";
import Container from "./Container";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-dark/30 bg-ink text-paper">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-lg font-semibold tracking-tight">
              Dott<span className="text-amber">Privacy</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
              {siteConfig.tagline}
            </p>
            <div className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-paper/40">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              GDPR
              <span className="mx-1">/</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              NIS2
              <span className="mx-1">/</span>
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              ISO 27001
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-paper/40">
              Servizi
            </div>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-paper/75">
              <li>
                <Link href="/servizi/nis2" className="hover:text-paper">
                  NIS2
                </Link>
              </li>
              <li>
                <Link href="/servizi/iso27001" className="hover:text-paper">
                  ISO 27001
                </Link>
              </li>
              <li>
                <Link href="/servizi/gdpr-dpo" className="hover:text-paper">
                  GDPR &amp; DPO esterno
                </Link>
              </li>
              <li>
                <Link
                  href="/servizi/cybersecurity-advisory"
                  className="hover:text-paper"
                >
                  Cybersecurity Advisory
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-paper/40">
              Studio
            </div>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-paper/75">
              <li>
                <Link href="/chi-sono" className="hover:text-paper">
                  Chi sono
                </Link>
              </li>
              <li>
                <Link href="/clienti" className="hover:text-paper">
                  Clienti &amp; casi studio
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="hover:text-paper">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-paper/40">
              Contatti
            </div>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-paper/75">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-paper"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-paper/50">{siteConfig.phone}</li>
              <li className="text-paper/50">
                {siteConfig.address.city}, Italia
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line-dark/30 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Gabriele D&apos;Amico — DottPrivacy. P.IVA {siteConfig.piva}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-paper/70">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="hover:text-paper/70">
              Cookie Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
