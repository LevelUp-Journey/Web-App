import { LeaderboardCard } from "./leaderboard-card";

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

interface LeaderboardListProps {
    leaderboard: LeaderboardUserEntry[];
    currentUserId: string | null;
}

export function LeaderboardList({
    leaderboard,
    currentUserId,
}: LeaderboardListProps) {
    return (
        <div className="space-y-2 p-4">
            {/* Header Row */}
            <div className="flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-lg font-semibold text-sm text-muted-foreground">
                <div className="w-12 text-center">Rango</div>
                <div className="w-8"></div> {/* Space for rank icon */}
                <div className="flex-1">Username</div>
                <div className="text-right">Points</div>
            </div>
            {leaderboard.map((entry) => (
                <LeaderboardCard
                    key={entry.id}
                    entry={entry}
                    isCurrentUser={entry.userId === currentUserId}
                />
            ))}
        </div>
    );
}