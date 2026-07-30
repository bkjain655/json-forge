import Link from "next/link";
import { FileJson } from "lucide-react";
import { AUTHOR_NAME, AUTHOR_URL } from "@/lib/constants";

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
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
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
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
          <p>&copy; {currentYear} JSON Forge. All rights reserved.</p>
          <p>
            Built by{" "}
            <a
              href={AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground/80 hover:text-foreground hover:underline"
            >
              {AUTHOR_NAME}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
