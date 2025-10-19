import type { Challenge } from "../entities/challenge.entity";
import { getPublicChallengesAction } from "../server/challenge.actions";
import { ChallengeAssembler } from "./challenge.assembler";
import type { ChallengeResponse } from "./challenge.response";

export class ChallengeController {
    public static async getPublicChallenges(): Promise<Challenge[]> {
        const challenges = await getPublicChallengesAction();

        if (challenges.status === 200) {
            // Handle successful response
            return ChallengeAssembler.toEntitiesFromResponse(
                challenges.data as ChallengeResponse[],
            );
        }

        throw new Error("Failed to fetch public challenges");
    }
}
