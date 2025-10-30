export interface CourseResponse {
    id: string;
    title: string;
    description: string;
    teacherId: string;
    status: string;
    difficulty: string;
    totalGuides: number;
    rating: number;
    totalLikes: number;
    completionScore: number;
    cover: string;
    guides: CourseGuideResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateCourseRequest {
    title: string;
    description: string;
    difficulty: CourseDifficulty;
    completionScore: number;
    cover: string;
}

export enum CourseDifficulty {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED",
    EXPERT = "EXPERT",
}

export interface UpdateCourseRequest {
    title: string;
    description: string;
    difficulty: CourseDifficulty;
    completionScore: number;
    cover: string;
}

export interface CourseGuideResponse {
    guideId: string;
    position: number;
}

export interface CourseGuideFullResponse {
    id: string;
    title: string;
    totalLikes: number;
    cover: string;
    createdAt: string;
    position: number;
}
