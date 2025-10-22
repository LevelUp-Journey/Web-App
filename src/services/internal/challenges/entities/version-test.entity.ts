export interface VersionTest {
    id: string;
    codeVersionId: string;
    input: string;
    expectedOutput: string;
    customValidationCode: string;
    failureMessage: string;
}
