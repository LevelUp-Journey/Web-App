// Request interfaces
export interface CreateGuideRequest {
  courseId: string;
  title: string;
  content: string;
  order: number;
  isProtected: boolean;
}

export interface UpdateGuideRequest {
  title?: string;
  content?: string;
  order?: number;
  isProtected?: boolean;
}

// Response interfaces
export interface GuideResponse {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  content: string;
  order: number;
  isProtected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuideListResponse {
  data: GuideResponse[];
  total: number;
  page: number;
  limit: number;
}

// URL Parameter interfaces
export interface GetGuideByIdParams {
  id: string;
}

export interface GetGuideListParams {
  page?: number;
  limit?: number;
  courseId?: string;
  authorId?: string;
}
