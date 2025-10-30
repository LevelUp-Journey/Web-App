import { RanksTabContent } from "@/components/leaderboard/rank-page/ranks-tab-content";
import { LeaderboardPage as LeaderboardContent } from "@/components/leaderboard/leaderboard-page/Leaderboard";
import { MyRankContent } from "@/components/leaderboard/my-rank-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeaderboardPage() {
    return (
        <div className="container mx-auto p-6">

            <Tabs defaultValue="leaderboard" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
                    <TabsTrigger value="myrank">My Rank</TabsTrigger>
                    <TabsTrigger value="ranks">Information</TabsTrigger>
                </TabsList>

                <TabsContent value="leaderboard" className="mt-6">
                    <LeaderboardContent />
                </TabsContent>

                <TabsContent value="myrank" className="mt-6">
                    <MyRankContent />
                </TabsContent>

                <TabsContent value="ranks" className="mt-6">
                    <RanksTabContent />
                </TabsContent>
            </Tabs>
        </div>
    );
}