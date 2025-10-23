"use server";

import { CHALLENGES_HTTP } from "@/services/axios.config";
import type { CreateSolutionRequest } from "../controller/solutions.response";

export async function createSolutionAction({
    challengeId,
    codeVersionId,
}: CreateSolutionRequest) {
    const response = await CHALLENGES_HTTP.post(
        `/challenges/${challengeId}/code-versions/${codeVersionId}/solutions`,
    );

    return response.data;
}
