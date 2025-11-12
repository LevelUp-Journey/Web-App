import { getDictionary, type Locale } from "@/app/[lang]/dictionaries";
import { CommunityFeed } from "@/components/community/community-feed";

interface CommunityFeedPageProps {
    params: { lang: string; communityId: string };
}

export default async function CommunityFeedPage({
    params,
}: CommunityFeedPageProps) {
    const locale = (params.lang as Locale) || "en";
    const dict = await getDictionary(locale);

    return <CommunityFeed communityId={params.communityId} dict={dict} />;
}
