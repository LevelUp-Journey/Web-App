import { Course } from "@/services/internal/learning/courses/domain/course.entity";

export interface GuideCourse {
    course: Course;
    orderIndex: number;
}
