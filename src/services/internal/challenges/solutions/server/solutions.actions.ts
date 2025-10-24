"use server";

import { CHALLENGES_HTTP } from "@/services/axios.config";
import type {
    CreateSolutionRequest,
    SolutionResponse,
    UpdateSolutionRequest,
} from "../controller/solutions.response";

export async function createSolutionAction({
    challengeId,
    codeVersionId,
}: CreateSolutionRequest) {
    const response = await CHALLENGES_HTTP.post(
        `/challenges/${challengeId}/code-versions/${codeVersionId}/solutions`,
    );

    return response.data;
}

export async function updateSolutionAction({
    solutionId,
    code,
}: UpdateSolutionRequest) {
    const response = await CHALLENGES_HTTP.put(`/solutions/${solutionId}`, {
        code,
    });

    console.log("UPDATE ACTION RESPONSE", response);

    return response.data;
}

export async function getSolutionByIdAction({
    solutionId,
}: {
    solutionId: string;
}) {
    const response = await CHALLENGES_HTTP.get<SolutionResponse>(
        `/solutions/${solutionId}`,
    );

    return response.data;
}

// This action retrieves the student's solution for a given challenge and code version.
export async function getSolutionByChallengeIdAndCodeVersionIdAction({
    challengeId,
    codeVersionId,
}: {
    challengeId: string;
    codeVersionId: string;
}) {
    const response = await CHALLENGES_HTTP.get<SolutionResponse>(
        `/challenges/${challengeId}/code-versions/${codeVersionId}/solutions`,
    );

    return response.data;
}
