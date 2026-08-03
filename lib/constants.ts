// Canonical host is the apex; www redirects to it in production. Keep this in
// sync with the NEXT_PUBLIC_SITE_URL env var set in Vercel.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jsonforge.com";

export const AUTHOR_NAME = "Bhavesh Kumar";
export const AUTHOR_URL = "https://bkjlabs.com";
export const AUTHOR_TAGLINE = "I build enterprise SaaS front-ends";

export const KEYWORDS = [
    "JSON tools", "JSON Forge", "JSON utilities", "JSON operations", "JSON online tools",
    "Merge JSON", "Compare JSON", "JSON formatter", "JSON validator",
    "JSON to YAML", "JSON to XML", "JSON schema generator",
    "JSON parser", "JSON minifier", "Online JSON editor",
    "Free JSON tools", "Best JSON tools", "JSON converter",
  ].join(", ");