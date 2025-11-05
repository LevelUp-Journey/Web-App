import z from "zod";
import type { VersionTest } from "../entities/version-test.entity";
import type { VersionTestResponse } from "./versions-test.response";

const VersionTestValidator = z.object({
    id: z.uuid(),
    codeVersionId: z.uuid(),
    input: z.string(),
    expectedOutput: z.string(),
    customValidationCode: z.string(),
    failureMessage: z.string(),
    isSecret: z.boolean(),
});

export class VersionTestAssembler {
    public static toEntityFromResponse(
        versionTest: VersionTestResponse,
    ): VersionTest {
        VersionTestValidator.parse(versionTest);

        return {
            id: versionTest.id,
            codeVersionId: versionTest.codeVersionId,
            input: versionTest.input,
            expectedOutput: versionTest.expectedOutput,
            customValidationCode: versionTest.customValidationCode,
            failureMessage: versionTest.failureMessage,
            isSecret: versionTest.isSecret,
        };
    }

    public static toEntitiesFromResponses(
        versionTests: VersionTestResponse[],
    ): VersionTest[] {
        return versionTests.map(VersionTestAssembler.toEntityFromResponse);
    }
}
