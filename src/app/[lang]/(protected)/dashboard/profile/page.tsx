import { getDictionary } from "@/app/[lang]/dictionaries";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");

    return (
        <div>
            <h1>{dict.profile.title}</h1>
        </div>
    );
}
