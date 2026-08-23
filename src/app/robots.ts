import type { MetadataRoute } from "next";

// Nulla di quanto è ospitato qui va indicizzato.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
