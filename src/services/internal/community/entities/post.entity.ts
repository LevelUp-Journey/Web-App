export interface Comment {
    id: string;
    authorId: string;
    authorProfileId: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
}

export interface PostReactions {
    reactionCounts: {
        [key: string]: number; // e.g., { "LIKE": 5 }
    };
    userReaction: string | null; // e.g., "LIKE" or null
}

export interface Post {
    id: string;
    communityId: string;
    authorId: string;
    authorProfileId: string;
    authorName: string; // username from backend
    authorProfileUrl: string; // profile URL from backend
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    comments: Comment[];
    reactions: PostReactions;
}
