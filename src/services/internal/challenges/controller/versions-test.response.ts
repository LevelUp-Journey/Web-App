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
}
