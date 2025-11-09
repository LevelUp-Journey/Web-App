import { getDictionary } from "@/lib/i18n";

export default async function PrivacyPolicyPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");

    return (
        <div>
            <h1>{dict?.legal.privacyPolicy.title || "Privacy Policy"}</h1>
            <p>
                {dict?.legal.privacyPolicy.content ||
                    "This is the privacy policy page."}
            </p>
        </div>
    );
}
