import z from "zod";
import type { CodeVersion } from "../entities/code-version.entity";
import type { CodeVersionResponse } from "./code-version.response";

const CodeVersionValidator = z.object({
    id: z.uuid(),
    challengeId: z.uuid(),
    language: z.string().min(1).max(100),
    initialCode: z.string().max(10000),
    functionName: z.string().max(100),
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
            functionName: codeVersion.functionName,
        };
    }

    public static toEntitiesFromResponses(
        codeVersions: CodeVersionResponse[],
    ): CodeVersion[] {
        return codeVersions.map(CodeVersionAssembler.toEntityFromResponse);
    }
}
