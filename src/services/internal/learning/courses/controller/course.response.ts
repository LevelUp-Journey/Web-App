import type { GuideStatus } from "../../guides/controller/guide.response";
import type { CourseDifficulty, CourseStatus } from "../domain/course.entity";

export interface CourseResponse {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    status: CourseStatus;
    difficultyLevel: CourseDifficulty;
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
            createdAt: string;
        },
    ];
    createdAt: "2025-11-01T07:23:48.156Z";
    updatedAt: "2025-11-01T07:23:48.156Z";
}

export interface CreateCourseRequest {
    title: string;
    description: string;
    coverImage: string;
    difficultyLevel: CourseDifficulty;
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
    difficultyLevel: CourseDifficulty;
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
