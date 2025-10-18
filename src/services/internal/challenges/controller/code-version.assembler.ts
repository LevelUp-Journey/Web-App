import z from "zod";
import type { CodeVersion } from "../entities/code-version.entity";
import type { CodeVersionResponse } from "./code-version.response";

const CodeVersionValidator = z.object({
    id: z.uuid(),
    challengeId: z.uuid(),
    language: z.string().min(1).max(100),
    initialCode: z.string().min(1).max(10000),
});

export class CodeVersionAssembler {
    public static toEntityFromResponse(
        codeVersion: CodeVersionResponse,
    ): CodeVersion {
        CodeVersionValidator.parse(codeVersion);

        return {
            id: codeVersion.id,
            challengeId: codeVersion.challengeId,
            language: codeVersion.language,
            initialCode: codeVersion.initialCode,
        };
    }

    public static toEntitiesFromResponses(
        codeVersions: CodeVersionResponse[],
    ): CodeVersion[] {
        return codeVersions.map(CodeVersionAssembler.toEntityFromResponse);
    }
}
