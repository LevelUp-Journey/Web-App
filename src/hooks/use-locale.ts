"use client";

import { useParams } from "next/navigation";

export type Locale = "en" | "es";

export function useLocale(): Locale {
    const params = useParams();
    const locale = params?.lang as string;

    // Validate and return locale, default to 'en' if invalid
    if (locale === "en" || locale === "es") {
        return locale;
    }

    return "en";
}
