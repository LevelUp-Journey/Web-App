export interface CodeVersionResponse {
    id: string;
    challengeId: string;
    language: string;
    initialCode: string;
    functionName: string | null;
}
export interface CreateCodeVersionRequest {
    challengeId: string;
    language: string;
    defaultCode: string;
    functionName: string;
}

export interface UpdateCodeVersionRequest {
    code: string;
    functionName: string | null;
}
