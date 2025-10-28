export type GuideStatus = "DRAFT" | "PUBLISHED" | "PROTECTED";

export interface Guide {
  id: string;
  title: string;
  description: string;
  markdownContent: string;
  status: GuideStatus;
  totalLikes: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}