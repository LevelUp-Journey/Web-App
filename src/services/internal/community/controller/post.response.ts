export interface CommentResponse {
    id: string;
    authorId: string;
    authorProfileId: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
}

export interface ReactionResponse {
    id: string;
    postId: string;
    userId: string;
    reactionType: "LIKE";
    createdAt: string;
}

export interface PostResponse {
    id: string;
    communityId: string;
    authorId: string;
    authorProfileId: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    comments: CommentResponse[];
    reactions?: ReactionResponse[];
}
