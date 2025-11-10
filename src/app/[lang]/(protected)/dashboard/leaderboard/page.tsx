import { getDictionary } from "@/app/[lang]/dictionaries";
import { LeaderboardPage as LeaderboardContent } from "@/components/leaderboard/leaderboard-page/Leaderboard";
import { RanksTabContent } from "@/components/leaderboard/rank-page/ranks-tab-content";
import { MyRankContent } from "@/components/leaderboard/user-page/my-rank-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function LeaderboardPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");
    return (
        <div className="container mx-auto p-6">
            <Tabs defaultValue="leaderboard" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="leaderboard">
                        {dict.leaderboard.ranking}
                    </TabsTrigger>
                    <TabsTrigger value="myrank">
                        {dict.leaderboard.myRank}
                    </TabsTrigger>
                    <TabsTrigger value="ranks">
                        {dict.leaderboard.information}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="leaderboard" className="mt-6">
                    <LeaderboardContent dict={dict} />
                </TabsContent>

                <TabsContent value="myrank" className="mt-6">
                    <MyRankContent dict={dict} />
                </TabsContent>

                <TabsContent value="ranks" className="mt-6">
                    <RanksTabContent dict={dict} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
