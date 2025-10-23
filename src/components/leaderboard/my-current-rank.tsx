import { Card, CardContent } from "@/components/ui/card";
import { RankIcon, getRankFromPoints } from "./rank-icon";
import { Trophy } from "lucide-react";

interface MyCurrentRankProps {
    totalPoints: number;
    position: number;
}

export function MyCurrentRank({ totalPoints, position }: MyCurrentRankProps) {
    const rank = getRankFromPoints(totalPoints);

    const getRankDescription = (rank: string) => {
        const descriptions: Record<string, string> = {
            "Bronze": "Starting your journey. Keep pushing forward!",
            "Silver": "Making steady progress. The climb continues!",
            "Gold": "Shining bright! You're doing great!",
            "Platinium": "Excellence in action. Keep up the momentum!",
            "Diamond": "Brilliant performance! You're among the elite!",
            "Master": "A true architect of logic and precision. The Master Coder has conquered every challenge with elegance and consistency, demonstrating not just technical skill but creative problem-solving and deep understanding of algorithms.",
            "GrandMaster": "Legendary status achieved! Unmatched excellence!",
            "TOP": "The pinnacle of achievement. You're unstoppable!"
        };
        return descriptions[rank] || "Keep climbing!";
    };

    return (
        <Card className="bg-gradient-to-br from-background to-muted border-2">
            <CardContent className="p-6">
                <div className="text-center space-y-6">
                    <h3 className="text-xl font-bold">My Current Rank</h3>
                    
                    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl" />
                        <RankIcon rank={rank} className="w-32 h-32 relative z-10" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-wider">{rank.toUpperCase()}</h2>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Trophy className="w-4 h-4" />
                            <span className="font-mono font-semibold">{totalPoints.toLocaleString()}</span>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed px-4">
                        {getRankDescription(rank)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
