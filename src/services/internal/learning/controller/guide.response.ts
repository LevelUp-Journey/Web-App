// Request interfaces
export interface CreateGuideRequest {
    courseId: string;
    title: string;
    description?: string;
    markdownContent: string;
}

export interface UpdateGuideRequest {
    title?: string;
    description?: string;
    markdownContent?: string;
}

export interface ChangeGuideStatusRequest {
    status: "DRAFT" | "PUBLISHED" | "PROTECTED";
}

// Response interfaces
export interface GuideResponse {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    markdownContent: string;
    status: "DRAFT" | "PUBLISHED" | "PROTECTED";
    orderIndex: number;
    totalLikes: number;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface GuideListResponse {
    data: GuideResponse[];
    total: number;
    page: number;
    limit: number;
}

// URL Parameter interfaces
export interface GetGuideByIdParams {
    id: string;
}

export interface GetGuideListParams {
    page?: number;
    limit?: number;
    courseId?: string;
    authorId?: string;
}
