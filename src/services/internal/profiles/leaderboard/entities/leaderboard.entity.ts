export interface LeaderboardEntry {
    id: string;
    userId: string;
    totalPoints: number;
    position: number;
    isTop500: boolean;
    currentRank: string;
}
