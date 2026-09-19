import { writeFile } from "node:fs/promises";
import { projects } from "../src/data/content.js";
import { expertise } from "../src/data/expertise.js";
const input = process.argv[2];
if (!input)
  throw new Error(
    "Pass the final public origin: npm run sitemap -- https://your-domain.example",
  );
const origin = new URL(input);
if (
  origin.protocol !== "https:" ||
  origin.pathname !== "/" ||
  origin.search ||
  origin.hash ||
  origin.username ||
  origin.password
)
  throw new Error(
    "Use an HTTPS origin without paths, credentials or query parameters.",
  );
const urls = [
  "/",
  ...expertise.map((item) => `/${item.path}`),
  ...projects.map((p) => `/projects/${p.slug}`),
];
await writeFile(
  new URL("../public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `\n  <url><loc>${origin.origin}${path}</loc></url>`).join("")}\n</urlset>\n`,
);
await writeFile(
  new URL("../public/robots.txt", import.meta.url),
  `User-agent: *\nAllow: /\nSitemap: ${origin.origin}/sitemap.xml\n`,
);
console.info("Sitemap and robots.txt generated. Rebuild before deployment.");
