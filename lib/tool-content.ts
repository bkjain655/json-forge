// Long-form, unique content for each tool page. This is what makes the pages
// rank (depth + intent coverage) and pass ad-network content review — so keep it
// genuinely useful and specific, never spun boilerplate.

export interface Faq {
  question: string
  answer: string
}

export interface UseCase {
  title: string
  description: string
}

export interface ToolContent {
  /** Short label used in "Related tools" links and breadcrumbs. */
  name: string
  path: string
  /** 2-3 paragraphs: what it does, how it works, why it's safe. */
  intro: string[]
  /** Ordered "how to use" steps. */
  howTo: string[]
  useCases: UseCase[]
  faqs: Faq[]
  /** Slugs of related tools for internal linking. */
  related: string[]
}

export const TOOLS: Record<string, ToolContent> = {
  formatter: {
    name: "JSON Formatter",
    path: "/tools/formatter",
    intro: [
      "A JSON formatter takes minified, escaped, or messy JSON and rewrites it with consistent indentation and line breaks so it is easy to read and review. Paste a single-line API response and get back a clean, hierarchical document you can actually scan.",
      "This formatter runs entirely in your browser — your JSON is never uploaded to a server. It parses the input with the same engine your code uses, so if it formats successfully, the document is valid JSON. You can switch to Minify to strip every unnecessary byte before shipping to production.",
    ],
    howTo: [
      "Paste or type your JSON into the input editor on the left.",
      "Choose Beautify to indent it, or Minify to compress it — the output updates live as you type.",
      "Adjust the indentation slider (1–8 spaces) to match your project's style.",
      "Copy the result, download it as a file, or switch the output to Tree view to explore nested data.",
    ],
    useCases: [
      { title: "Debugging API responses", description: "Turn a wall of minified JSON from a network tab into a readable, indented structure." },
      { title: "Preparing config files", description: "Standardise indentation across package.json, tsconfig, and other JSON configs." },
      { title: "Shrinking payloads", description: "Minify JSON to reduce bandwidth for production APIs, caches, or embedded data." },
    ],
    faqs: [
      { question: "Is my JSON uploaded anywhere?", answer: "No. All formatting happens locally in your browser using JavaScript. Nothing is sent to a server, so it is safe for private or sensitive data." },
      { question: "What's the difference between beautify and minify?", answer: "Beautify adds indentation and line breaks to make JSON human-readable. Minify removes all optional whitespace to make the file as small as possible for transmission or storage." },
      { question: "Why does the formatter show an error?", answer: "The tool validates as it formats. Common causes are trailing commas, single quotes instead of double quotes, unquoted keys, or missing brackets. The error and the exact line are highlighted in the editor." },
      { question: "How large a file can I format?", answer: "Everything runs on the main thread in your browser, so there is a 5 MB cap to keep the page responsive. Larger files should be processed with a command-line tool such as jq." },
      { question: "Does formatting change my data?", answer: "No. Formatting only changes whitespace. Keys, values, order, and types are preserved exactly." },
    ],
    related: ["validate", "compare", "schema-generator"],
  },
  validate: {
    name: "JSON Validator",
    path: "/tools/validate",
    intro: [
      "A JSON validator checks that your text is well-formed JSON and pinpoints the first place it breaks. Instead of a vague 'invalid JSON' from your app, you get the exact line and character where the parser fails.",
      "This validator lints as you type, underlining problems inline the moment they appear. It runs in your browser with the native JSON parser, so a passing document is guaranteed to parse anywhere else that follows the JSON spec.",
    ],
    howTo: [
      "Paste your JSON into the editor, or load a sample to see how errors are reported.",
      "Watch the gutter and underline markers — the exact position of any syntax error is flagged live.",
      "Fix the highlighted issue (a common one is a trailing comma or a missing quote).",
      "Once valid, copy the cleaned, formatted output from the result pane.",
    ],
    useCases: [
      { title: "Catching syntax errors", description: "Find the exact comma or bracket breaking a config file or API payload." },
      { title: "Verifying pasted data", description: "Confirm JSON copied from logs or docs is intact before using it in code." },
      { title: "Teaching JSON", description: "See in real time why a snippet is or isn't valid JSON." },
    ],
    faqs: [
      { question: "What counts as valid JSON?", answer: "Valid JSON uses double-quoted keys and strings, no trailing commas, no comments, and only the types string, number, boolean, null, array, and object. JSON5 and JavaScript object literals are more permissive and are not valid JSON." },
      { question: "Why is my JSON with comments invalid?", answer: "The JSON specification does not allow comments. If your file needs comments (like tsconfig.json), your tooling uses JSONC, a superset — but standard JSON parsers will reject it." },
      { question: "Does the validator check against a schema?", answer: "This tool validates syntax and structure. To generate or check against a JSON Schema, use the JSON Schema Generator." },
      { question: "Is my data private?", answer: "Yes. Validation runs entirely in your browser; nothing is transmitted or stored." },
    ],
    related: ["formatter", "schema-generator", "compare"],
  },
  compare: {
    name: "JSON Compare",
    path: "/tools/compare",
    intro: [
      "A JSON compare (or JSON diff) tool shows exactly what changed between two JSON documents — which keys were added, which were removed, and which values were modified. It's far more reliable than a plain text diff because it understands JSON structure.",
      "This tool compares objects by key and arrays as multisets, so reordering the same elements is not reported as a change. Everything is computed in your browser, making it safe for comparing sensitive configs or API responses.",
    ],
    howTo: [
      "Paste the original JSON on the left and the new version on the right.",
      "Click Compare to compute the structural difference.",
      "Review the added, removed, and modified sections in the results.",
      "Fix your data and re-run, or copy either side for further use.",
    ],
    useCases: [
      { title: "Reviewing config changes", description: "See precisely what a deployment or teammate changed in a JSON config." },
      { title: "Debugging API regressions", description: "Diff a known-good response against a broken one to isolate the change." },
      { title: "Auditing data migrations", description: "Confirm a transformed document only changed the fields you intended." },
    ],
    faqs: [
      { question: "How is this different from a text diff?", answer: "A text diff compares lines and is thrown off by formatting or key order. A JSON diff compares the parsed structure, so it reports genuine data changes regardless of whitespace or ordering." },
      { question: "Does reordering array items count as a change?", answer: "No. Arrays are compared as multisets, so the same elements in a different order are treated as unchanged. Only genuinely added or removed elements are reported." },
      { question: "Can it compare deeply nested objects?", answer: "Yes. The comparison is recursive and reports the full path to each added, removed, or modified value." },
      { question: "Is my data sent anywhere?", answer: "No. Both documents are compared locally in your browser." },
    ],
    related: ["merge", "formatter", "validate"],
  },
  merge: {
    name: "JSON Merge",
    path: "/tools/merge",
    intro: [
      "A JSON merge tool combines multiple JSON objects into one. It performs a deep merge: nested objects are merged recursively rather than overwritten wholesale, which is what you usually want when layering configuration.",
      "When the same key exists in more than one object, values from later objects win. The merge runs in your browser, so you can safely combine environment configs, feature flags, or partial API payloads without sending them anywhere.",
    ],
    howTo: [
      "Paste your first JSON object into the first input.",
      "Add more inputs and paste each additional object to merge.",
      "Click Merge — later objects override earlier ones on conflicting keys.",
      "Copy or download the combined result.",
    ],
    useCases: [
      { title: "Layering configuration", description: "Merge a base config with environment-specific overrides into a single document." },
      { title: "Combining partial responses", description: "Stitch together paginated or partial API payloads." },
      { title: "Applying defaults", description: "Merge user-supplied values on top of a defaults object." },
    ],
    faqs: [
      { question: "Is this a deep or shallow merge?", answer: "Deep. Nested objects are merged recursively, so overriding one nested key does not discard its siblings." },
      { question: "What happens on conflicting keys?", answer: "The value from the later object in the list wins. Order your inputs from lowest to highest priority." },
      { question: "How are arrays handled?", answer: "Arrays are replaced by the later value rather than concatenated, which matches how most configuration systems behave." },
      { question: "Is my data private?", answer: "Yes. The merge is computed entirely in your browser." },
    ],
    related: ["compare", "formatter", "validate"],
  },
  "json-yaml": {
    name: "JSON to YAML",
    path: "/tools/json-yaml",
    intro: [
      "This converter transforms JSON into YAML and YAML back into JSON. YAML is a human-friendly superset of JSON used widely for configuration — Kubernetes manifests, GitHub Actions, Docker Compose, and CI pipelines all use it.",
      "Because YAML is a superset of JSON, any valid JSON converts cleanly to YAML. The conversion happens in your browser using a spec-compliant parser, so your configuration data never leaves your machine.",
    ],
    howTo: [
      "Choose the JSON → YAML or YAML → JSON tab.",
      "Paste your source data into the input editor.",
      "Click Convert to produce the output in the target format.",
      "Copy or download the converted result.",
    ],
    useCases: [
      { title: "Writing Kubernetes manifests", description: "Convert a JSON object into the YAML that Kubernetes and Helm expect." },
      { title: "Editing CI pipelines", description: "Move between JSON tooling output and the YAML used by GitHub Actions or GitLab CI." },
      { title: "Making configs readable", description: "Turn dense JSON config into comment-friendly, indentation-based YAML." },
    ],
    faqs: [
      { question: "Is all JSON valid YAML?", answer: "Yes. YAML is a superset of JSON, so every valid JSON document is also valid YAML and converts without loss." },
      { question: "Does YAML support comments?", answer: "Yes, YAML supports comments with the # character. Note that comments are dropped when converting YAML back to JSON, since JSON has no comment syntax." },
      { question: "Why did my YAML fail to convert?", answer: "YAML is whitespace-sensitive. Inconsistent indentation, tabs instead of spaces, or unquoted special characters are the usual culprits — the error message names the line." },
      { question: "Is my data uploaded?", answer: "No. Conversion runs locally in your browser." },
    ],
    related: ["json-xml", "json-csv", "formatter"],
  },
  "json-xml": {
    name: "JSON to XML",
    path: "/tools/json-xml",
    intro: [
      "This converter turns JSON into XML and XML into JSON. XML remains common in enterprise systems, SOAP APIs, RSS feeds, and legacy integrations, so moving between the two formats is a frequent task.",
      "The conversion runs entirely in your browser. JSON's object and array structures are mapped to XML elements, and XML elements and attributes are mapped back to JSON keys, so you can round-trip data between modern and legacy systems.",
    ],
    howTo: [
      "Choose the JSON → XML or XML → JSON tab.",
      "Paste your source data into the input editor.",
      "Click Convert to generate the output.",
      "Copy or download the converted result.",
    ],
    useCases: [
      { title: "Integrating with SOAP APIs", description: "Convert JSON payloads to the XML that older enterprise services require." },
      { title: "Working with RSS or sitemaps", description: "Move XML feed data into JSON for easier processing." },
      { title: "Migrating legacy data", description: "Bridge XML-based systems and JSON-based applications." },
    ],
    faqs: [
      { question: "Do JSON and XML map perfectly?", answer: "Not always. XML has concepts JSON lacks (attributes, namespaces, mixed content) and JSON has arrays, which XML represents as repeated elements. The converter handles the common cases; complex XML may need manual adjustment." },
      { question: "How are JSON arrays represented in XML?", answer: "Array items become repeated sibling elements with the same tag name, which is the conventional XML representation of a list." },
      { question: "Why is my XML invalid?", answer: "XML requires a single root element and properly closed, well-nested tags. Missing a root element or a closing tag is the most common error." },
      { question: "Is my data private?", answer: "Yes. All conversion happens in your browser." },
    ],
    related: ["json-yaml", "json-csv", "formatter"],
  },
  "json-csv": {
    name: "JSON to CSV",
    path: "/tools/json-csv",
    intro: [
      "This converter turns JSON into CSV and CSV back into JSON. CSV is the lingua franca of spreadsheets and data analysis, so exporting a JSON array of objects to CSV — or importing spreadsheet data as JSON — is a common bridge between developers and analysts.",
      "The tool follows RFC 4180 quoting rules, so values containing commas, quotes, or newlines are escaped correctly. Everything runs in your browser, keeping your data private.",
    ],
    howTo: [
      "Choose the JSON → CSV or CSV → JSON tab.",
      "Paste a JSON array of objects, or upload/paste a CSV file.",
      "Click Convert to generate the output.",
      "Copy or download the result for use in Excel, Google Sheets, or your code.",
    ],
    useCases: [
      { title: "Exporting data for analysts", description: "Turn a JSON API response into a CSV that opens directly in Excel or Google Sheets." },
      { title: "Importing spreadsheet data", description: "Convert a CSV export into a JSON array for use in an application." },
      { title: "Building reports", description: "Flatten JSON records into tabular form for reporting tools." },
    ],
    faqs: [
      { question: "What JSON shape converts to CSV?", answer: "An array of flat objects works best — each object becomes a row and each key becomes a column. Deeply nested objects don't map neatly to a flat table and may need flattening first." },
      { question: "How are commas and quotes in values handled?", answer: "The converter follows RFC 4180: values containing a comma, double quote, or newline are wrapped in quotes, and embedded quotes are doubled." },
      { question: "Does the first CSV row become keys?", answer: "Yes. When converting CSV to JSON, the header row is used as the object keys for every subsequent row." },
      { question: "Is my data uploaded?", answer: "No. Conversion runs entirely in your browser, including uploaded CSV files." },
    ],
    related: ["json-xml", "json-yaml", "formatter"],
  },
  "schema-generator": {
    name: "JSON Schema Generator",
    path: "/tools/schema-generator",
    intro: [
      "A JSON Schema generator infers a schema from a sample JSON document. Instead of writing a schema by hand, you paste representative data and get a starting schema that describes its types and structure — ready to refine.",
      "The generated schema follows the JSON Schema specification and can be used to validate data, document an API contract, or drive code and form generation. Generation runs in your browser, so your sample data stays private.",
    ],
    howTo: [
      "Paste a representative JSON document into the input.",
      "Click Generate Schema to infer types and structure.",
      "Review the schema — add descriptions, formats, and required rules as needed.",
      "Copy the schema into your validation tooling or API docs.",
    ],
    useCases: [
      { title: "Documenting API contracts", description: "Produce a schema that describes exactly what your endpoint returns." },
      { title: "Validating incoming data", description: "Use the schema to reject malformed requests before they reach your logic." },
      { title: "Generating types and forms", description: "Feed the schema into codegen or form-builder tools." },
    ],
    faqs: [
      { question: "Is the generated schema complete?", answer: "It's a strong starting point inferred from your sample. You should refine it — add descriptions, value formats (email, date-time), enums, and adjust which fields are truly required." },
      { question: "Which JSON Schema version does it target?", answer: "The output follows the widely supported JSON Schema draft conventions (type, properties, required, items) that work across most validators." },
      { question: "How does it handle arrays?", answer: "It infers the item schema from the first element, assuming a homogeneous array. Mixed-type arrays should be reviewed and adjusted manually." },
      { question: "Is my sample data private?", answer: "Yes. Schema generation runs locally in your browser." },
    ],
    related: ["validate", "formatter", "compare"],
  },
}
