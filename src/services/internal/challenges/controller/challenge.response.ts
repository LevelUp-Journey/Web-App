export interface ChallengeResponse {
    id: string;
    teacherId: string;
    name: string;
    description: string; // This is Markdown formatted text
    experiencePoints: number;
    status: string;
    tags: ChallengeTagResponse[];
    stars: ChallengeStarResponse[];
}

export interface ChallengeTagResponse {
    id: string;
    name: string;
    color: string;
    iconUrl: string;
}

export interface ChallengeStarResponse {
    userId: string;
    starredAt: string;
}
