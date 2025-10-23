export interface CommentResponse {
    id: string;
    authorId: string;
    content: string;
    imageUrl?: string;
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
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    comments: CommentResponse[];
    reactions?: ReactionResponse[];
}
