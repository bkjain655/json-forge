"use client";
import { pageview } from "@/lib/gtag_utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const GoogleAnalyticsProvider = () => {
    const pathname = usePathname();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            pageview(location.href)
        }
    }, [pathname]);

    return ""
}