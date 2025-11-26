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
import { subscriptionCache } from "../cache/subscription-cache";

export class SubscriptionController {
    static async createSubscription(
        communityId: string,
    ): Promise<Subscription | null> {
        const response = await createSubscriptionAction(communityId);

        if (response.status === 201) {
            const subscription = response.data as Subscription;
            // Invalidate cache after successful subscription
            subscriptionCache.invalidateCommunity(communityId);
            return subscription;
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
            // Invalidate cache after successful unsubscription
            subscriptionCache.invalidateCommunity(communityId);
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
        // Check cache first
        const cached = subscriptionCache.getCount(communityId);
        if (cached) {
            return cached;
        }

        const response = await getSubscriptionCountAction(communityId);

        if (response.status === 200) {
            const count = response.data as SubscriptionCount;
            // Store in cache
            subscriptionCache.setCount(communityId, count);
            return count;
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to get subscription count: ${errorMessage}`);
    }

    static async getUserSubscriptionForCommunity(
        userId: string,
        communityId: string,
    ): Promise<Subscription | null> {
        // Check cache first
        const cached = subscriptionCache.getUserSubscription(userId, communityId);
        if (cached !== undefined) {
            return cached;
        }

        const response = await getUserSubscriptionForCommunityAction(userId, communityId);

        if (response.status === 200) {
            const subscription = response.data as Subscription;
            // Store in cache
            subscriptionCache.setUserSubscription(userId, communityId, subscription);
            return subscription;
        }

        if (response.status === 404) {
            // Cache the "not subscribed" state as well
            subscriptionCache.setUserSubscription(userId, communityId, null);
            return null; // User is not subscribed to this community
        }

        const errorMessage =
            typeof response.data === "string" ? response.data : "Unknown error";
        throw new Error(`Failed to get user subscription: ${errorMessage}`);
    }
}
