"use server";

import { CHALLENGES_HTTP } from "@/services/axios.config";
import { CreateVersionTestRequest } from "../controller/versions-test.response";

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

export async function createVersionTest({
    challengeId,
    versionId,
    test,
}: {
    challengeId: string;
    versionId: string;
    test: CreateVersionTestRequest;
}) {
    const response = await CHALLENGES_HTTP.post(
        `challenges/${challengeId}/code-versions/${versionId}/tests`,
        test,
    );
    if (!response || !response.data) {
        throw new Error(`Failed to create test`);
    }

    return response.data;
}

export async function updateVersionTest({
    challengeId,
    versionId,
    testId,
    test,
}: {
    challengeId: string;
    versionId: string;
    testId: string;
    test: string;
}) {
    const response = await CHALLENGES_HTTP.put(
        `challenges/${challengeId}/code-versions/${versionId}/tests/${testId}`,
        { test },
    );
    if (!response || !response.data) {
        throw new Error(`Failed to update test`);
    }

    return response.data;
}

export async function deleteVersionTest({
    challengeId,
    versionId,
    testId,
}: {
    challengeId: string;
    versionId: string;
    testId: string;
}) {
    const response = await CHALLENGES_HTTP.delete(
        `challenges/${challengeId}/code-versions/${versionId}/tests/${testId}`,
    );
    if (!response || !response.data) {
        throw new Error(`Failed to delete test`);
    }

    return response.data;
}
