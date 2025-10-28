export interface CreateGuideRequest {
  title: string;
  description: string;
  markdownContent: string;
}

export interface UpdateGuideRequest {
  id: string;
  title: string;
  description: string;
  markdownContent: string;
}