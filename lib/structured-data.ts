import { SITE_URL } from "./constants"

interface Crumb {
  name: string
  path: string
}

/** BreadcrumbList schema. Pass the trail from Home down to the current page. */
export function breadcrumbLd(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  }
}

/** FAQPage schema from a list of question/answer pairs. */
export function faqLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
}

/** WebApplication schema for an individual tool page. */
export function toolAppLd({ name, description, path }: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isPartOf: { "@type": "WebSite", name: "JSON Forge", url: SITE_URL },
  }
}

/** Convenience: both breadcrumb (Home → tool) and WebApplication for a tool. */
export function toolStructuredData(tool: { name: string; shortName: string; description: string; path: string }) {
  return [
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: tool.shortName, path: tool.path },
    ]),
    toolAppLd({ name: tool.name, description: tool.description, path: tool.path }),
  ]
}
