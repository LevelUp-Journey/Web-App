import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CourseDifficulty } from "@/services/internal/learning/courses/domain/course.entity";

interface DifficultyBadgeProps {
    difficulty: CourseDifficulty;
    className?: string;
}

const difficultyConfig = {
    [CourseDifficulty.BEGINNER]: {
        label: "Beginner",
        className:
            "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100",
    },
    [CourseDifficulty.INTERMEDIATE]: {
        label: "Intermediate",
        className:
            "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100",
    },
    [CourseDifficulty.ADVANCED]: {
        label: "Advanced",
        className:
            "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-100",
    },
    [CourseDifficulty.EXPERT]: {
        label: "Expert",
        className:
            "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100",
    },
};

export function DifficultyBadge({
    difficulty,
    className,
}: DifficultyBadgeProps) {
    const config = difficultyConfig[difficulty];

    return (
        <Badge variant="secondary" className={cn(config.className, className)}>
            {config.label}
        </Badge>
    );
}
