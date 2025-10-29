import { RankIcon } from "@/components/leaderboard/rank-icon";
import { Card, CardContent } from "@/components/ui/card";

interface MyCurrentRankProps {
    rank: string;
}

export function MyCurrentRank({ rank }: MyCurrentRankProps) {

    return (
        <Card className="bg-gradient-to-br from-background to-muted border-2">
            <CardContent className="p-6">
                <div className="text-center space-y-6">
                    <h3 className="text-xl font-bold">My Current Rank</h3>

                    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                        <RankIcon
                            rank={rank}
                            className="w-32 h-32 relative z-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-wider">
                            {rank.toUpperCase()}
                        </h2>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
