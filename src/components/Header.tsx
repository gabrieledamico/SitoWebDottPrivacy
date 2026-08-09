"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Container from "./Container";
import { navItems, siteConfig } from "@/lib/site-config";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line-dark/20 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/90">
      <Container>
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-paper"
            onClick={() => setOpen(false)}
          >
            Dott<span className="text-amber">Privacy</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 rounded-md px-3 py-2 font-sans text-sm text-paper/85 transition hover:text-paper"
                    aria-expanded={servicesOpen}
                  >
                    {item.label}
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className="mt-px"
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div
                    className={`absolute left-0 top-full w-64 rounded-lg border border-line-dark/30 bg-ink-2 p-2 shadow-xl transition ${
                      servicesOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-3 py-2 font-sans text-sm text-paper/85 transition hover:bg-ink-3 hover:text-paper"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 font-sans text-sm transition hover:text-paper ${
                    pathname === item.href ? "text-paper" : "text-paper/85"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 rounded-md bg-amber px-4 py-2 font-sans text-sm font-semibold text-ink transition hover:bg-amber/90"
            >
              Richiedi una consulenza
            </Link>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-md text-paper lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Apri menu"
            aria-expanded={open}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M4 4l14 14M18 4L4 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M3 6h16M3 11h16M3 16h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line-dark/20 bg-ink lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2.5 font-sans text-base text-paper/90"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 flex flex-col border-l border-line-dark/30 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded-md px-3 py-2 font-sans text-sm text-paper/70"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/contatti"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 font-sans text-sm font-semibold text-ink"
              onClick={() => setOpen(false)}
            >
              Richiedi una consulenza
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-1 px-3 py-2 font-mono text-xs text-paper/50"
            >
              {siteConfig.email}
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
