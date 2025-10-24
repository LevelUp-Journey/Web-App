export interface GetVersionTestByChallengeIdAndCodeVersionId {
    challengeId: string;
    codeVersionId: string;
}

export interface VersionTestResponse {
    id: string;
    codeVersionId: string;
    input: string;
    expectedOutput: string;
    customValidationCode: string;
    failureMessage: string;
    isSecret: boolean;
}
export interface CreateVersionTestRequest {
    codeVersionId: string;
    input: string;
    expectedOutput: string;
    customValidationCode: string;
    failureMessage: string;
    isSecret: boolean;
}

export interface UpdateVersionTestRequest {
    input: string;
    expectedOutput: string;
    customValidationCode: string;
    failureMessage: string;
    isSecret: boolean;
}

export interface DeleteVersionTestRequest {
    id: string;
}
