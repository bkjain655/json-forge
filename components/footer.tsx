import Link from "next/link";
import { FileJson } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-evenly gap-6 md:flex-row text-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          <span className="text-sm font-semibold">JSON Forge</span>
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/about-us" className="hover:underline">
            About Us
          </Link>
          {/* <Link href="/connect" className="hover:underline">
            Connect with Me
          </Link> */}
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
          <Link href="/contact-us" className="hover:underline">
            Contact Us
          </Link>
        </div>

        {/* Copyright Section */}
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} JSON Forge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}