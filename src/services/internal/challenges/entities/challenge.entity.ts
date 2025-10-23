import type { ChallengeStatus } from "@/lib/consts";

export interface Challenge {
    id: string;
    teacherId: string;
    name: string;
    description: string; // This is Markdown formatted text
    experiencePoints: number;
    status: ChallengeStatus;
    tags: ChallengeTag[];
    stars: ChallengeStar[];
}

export interface ChallengeTag {
    id: string;
    name: string;
    color: string;
    iconUrl: string;
}

export interface ChallengeStar {
    userId: string;
    starredAt: string;
}
