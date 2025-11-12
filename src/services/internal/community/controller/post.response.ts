export interface CommentResponse {
    id: string;
    authorId: string;
    authorProfileId: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
}

export interface PostReactionsResponse {
    reactionCounts: {
        [key: string]: number; // e.g., { "LIKE": 5, "LOVE": 2 }
    };
    userReaction: string | null; // e.g., "LIKE" or null
}

export interface PostResponse {
    id: string;
    communityId: string;
    authorId: string;
    authorProfileId: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    comments?: CommentResponse[];
    reactions: PostReactionsResponse;
}

export interface PaginatedPostsResponse {
    content: PostResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}
