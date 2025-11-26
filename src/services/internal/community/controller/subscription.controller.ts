import type {
    Subscription,
    SubscriptionCount,
    SubscriptionListResponse,
} from "../entities/subscription.entity";
import {
    createSubscriptionAction,
    deleteSubscriptionAction,
    getSubscriptionsByCommunityAction,
    getSubscriptionCountAction,
    getUserSubscriptionForCommunityAction,
} from "../server/subscription.actions";

export class SubscriptionController {
    static async createSubscription(
        communityId: string,
    ): Promise<Subscription | null> {
        const response = await createSubscriptionAction(communityId);

        if (response.status === 201) {
            return response.data as Subscription;
        }

        if (response.status === 409) {
            console.warn("User is already subscribed to this community");
            return null;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to create subscription: ${errorMessage}`);
    }

    static async deleteSubscription(communityId: string): Promise<boolean> {
        const response = await deleteSubscriptionAction(communityId);

        if (response.status === 204) {
            return true;
        }

        if (response.status === 404) {
            console.warn("No subscription found for this community");
            return false;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to delete subscription: ${errorMessage}`);
    }

    static async getSubscriptionsByCommunity(
        communityId: string,
        page: number = 0,
        limit: number = 20,
    ): Promise<SubscriptionListResponse> {
        const response = await getSubscriptionsByCommunityAction(
            communityId,
            page,
            limit,
        );

        if (response.status === 200) {
            return response.data as SubscriptionListResponse;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to get subscriptions: ${errorMessage}`);
    }

    static async getSubscriptionCount(
        communityId: string,
    ): Promise<SubscriptionCount> {
        const response = await getSubscriptionCountAction(communityId);

        if (response.status === 200) {
            return response.data as SubscriptionCount;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to get subscription count: ${errorMessage}`);
    }

    static async getUserSubscriptionForCommunity(
        communityId: string,
    ): Promise<Subscription | null> {
        const response = await getUserSubscriptionForCommunityAction(communityId);

        if (response.status === 200) {
            return response.data as Subscription;
        }

        if (response.status === 404) {
            return null; // User is not subscribed to this community
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to get user subscription: ${errorMessage}`);
    }
}
