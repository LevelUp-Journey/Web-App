import { getCodeVersionsByChallengeIdAction } from "../server/code-version.actions";
import { CodeVersionAssembler } from "./code-version.assembler";
import type { CodeVersionResponse } from "./code-version.response";

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
}
