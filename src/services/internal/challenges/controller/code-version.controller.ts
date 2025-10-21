import {
    createCodeVersionAction,
    getCodeVersionsByChallengeIdAction,
} from "../server/code-version.actions";
import { CodeVersionAssembler } from "./code-version.assembler";
import type { CodeVersionResponse } from "./code-version.response";
import type { CreateCodeVersionRequest } from "../server/code-version.actions";

export class CodeVersionController {
    public static async getCodeVersionsByChallengeId(challengeId: string) {
        const codeVersions =
            await getCodeVersionsByChallengeIdAction(challengeId);

        if (codeVersions.status === 200) {
            return CodeVersionAssembler.toEntitiesFromResponses(
                codeVersions.data as CodeVersionResponse[],
            );
        }

        throw new Error(
            `Failed to get code versions for challensge ${challengeId}`,
        );
    }

    public static async createCodeVersion(
        challengeId: string,
        request: CreateCodeVersionRequest,
    ) {
        const response = await createCodeVersionAction(challengeId, request);

        if (response.status === 200 || response.status === 201) {
            return CodeVersionAssembler.toEntityFromResponse(
                response.data as CodeVersionResponse,
            );
        }

        throw new Error(
            `Failed to create code version for challenge ${challengeId}`,
        );
    }
}
