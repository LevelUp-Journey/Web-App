import type { Community } from "../entities/community.entity";
import type { CommunityResponse } from "../server/community.actions";

export class CommunityAssembler {
    static toEntityFromResponse(response: CommunityResponse): Community {
        return {
            id: response.id,
            ownerId: response.ownerId,
            name: response.name,
            description: response.description,
            imageUrl: response.imageUrl,
            createdAt: new Date(response.createdAt),
        };
    }

    static toEntitiesFromResponse(responses: CommunityResponse[]): Community[] {
        return responses.map(this.toEntityFromResponse);
    }
}