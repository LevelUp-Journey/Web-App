export interface CreateCourseRequest {
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  completionScore: number;
}

export interface UpdateCourseRequest {
  id: string;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  completionScore: number;
}
