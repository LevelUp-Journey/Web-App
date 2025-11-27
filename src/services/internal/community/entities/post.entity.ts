export interface Post {
    postId: string;
    communityId: string;
    authorId: string;
    authorName?: string;
    authorProfileUrl?: string | null;
    content: string;
    images?: string[];
    createdAt: string;
    updatedAt: string;
    reactions?: {
        reactionCounts?: Record<string, number>;
        userReaction?: string | null;
    };
}

export interface CreatePostRequest {
    content: string;
    images?: string[];
}

export interface PostsListResponse {
    posts: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
