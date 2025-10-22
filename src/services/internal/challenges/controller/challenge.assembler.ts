import { z } from "zod";
import type { Challenge } from "../entities/challenge.entity";
import type { ChallengeResponse } from "./challenge.response";

const ChallengeTagValidator = z.object({
    id: z.uuid(),
    name: z.string().min(1).max(100),
    color: z.string().min(1).max(100),
    iconUrl: z.url().min(1).max(100),
});

const ChallengeValidator = z.object({
    id: z.uuid(),
    teacherId: z.uuid(),
    name: z.string().min(1).max(100),
    description: z.string().max(1000),
    experiencePoints: z.number().min(0).max(10000),
    status: z.string().min(1).max(100),
    tags: z.array(ChallengeTagValidator),
});

const ChallengeStarValidator = z.object({
    userId: z.uuid(),
    starredAt: z.string().min(1).max(100),
});

export class ChallengeAssembler {
    public static toEntityFromResponse(
        challenge: ChallengeResponse,
    ): Challenge {
        ChallengeValidator.parse(challenge);

        return {
            id: challenge.id,
            teacherId: challenge.teacherId,
            name: challenge.name,
            description: challenge.description,
            experiencePoints: challenge.experiencePoints,
            status: challenge.status,
            tags: challenge.tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
                color: tag.color,
                iconUrl: tag.iconUrl,
            })),
            stars: challenge.stars.map((star) => {
                ChallengeStarValidator.parse(star);

                return {
                    userId: star.userId,
                    starredAt: star.starredAt,
                };
            }),
        };
    }

    public static toEntitiesFromResponse(
        challengesResponse: ChallengeResponse[],
    ): Challenge[] {
        return challengesResponse.map((challenge) =>
            ChallengeAssembler.toEntityFromResponse(challenge),
        );
    }
}
