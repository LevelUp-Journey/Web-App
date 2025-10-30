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
