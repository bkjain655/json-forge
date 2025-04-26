export const metadata = {
    title: "Privacy Policy | JSON Forge",
    description: "Read the Privacy Policy of JSON Forge regarding data collection, cookies, and user privacy.",
    keywords: [
        "Privacy Policy",
        "JSON Forge Privacy",
        "User Privacy JSON",
        "Data Collection Policy",
        "Google Ads Policy Compliance",
        "JSON Tools Privacy",
        "User Data Collection",
        "Cookies Policy",
        "User Privacy Rights",
        "Data Protection",
        "Online Tool Privacy"
    ],
    openGraph: {
        title: "Privacy Policy | JSON Forge",
        description: "Read the Privacy Policy of JSON Forge regarding data collection, cookies, and user privacy.",
        url: "https://jsonforge.com/privacy-policy",
        siteName: "JSON Forge",
        type: "website"
    },
};
  
export default function PrivacyPolicy() {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
  
          <p className="mb-4">
            Welcome to JSON Forge. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
          </p>
  
          <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
          <p className="mb-4">
            JSON Forge does not collect any personal data from users. However, third-party services such as Google Ads may collect information using cookies and similar technologies.
          </p>
  
          <h2 className="text-2xl font-semibold mb-2">Cookies</h2>
          <p className="mb-4">
            We use cookies to enhance user experience and serve relevant ads through Google Ads. By using our site, you consent to the use of cookies.
          </p>
  
          <h2 className="text-2xl font-semibold mb-2">Third-Party Links</h2>
          <p className="mb-4">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or the content of these external sites.
          </p>
  
          <h2 className="text-2xl font-semibold mb-2">Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy occasionally. Changes will be posted on this page with an updated effective date.
          </p>
  
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us through the <a href="/contact-us" className="text-blue-600 underline">Contact Us</a> page.
          </p>
        </div>
      </div>
    );
}