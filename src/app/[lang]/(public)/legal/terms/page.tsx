import { getDictionary } from "@/lib/i18n";

export default async function TermsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");

    return (
        <div>
            <h1>{dict?.legal.terms.title || "Terms of Service"}</h1>
            <p>
                {dict?.legal.terms.content ||
                    "This is the terms of service page."}
            </p>
        </div>
    );
}
