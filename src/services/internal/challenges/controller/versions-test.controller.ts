import type { VersionTest } from "../entities/version-test.entity";
import { getVersionTestsByChallengeIdAndVersionId } from "../server/version-test.actions";
import { VersionTestAssembler } from "./version-test.assembler";
import type { VersionTestResponse } from "./versions-test.response";

export class VersionTestController {
    public static async getVersionTestsByChallengeIdAndCodeVersionId(
        challengeId: string,
        codeVersionId: string,
    ): Promise<VersionTest[]> {
        const response = await getVersionTestsByChallengeIdAndVersionId({
            challengeId,
            versionId: codeVersionId,
        });

        if (response.status === 200) {
            return VersionTestAssembler.toEntitiesFromResponses(
                response.data as VersionTestResponse[],
            );
        }

        throw new Error(
            `Failed to get version tests for challenge ${challengeId} and code version ${codeVersionId}`,
        );
    }
}
