import { Award, BookOpen, Heart } from "lucide-react";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";

// Helper function for difficulty badge colors
export function getDifficultyColor(difficulty: string): string {
    const colors: Record<string, string> = {
        BEGINNER: "bg-green-500/10 text-green-700 dark:text-green-400",
        INTERMEDIATE: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        ADVANCED: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
        EXPERT: "bg-red-500/10 text-red-700 dark:text-red-400",
    };
    return (
        colors[difficulty.toUpperCase()] ??
        "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    );
}

// Component for course statistics
export function CourseStats({ course }: { course: Course }) {
    const stats = [
        {
            icon: BookOpen,
            label: "Guides",
            value: course.guides?.length || 0,
        },
        {
            icon: Heart,
            label: "Likes",
            value: course.likesCount || 0,
        },
        {
            icon: Award,
            label: "Difficulty",
            value: course.difficultyLevel,
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            {stats.map(({ icon: Icon, label, value }) => (
                <div
                    key={label}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card"
                >
                    <Icon className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                </div>
            ))}
        </div>
    );
}
