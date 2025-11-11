import { getDictionary } from "@/app/[lang]/dictionaries";
import { CommunityTabs } from "@/components/community/community-tabs";

export default async function CommunityPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");

    return (
        <div className="container mx-auto p-6">
            <CommunityTabs dict={dict} />
        </div>
    );
}
