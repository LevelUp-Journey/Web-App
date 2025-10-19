"use server";

import {
    CHALLENGES_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { CodeVersionResponse } from "../controller/code-version.response";

export async function getCodeVersionsByChallengeIdAction(
    challengeId: string,
): Promise<RequestSuccess<CodeVersionResponse[]> | RequestFailure> {
    const data = await CHALLENGES_HTTP.get<CodeVersionResponse[]>(
        `/challenges/${challengeId}/code-versions`,
    );

    return {
        data: data.data,
        status: data.status,
    };
}
