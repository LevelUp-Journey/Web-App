export type CourseStatus = "DRAFT" | "PUBLISHED";
export type CourseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Course {
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  difficulty: CourseDifficulty;
  completionScore: number;
  teacherId: string;
  totalLikes: number;
  totalEnrollments: number;
  createdAt: string;
  updatedAt: string;
}