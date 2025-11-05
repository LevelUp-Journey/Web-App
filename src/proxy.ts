import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["en", "es"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
    // Check if locale is in cookie
    const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
    if (localeCookie && locales.includes(localeCookie)) {
        return localeCookie;
    }

    // Check Accept-Language header
    const acceptLanguage = request.headers.get("accept-language");
    if (acceptLanguage) {
        // Parse the accept-language header
        const languages = acceptLanguage
            .split(",")
            .map((lang) => {
                const [locale, q = "1"] = lang.trim().split(";q=");
                return {
                    locale: locale.split("-")[0], // Get base language (en from en-US)
                    quality: Number.parseFloat(q),
                };
            })
            .sort((a, b) => b.quality - a.quality);

        // Find first matching locale
        for (const { locale } of languages) {
            if (locales.includes(locale)) {
                return locale;
            }
        }
    }

    return defaultLocale;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip internal Next.js paths and static files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes("/favicon.ico") ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/)
    ) {
        return NextResponse.next();
    }

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    if (pathnameHasLocale) {
        // Extract locale from pathname and set it in cookie
        const locale = pathname.split("/")[1];
        const response = NextResponse.next();
        response.cookies.set("NEXT_LOCALE", locale, {
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/",
        });
        return response;
    }

    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;

    const response = NextResponse.redirect(request.nextUrl);
    response.cookies.set("NEXT_LOCALE", locale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
    });

    return response;
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, api, static files)
        "/((?!_next|api|favicon.ico|.*\\..*).*)",
    ],
};
