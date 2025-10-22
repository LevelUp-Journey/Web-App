import {
    createCodeVersionAction,
    deleteCodeVersionAction,
    getCodeVersionByIdAction,
    getCodeVersionsByChallengeIdAction,
    updateCodeVersionAction,
} from "../server/code-version.actions";
import { CodeVersionAssembler } from "./code-version.assembler";
import type {
    CodeVersionResponse,
    CreateCodeVersionRequest,
    UpdateCodeVersionRequest,
} from "./code-version.response";

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

    public static async getCodeVersionById(
        challengeId: string,
        codeVersionId: string,
    ) {
        const codeVersion = await getCodeVersionByIdAction(
            challengeId,
            codeVersionId,
        );

        if (codeVersion.status === 200) {
            return CodeVersionAssembler.toEntityFromResponse(
                codeVersion.data as CodeVersionResponse,
            );
        }

        throw new Error(
            `Failed to get code version ${codeVersionId} for challenge ${challengeId}`,
        );
    }

    public static async updateCodeVersion(
        challengeId: string,
        codeVersionId: string,
        request: UpdateCodeVersionRequest,
    ) {
        const response = await updateCodeVersionAction(
            challengeId,
            codeVersionId,
            request,
        );

        if (response.status === 200) {
            return CodeVersionAssembler.toEntityFromResponse(
                response.data as CodeVersionResponse,
            );
        }

        throw new Error(
            `Failed to update code version ${codeVersionId} for challenge ${challengeId}`,
        );
    }

    public static async deleteCodeVersion(
        challengeId: string,
        codeVersionId: string,
    ) {
        const response = await deleteCodeVersionAction(
            challengeId,
            codeVersionId,
        );

        if (response.status === 200 || response.status === 204) {
            return;
        }

        throw new Error(
            `Failed to delete code version ${codeVersionId} for challenge ${challengeId}`,
        );
    }
}
