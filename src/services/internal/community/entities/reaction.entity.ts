export interface Reaction {
    id: string;
    postId: string;
    userId: string;
    reactionType: "LIKE";
    createdAt: string;
}
