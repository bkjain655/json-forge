// Shared by the FAQ accordion (client) and the FAQPage JSON-LD on the homepage
// (server), so it has to live outside the "use client" module.
export const CONTENT = [
  {
    id: "panel1",
    title: "What is JSON?",
    description: [
      "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy to read and write for both humans and machines. It is widely used in APIs, configuration files, and data storage due to its simplicity and flexibility.",
      "JSON is based on key-value pairs, making it similar to a dictionary or an object in most programming languages. The format is language-independent but widely supported across various programming environments.",
      "One of the biggest advantages of JSON is its compatibility with JavaScript, as it can be easily parsed and manipulated within web applications. This makes it a preferred choice for transmitting data between a server and a client."
    ]
  },
  {
    id: "panel2",
    title: "What is YAML?",
    description: [
      "YAML (YAML Ain’t Markup Language) is a human-friendly data serialization format commonly used for configuration files and data exchange. It is known for its readability and ease of use compared to formats like JSON and XML.",
      "YAML uses indentation rather than brackets or commas to structure data, making it more visually appealing and easier to comprehend. This format supports complex data types like mappings (dictionaries), sequences (lists), and scalars (strings, numbers, booleans).",
      "YAML is widely used in DevOps tools, Kubernetes configurations, CI/CD pipelines, and various software applications where human-readable configuration files are needed."
    ]
  },
  {
    id: "panel3",
    title: "Why use JSON and YAML?",
    description: [
      "Both JSON and YAML serve as widely adopted data formats for different use cases. JSON is favored for APIs, web applications, and data storage because of its machine-friendly structure and JavaScript compatibility.",
      "YAML, on the other hand, is preferred for configuration files due to its readability and reduced syntax complexity. Many tools and frameworks, such as Kubernetes, Ansible, and GitHub Actions, use YAML extensively for configuration management.",
      "The choice between JSON and YAML depends on the specific requirements of a project. JSON is better suited for structured data manipulation, while YAML excels in human-readable configuration settings."
    ]
  },
  {
    id: "panel4",
    title: "Real-world Examples of JSON & YAML",
    description: [
      "JSON is commonly used in REST APIs to exchange data between a client and a server. For example, a weather API might return weather conditions in JSON format, making it easy for developers to integrate into applications.",
      "YAML is widely used in Kubernetes for defining deployment configurations. A Kubernetes manifest file written in YAML specifies how applications should be deployed and managed in a cluster.",
      "Both formats also find applications in cloud infrastructure, application configurations, and data serialization tasks. Understanding their strengths allows developers to choose the right format for their needs."
    ]
  },
  {
    id: "panel5",
    title: "JSON & YAML Tools in Our Application",
    description: [
      "Our JSON Forge web application offers various utilities to work with JSON and YAML effectively. Some of the key features include:",
      "JSON Formatter and Validator: Helps format and validate JSON structures for error-free data exchange.",
      "JSON to YAML and YAML to JSON Converter: Allows seamless conversion between the two formats for different use cases.",
      "JSON Merge and Compare: Enables merging multiple JSON objects and comparing differences between JSON files.",
      "These tools are designed to enhance productivity for developers, making data handling easier and more efficient."
    ]
  }
];
