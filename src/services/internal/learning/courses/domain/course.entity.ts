import type { GuideStatus } from "../../guides/controller/guide.response";

export interface Course {
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
    createdAt: string;
    updatedAt: string;
}

export enum CourseDifficulty {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED",
    EXPERT = "EXPERT",
}
export enum CourseStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED",
}
