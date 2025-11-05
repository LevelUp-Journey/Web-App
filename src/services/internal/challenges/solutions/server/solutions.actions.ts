"use server";

import { API_GATEWAY_HTTP } from "@/services/axios.config";
import type {
    CreateSolutionRequest,
    SolutionResponse,
    SubmitSolutionResponse,
    UpdateSolutionRequest,
} from "../controller/solutions.response";

export async function createSolutionAction({
    challengeId,
    codeVersionId,
}: CreateSolutionRequest) {
    const response = await API_GATEWAY_HTTP.post(
        `/challenges/${challengeId}/code-versions/${codeVersionId}/solutions`,
    );

    return response.data;
}

export async function updateSolutionAction({
    solutionId,
    code,
}: UpdateSolutionRequest) {
    const response = await API_GATEWAY_HTTP.put(`/solutions/${solutionId}`, {
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
    const response = await API_GATEWAY_HTTP.get<SolutionResponse>(
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
    const response = await API_GATEWAY_HTTP.get<SolutionResponse>(
        `/challenges/${challengeId}/code-versions/${codeVersionId}/solutions`,
    );

    return response.data;
}

export async function submitSolutionAction(solutionId: string) {
    const response = await API_GATEWAY_HTTP.put<SubmitSolutionResponse>(
        `/solutions/${solutionId}/submissions`,
    );

    console.log("SUBMIT ACTION RESPONSE", response);

    return response.data;
}
