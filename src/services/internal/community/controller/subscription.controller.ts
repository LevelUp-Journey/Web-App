import type {
    CreateSubscriptionRequest,
    SubscriptionResponse,
} from "../server/subscription.actions";
import {
    createSubscriptionAction,
    deleteSubscriptionAction,
    getSubscriptionsByCommunityAction,
    getSubscriptionsByUserAction,
} from "../server/subscription.actions";

export class SubscriptionController {
    static async createSubscription(
        communityId: string,
    ): Promise<SubscriptionResponse | null> {
        const request: CreateSubscriptionRequest = {
            communityId,
        };

        const response = await createSubscriptionAction(request);

        if (response.status === 200 || response.status === 201) {
            return response.data as SubscriptionResponse;
        }

        console.error("Failed to create subscription:", response);
        return null;
    }

    static async deleteSubscription(subscriptionId: string): Promise<boolean> {
        const response = await deleteSubscriptionAction(subscriptionId);

        if (response.status === 200 || response.status === 204) {
            return true;
        }

        console.error("Failed to delete subscription:", response);
        return false;
    }

    static async getSubscriptionsByCommunity(
        communityId: string,
    ): Promise<SubscriptionResponse[]> {
        const response = await getSubscriptionsByCommunityAction(communityId);

        if (response.status === 200) {
            return response.data as SubscriptionResponse[];
        }

        console.error("Failed to get subscriptions:", response);
        return [];
    }

    static async getSubscriptionsByUser(
        userId: string,
    ): Promise<SubscriptionResponse[]> {
        const response = await getSubscriptionsByUserAction(userId);

        if (response.status === 200) {
            return response.data as SubscriptionResponse[];
        }

        console.error("Failed to get user subscriptions:", response);
        return [];
    }

    static async getUserSubscriptionForCommunity(
        communityId: string,
        userId: string,
    ): Promise<SubscriptionResponse | null> {
        const subscriptions = await this.getSubscriptionsByUser(userId);
        return (
            subscriptions.find((sub) => sub.communityId === communityId) ||
            null
        );
    }
}
