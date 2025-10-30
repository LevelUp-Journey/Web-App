export interface CompetitiveProfile {
    id: string;
    userId: string;
    totalPoints: number;
    currentRank: string;
    nextRank: string;
    pointsNeededForNextRank: number;
}

export interface UsersByRankResponse {
    profiles: CompetitiveProfile[];
    totalUsers: number;
}

export interface LeaderboardEntry {
    id: string;
    userId: string;
    totalPoints: number;
    position: number;
    isTop500: boolean;
}

export interface Score {
    id: string;
    userId: string;
    points: number;
    source: string;
    challengeId?: string;
    challengeType?: string;
    awardedAt: string;
}
