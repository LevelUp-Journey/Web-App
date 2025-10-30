import type React from "react";
import { cn } from "@/lib/utils"; // si no tienes esta función, te explico cómo hacerla abajo
import { CourseDifficulty } from "@/services/internal/learning/courses/controller/course.response";

interface CourseDifficultyBadgeProps {
    difficulty: CourseDifficulty;
    selected?: boolean;
}

const DEFAULT_COLOR = "bg-muted text-muted-foreground";

// Mapping de etiquetas legibles
const DIFFICULTY_NAMES: Record<CourseDifficulty, string> = {
    [CourseDifficulty.BEGINNER]: "Beginner",
    [CourseDifficulty.INTERMEDIATE]: "Intermediate",
    [CourseDifficulty.ADVANCED]: "Advanced",
    [CourseDifficulty.EXPERT]: "Expert",
};

// Colores por nivel de dificultad (modo claro / oscuro)
const COLOR_SCHEMES: Record<
    CourseDifficulty,
    { default: string; hover: string; selected: string }
> = {
    [CourseDifficulty.BEGINNER]: {
        default: DEFAULT_COLOR,
        hover: "hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300",
        selected:
            "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    [CourseDifficulty.INTERMEDIATE]: {
        default: DEFAULT_COLOR,
        hover: "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300",
        selected:
            "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    [CourseDifficulty.ADVANCED]: {
        default: DEFAULT_COLOR,
        hover: "hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-900 dark:hover:text-orange-300",
        selected:
            "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    },
    [CourseDifficulty.EXPERT]: {
        default: DEFAULT_COLOR,
        hover: "hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300",
        selected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    },
};

const CourseDifficultyBadge: React.FC<CourseDifficultyBadgeProps> = ({
    difficulty,
    selected = false,
}) => {
    const scheme = COLOR_SCHEMES[difficulty];
    const displayName = DIFFICULTY_NAMES[difficulty];
    const classes = selected
        ? scheme.selected
        : `${scheme.default} ${scheme.hover}`;

    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200",
                classes,
            )}
        >
            {displayName}
        </span>
    );
};

export default CourseDifficultyBadge;
