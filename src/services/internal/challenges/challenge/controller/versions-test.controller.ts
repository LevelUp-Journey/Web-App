import type { VersionTest } from "../entities/version-test.entity";
import {
    type CreateVersionTestRequest,
    createVersionTestAction,
    deleteVersionTestAction,
    getVersionTestByIdAction,
    getVersionTestsByChallengeIdAndCodeVersionIdAction,
    type UpdateVersionTestRequest,
    updateVersionTestAction,
} from "../server/version-test.actions";
import { VersionTestAssembler } from "./version-test.assembler";
import type { VersionTestResponse } from "./versions-test.response";

export class VersionTestController {
    public static async getVersionTestById(
        challengeId: string,
        codeVersionId: string,
        testId: string,
    ): Promise<VersionTest> {
        const response = await getVersionTestByIdAction(
            challengeId,
            codeVersionId,
            testId,
        );

        if (response.status === 200) {
            return VersionTestAssembler.toEntityFromResponse(
                response.data as VersionTestResponse,
            );
        }

        throw new Error(
            `Failed to get version test ${testId} for challenge ${challengeId} and code version ${codeVersionId}`,
        );
    }

    public static async getVersionTestsByChallengeIdAndCodeVersionId(
        challengeId: string,
        codeVersionId: string,
    ): Promise<VersionTest[]> {
        const response =
            await getVersionTestsByChallengeIdAndCodeVersionIdAction(
                challengeId,
                codeVersionId,
            );

        if (response.status === 200) {
            return VersionTestAssembler.toEntitiesFromResponses(
                response.data as VersionTestResponse[],
            );
        }

        throw new Error(
            `Failed to get version tests for challenge ${challengeId} and code version ${codeVersionId}`,
        );
    }

    public static async createVersionTest(
        challengeId: string,
        codeVersionId: string,
        request: CreateVersionTestRequest,
    ): Promise<VersionTest> {
        const response = await createVersionTestAction(
            challengeId,
            codeVersionId,
            request,
        );

        if (response.status === 200 || response.status === 201) {
            return VersionTestAssembler.toEntityFromResponse(
                response.data as VersionTestResponse,
            );
        }

        throw new Error(
            `Failed to create version test for challenge ${challengeId} and code version ${codeVersionId}`,
        );
    }

    public static async updateVersionTest(
        challengeId: string,
        codeVersionId: string,
        testId: string,
        request: UpdateVersionTestRequest,
    ): Promise<VersionTest> {
        const response = await updateVersionTestAction(
            challengeId,
            codeVersionId,
            testId,
            request,
        );

        if (response.status === 200) {
            return VersionTestAssembler.toEntityFromResponse(
                response.data as VersionTestResponse,
            );
        }

        throw new Error(
            `Failed to update version test ${testId} for challenge ${challengeId} and code version ${codeVersionId}`,
        );
    }

    public static async deleteVersionTest(
        challengeId: string,
        codeVersionId: string,
        testId: string,
    ): Promise<void> {
        const response = await deleteVersionTestAction(
            challengeId,
            codeVersionId,
            testId,
        );

        if (response.status !== 200 && response.status !== 204) {
            throw new Error(
                `Failed to delete version test ${testId} for challenge ${challengeId} and code version ${codeVersionId}`,
            );
        }
    }
}
