export interface Post {
    postId: string;
    communityId: string;
    authorId: string;
    content: string;
    images: string[];
    type: "message" | "announcement";
    createdAt: string;
    updatedAt: string;
}

export interface CreatePostRequest {
    content: string;
    images?: string[];
    type: "message" | "announcement";
}

export interface PostsListResponse {
    posts: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
