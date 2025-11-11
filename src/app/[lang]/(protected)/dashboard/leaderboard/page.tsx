import { getDictionary } from "@/app/[lang]/dictionaries";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";

export default async function LeaderboardPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");
    return (
        <div className="container mx-auto p-6">
            <LeaderboardTabs dict={dict} />
        </div>
    );
}
