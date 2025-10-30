export interface Subscription {
    id: string;
    userId: string;
    communityId: string;
    createdAt: string;
}

export interface CreateSubscriptionRequest {
    userId: string;
    communityId: string;
}
