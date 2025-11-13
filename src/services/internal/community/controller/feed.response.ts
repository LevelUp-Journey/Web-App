export interface FeedItemReactionsResponse {
    reactionCounts: {
        [key: string]: number;
    };
    userReaction: string | null;
}

export interface FeedItemResponse {
    id: string;
    communityId: string;
    communityName: string;
    communityImageUrl: string | null;
    authorId: string;
    authorProfileId: string;
    authorName: string;
    authorProfileUrl: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    reactions: FeedItemReactionsResponse;
}

export interface FeedResponse {
    content: FeedItemResponse[];
    page: number;
    size: number;
    totalElements: number;
}
