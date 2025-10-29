export interface GuideResponse {
    id: string;
    title: string;
    markdownContent: string;
    status: string;
    totalLikes: number;
    authorId: string;
    cover: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateGuideRequest {
    title: string;
    markdownContent: string;
    cover: string;
}
