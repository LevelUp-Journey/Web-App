import { getDictionary, type Locale } from "@/app/[lang]/dictionaries";
import { CommunityFeed } from "@/components/community/community-feed";

export default async function CommunityFeedPage({
    params,
}: {
    params: Promise<{ lang: string; communityId: string }>;
}) {
    const { lang, communityId } = await params;
    const locale = (lang as Locale) || "en";
    const dict = await getDictionary(locale);

    return <CommunityFeed communityId={communityId} dict={dict} />;
}
