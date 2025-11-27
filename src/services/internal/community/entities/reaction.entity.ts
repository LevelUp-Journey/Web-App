export type ReactionType =
    | "like"
    | "love"
    | "haha"
    | "wow"
    | "sad"
    | "angry";

export const REACTION_TYPES: ReactionType[] = [
    "like",
    "love",
    "haha",
    "wow",
    "sad",
    "angry",
];

export interface Reaction {
    reactionId: string;
    postId: string;
    userId: string;
    reactionType: ReactionType;
    createdAt: string;
    updatedAt: string;
}

export interface ReactionCount {
    counts: Partial<Record<ReactionType, number>>;
    postId: string;
    totalCount: number;
}

export interface CreateReactionRequest {
    reactionType: ReactionType;
}
