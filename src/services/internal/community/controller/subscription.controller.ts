import type {
    CreateSubscriptionRequest,
    Subscription,
} from "../entities/subscription.entity";
import {
    createSubscriptionAction,
    deleteSubscriptionAction,
    getCommunitySubscribersAction,
    getUserSubscriptionsAction,
} from "../server/subscription.actions";

export class SubscriptionController {
    public static async getUserSubscriptions(
        userId: string,
    ): Promise<Subscription[]> {
        return await getUserSubscriptionsAction(userId);
    }

    public static async createSubscription(
        userId: string,
        communityId: string,
    ): Promise<Subscription> {
        const request: CreateSubscriptionRequest = {
            userId,
            communityId,
        };
        const subscription = await createSubscriptionAction(request);
        if (!subscription) {
            throw new Error("Failed to create subscription");
        }
        return subscription;
    }

    public static async deleteSubscription(
        subscriptionId: string,
    ): Promise<void> {
        const success = await deleteSubscriptionAction(subscriptionId);
        if (!success) {
            throw new Error("Failed to delete subscription");
        }
    }

    public static async getCommunitySubscribers(
        communityId: string,
    ): Promise<Subscription[]> {
        return await getCommunitySubscribersAction(communityId);
    }
}
