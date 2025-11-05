export interface CreateGuideRequest {
    title: string;
    description: string;
    coverImage: string;
    authorIds: string[];
    topicIds: string[];
}

export interface GuideResponse {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    status: string;
    likesCount: number;
    likedByRequester: boolean;
    pagesCount: number;
    authorIds: string[];
    topics: {
        id: string;
        name: string;
    }[];
    pages: PageResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface PageResponse {
    id: string;
    content: string;
    orderNumber: number;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateGuideRequest {
    title: string;
    description: string;
    coverImage: string;
    topicIds: string[];
}

export interface DeleteGuideRequest {
    id: string;
}

// TODO: Update guide authors request
// export type UpdateGuideAuthorsRequest = string[];

export interface GetGuidePagesByGuideIdRequest {
    guideId: string;
}

export interface CreatePageRequest {
    content: string;
    orderNumber: number;
}

export interface GetPageByIdRequest {
    pageId: string;
    guideId: string;
}

export interface UpdatePageRequest {
    content: string;
    orderNumber: number;
}

export interface DeletePageRequest {
    pageId: string;
    guideId: string;
}

export interface UpdateGuideStatusRequest {
    status: GuideStatus;
}
export enum GuideStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED",
    ASSOCIATED_WITH_COURSE = "ASSOCIATED_WITH_COURSE",
}
