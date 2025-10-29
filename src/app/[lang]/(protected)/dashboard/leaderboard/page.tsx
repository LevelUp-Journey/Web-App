import { RankIconsTable } from "@/components/leaderboard/rank-icons-table";
import { LeaderboardContent } from "@/components/leaderboard/leaderboard-content";
import { MyRankContent } from "@/components/leaderboard/my-rank-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeaderboardPage() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

            <Tabs defaultValue="ranks" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ranks">Ranks</TabsTrigger>
                    <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                    <TabsTrigger value="myrank">My Rank</TabsTrigger>
                </TabsList>

                <TabsContent value="ranks" className="mt-6">
                    <RankIconsTable />
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-6">
                    <LeaderboardContent />
                </TabsContent>

                <TabsContent value="myrank" className="mt-6">
                    <MyRankContent />
                </TabsContent>
            </Tabs>
        </div>
    );
}