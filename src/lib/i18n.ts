import "server-only";
import { getDictionary, type Locale } from "@/app/[lang]/dictionaries";

export type { Locale };

export { getDictionary };

// Type for the dictionary structure
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

// Helper function to get locale from params
export async function getLocaleFromParams(
    params: Promise<{ lang: string }> | { lang: string },
): Promise<Locale> {
    const resolvedParams = await params;
    return resolvedParams.lang as Locale;
}

// Validate if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
    return locale === "en" || locale === "es";
}

// Get the opposite locale (for language switcher)
export function getAlternateLocale(currentLocale: Locale): Locale {
    return currentLocale === "en" ? "es" : "en";
}

// Format date according to locale
export function formatDate(date: Date, locale: Locale): string {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}

// Format number according to locale
export function formatNumber(num: number, locale: Locale): string {
    return new Intl.NumberFormat(locale).format(num);
}
