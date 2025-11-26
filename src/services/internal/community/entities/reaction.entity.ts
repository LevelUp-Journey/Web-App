export interface Reaction {
    reactionId: string;
    postId: string;
    userId: string;
    reactionType: "like" | "love" | "haha" | "wow";
    createdAt: string;
    updatedAt: string;
}

export interface ReactionCount {
    counts: {
        like?: number;
        love?: number;
        haha?: number;
        wow?: number;
    };
    postId: string;
    totalCount: number;
}

export interface CreateReactionRequest {
    reactionType: "like" | "love" | "haha" | "wow";
}
