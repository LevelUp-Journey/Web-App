"use server";

import { CHALLENGES_HTTP } from "@/services/axios.config";

export async function getVersionTestsByChallengeIdAndVersionId({
    challengeId,
    versionId,
}: {
    challengeId: string;
    versionId: string;
}) {
    const tests = await CHALLENGES_HTTP.get(
        `challenges/${challengeId}/code-versions/${versionId}`,
    );
    if (!tests || !tests.data) {
        throw new Error(`Version ${versionId} not found`);
    }

    return tests;
}
