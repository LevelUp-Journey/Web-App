export interface Post {
    postId: string;
    communityId: string;
    authorId: string;
    content: string;
    images?: string[];
    createdAt: string;
    updatedAt: string;
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
