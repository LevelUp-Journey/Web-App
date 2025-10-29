export interface GuideResponse {
    id: string;
    title: string;
    description: string;
    markdownContent: string;
    status: string;
    totalLikes: number;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateGuideRequest {
    title: string;
    description: string;
    markdownContent: string;
    cover: string;
}
