export interface LeaderboardEntry {
    id: string;
    userId: string;
    totalPoints: number;
    position: number;
    isTop500: boolean;
    currentRank: string;
}

export interface LeaderboardResponse {
    entries: LeaderboardEntry[];
    totalUsers: number;
}
