export interface Comment {
    id: string;
    authorId: string;
    content: string;
    imageUrl?: string;
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
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    comments: Comment[];
    reactions: Reaction[];
}
