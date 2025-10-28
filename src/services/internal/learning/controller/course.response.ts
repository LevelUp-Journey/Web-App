// Request interfaces
export interface CreateCourseRequest {
  title: string;
  description?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  completionScore: number;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

// Response interfaces
export interface CourseResponse {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  totalGuides: number;
  rating: number;
  totalLikes: number;
  completionScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseListResponse {
  data: CourseResponse[];
  total: number;
  page: number;
  limit: number;
}

// URL Parameter interfaces
export interface GetCourseByIdParams {
  id: string;
}

export interface GetCourseListParams {
  page?: number;
  limit?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  teacherId?: string;
}
