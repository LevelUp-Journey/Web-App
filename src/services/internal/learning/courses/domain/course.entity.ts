import type { CourseDifficulty } from "../controller/course.response";

export interface Course {
    id: string;
    title: string;
    description: string;
    teacherId: string;
    status: string;
    difficulty: CourseDifficulty;
    totalGuides: number;
    rating: number;
    totalLikes: number;
    completionScore: number;
    cover: string;
    createdAt: string;
    updatedAt: string;
}
