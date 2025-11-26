export interface Subscription {
    id: string;
    userId: string;
    communityId: string;
    createdAt: string;
}

export interface CreateSubscriptionRequest {
    // userId is obtained from JWT token, so not needed in request body
}

export interface SubscriptionCount {
    count: number;
}

export interface SubscriptionListResponse {
    subscriptions: Subscription[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
