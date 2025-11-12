export interface Comment {
    id: string;
    authorId: string;
    authorProfileId: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
}

export interface Reaction {
    id: string;
    postId: string;
    userId: string;
    reactionType: "LIKE";
    createdAt: string;
}

export interface Post {
    id: string;
    communityId: string;
    authorId: string;
    authorProfileId: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    comments: Comment[];
    reactions: Reaction[];
}
