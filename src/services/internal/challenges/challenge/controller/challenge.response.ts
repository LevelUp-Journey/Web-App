export interface ChallengeResponse {
    id: string;
    teacherId: string;
    name: string;
    description: string; // This is Markdown formatted text
    experiencePoints: number;
    difficulty: string;
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

export interface CreateChallengeRequest {
    name: string;
    description: string;
    experiencePoints: number;
    difficulty: string;
    tagIds: string[];
}

export interface UpdateChallengeRequest {
    name?: string;
    description?: string;
    experiencePoints?: number;
    difficulty?: string;
    status?: string;
    tags?: string[];
}

export interface GetChallengesByTeacherIdRequest {
    teacherId: string;
}
