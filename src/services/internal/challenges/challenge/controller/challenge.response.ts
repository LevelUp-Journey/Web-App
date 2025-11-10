export interface ChallengeResponse {
    id: string;
    teacherId: string;
    name: string;
    description: string; // This is Markdown formatted text
    experiencePoints: number;
    difficulty?: string;
    status: string;
    tags: ChallengeTagResponse[];
    stars: ChallengeStarResponse[];
    guides: string[]; // Guide IDs
    maxAttemptsBeforeGuides?: number | null;
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

export interface CreateChallengeRequest {
    name: string;
    description: string;
    experiencePoints: number;
    difficulty: string;
    tagIds: string[];
    guideIds?: string[];
    maxAttemptsBeforeGuides: number;
}

export interface UpdateChallengeRequest {
    name?: string;
    description?: string;
    experiencePoints?: number;
    difficulty?: string;
    status?: string;
    tags?: string[];
    maxAttemptsBeforeGuides?: number;
}

export interface GetChallengesByTeacherIdRequest {
    teacherId: string;
}
