import type { Community } from "../entities/community.entity";
import type { CommunityResponse } from "../server/community.actions";

export class CommunityAssembler {
    static toEntityFromResponse(response: CommunityResponse): Community {
        const iconUrl = response.iconUrl ?? response.imageUrl ?? null;
        const id = response.communityId ?? response.id;

        return {
            id,
            ownerId: response.ownerId,
            ownerProfileId: response.ownerProfileId,
            name: response.name,
            description: response.description,
            iconUrl,
            imageUrl: iconUrl,
            bannerUrl: response.bannerUrl ?? null,
            isPrivate: response.isPrivate ?? false,
            createdAt: new Date(response.createdAt),
            updatedAt: response.updatedAt
                ? new Date(response.updatedAt)
                : undefined,
            followerCount: response.followerCount ?? 0,
        };
    }

    static toEntitiesFromResponse(responses: CommunityResponse[]): Community[] {
        return responses.map(CommunityAssembler.toEntityFromResponse);
    }
}
