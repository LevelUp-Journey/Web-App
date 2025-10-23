export interface Score {
    id: string;
    userId: string;
    points: number;
    source: string;
    challengeId?: string;
    challengeType?: string;
    awardedAt: string;
}