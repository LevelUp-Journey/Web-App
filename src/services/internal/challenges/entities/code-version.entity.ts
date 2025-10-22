export interface CodeVersion {
    id: string;
    challengeId: string;
    language: string;
    initialCode: string;
    functionName: string | null;
}
