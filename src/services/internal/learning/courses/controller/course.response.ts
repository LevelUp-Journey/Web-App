import type { GuideStatus } from "../../guides/controller/guide.response";

export interface CourseResponse {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    status: CourseStatus;
    likesCount: number;
    authorIds: string[];
    topics: [
        {
            id: string;
            name: string;
        },
    ];
    guides: [
        {
            id: string;
            title: string;
            description: string;
            coverImage: string;
            status: GuideStatus;
            likesCount: number;
            pagesCount: number;
            authorIds: string[];
            createdAt: Date;
        },
    ];
    createdAt: Date;
    updatedAt: Date;
}

export enum CourseStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED",
}

export interface CreateCourseRequest {
    title: string;
    description: string;
    coverImage: string;
    authorIds: string[];
    topicIds: string[];
}

export interface AddGuideToCourseRequest {
    guideId: string;
    courseId: string;
}

export interface DeleteGuideFromCourseRequest extends AddGuideToCourseRequest {}

export interface GetCourseById {
    courseId: string;
}

export interface UpdateCourseRequest {
    title: string;
    description: string;
    coverImage: string;
    topicIds: string[];
}

export interface DeleteCourseRequest {
    courseId: string;
}

// Replace entire list of authors
export interface UpdateCourseAuthorsRequest {
    authorIds: string[];
}

export interface UpdateCourseStatusRequest {
    status: CourseStatus;
}
