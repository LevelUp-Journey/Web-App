import { Guide } from "@/services/internal/learning/guides/domain/guide.entity";

export interface CourseGuide {
    guide: Guide;
    orderIndex: number;
}
