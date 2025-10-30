export interface LeaderboardEntry {
    id: string;
    userId: string;
    totalPoints: number;
    position: number;
    isTop500: boolean;
    currentRank?: string; // Optional, may not be included in API response
}

export interface LeaderboardResponse {
    entries: LeaderboardEntry[];
    totalUsers: number;
}
