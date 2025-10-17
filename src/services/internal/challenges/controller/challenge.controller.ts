import { getPublicChallengesAction } from "../server/challenge.actions";
import type { ChallengeResponse } from "./challenge.response";

export class ChallengeController {
    public static async getPublicChallenges(): Promise<ChallengeResponse[]> {
        const challenges = await getPublicChallengesAction();

        if (challenges.status === 200) {
            // Handle successful response
            return challenges.data as ChallengeResponse[];
        }

        throw new Error("Failed to fetch public challenges");
    }
}
