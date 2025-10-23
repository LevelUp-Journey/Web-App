import { CommunityAssembler } from "./community.assembler";
import {
    createCommunityAction,
    getCommunitiesAction,
    getCommunityByIdAction,
    updateCommunityAction,
    type CreateCommunityRequest,
    type UpdateCommunityRequest,
    type CommunityResponse,
} from "../server/community.actions";
import type { Community } from "../entities/community.entity";

export class CommunityController {
    static async createCommunity(
        request: CreateCommunityRequest,
    ): Promise<Community> {
        const response = await createCommunityAction(request);

        if (response.status !== 201) {
            throw new Error(`Failed to create community: ${response.data}`);
        }

        return CommunityAssembler.toEntityFromResponse(
            response.data as CommunityResponse,
        );
    }

    static async getCommunities(): Promise<Community[]> {
        const response = await getCommunitiesAction();

        if (response.status !== 200) {
            throw new Error(`Failed to fetch communities: ${response.data}`);
        }

        return CommunityAssembler.toEntitiesFromResponse(
            response.data as CommunityResponse[],
        );
    }

    static async getCommunityById(communityId: string): Promise<Community> {
        const response = await getCommunityByIdAction(communityId);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch community: ${response.data}`);
        }

        return CommunityAssembler.toEntityFromResponse(
            response.data as CommunityResponse,
        );
    }

    static async updateCommunity(
        communityId: string,
        request: UpdateCommunityRequest,
    ): Promise<Community> {
        const response = await updateCommunityAction(communityId, request);

        if (response.status !== 200) {
            throw new Error(`Failed to update community: ${response.data}`);
        }

        return CommunityAssembler.toEntityFromResponse(
            response.data as CommunityResponse,
        );
    }
}
