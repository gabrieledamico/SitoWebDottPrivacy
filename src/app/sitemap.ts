import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/chi-sono",
    "/servizi/nis2",
    "/servizi/iso27001",
    "/servizi/gdpr-dpo",
    "/servizi/cybersecurity-advisory",
    "/clienti",
    "/contatti",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/servizi/nis2" ? 0.9 : 0.7,
  }));
}
