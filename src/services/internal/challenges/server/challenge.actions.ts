"use server";

import {
    CHALLENGES_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { ChallengeResponse } from "../controller/challenge.response";

export async function getPublicChallengesAction(): Promise<
    RequestSuccess<ChallengeResponse[]> | RequestFailure
> {
    const challenges =
        await CHALLENGES_HTTP.get<ChallengeResponse[]>("/challenges");

    return {
        data: challenges.data,
        status: challenges.status,
    };
}
