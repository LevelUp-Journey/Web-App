export interface CreateSolutionRequest {
    challengeId: string;
    codeVersionId: string;
}

export interface UpdateSolutionRequest {
    solutionId: string;
    code: string;
}

export interface SolutionResponse {
    id: string;
    challengeId: string;
    codeVersionId: string;
    studentId: string;
    attempts: number;
    code: string;
    lastAttemptAt: string;
    status: string;
    pointsEarned: number;
    maxPoints: number;
    successPercentage: number;
}

export interface GetSolutionByChallengeIdAndCodeRequest {
    challengeId: string;
    codeVersionId: string;
}
