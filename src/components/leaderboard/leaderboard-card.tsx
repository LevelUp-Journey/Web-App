import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RankIcon } from "@/components/leaderboard/rank-icon";

interface LeaderboardUserEntry {
    id: string;
    userId: string;
    totalPoints: number;
    position: number;
    isTop500: boolean;
    currentRank: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
}

interface LeaderboardCardProps {
    entry: LeaderboardUserEntry;
    isCurrentUser: boolean;
}

export function LeaderboardCard({ entry, isCurrentUser }: LeaderboardCardProps) {
    return (
        <Card
            className={`p-4 ${
                isCurrentUser ? "bg-primary/10 border-primary" : ""
            }`}
        >
            <div className="flex items-center gap-4">
                <Badge variant="secondary" className="w-12 justify-center">
                    {entry.position}
                </Badge>
                <RankIcon rank={entry.currentRank} className="w-8 h-8" />
                <div className="flex-1">
                    <p className="font-mono font-semibold">
                        {entry.username || entry.userId.substring(0, 20)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-sm">
                        {entry.totalPoints.toLocaleString()} points
                    </p>
                </div>
            </div>
        </Card>
    );
}