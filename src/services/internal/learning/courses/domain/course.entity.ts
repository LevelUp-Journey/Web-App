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
    guides: CourseGuide[];
    createdAt: string;
    updatedAt: string;
}

export interface CourseGuide {
    guideId: string;
    position: number;
}
