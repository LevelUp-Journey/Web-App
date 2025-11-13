"use client";

import type React from "react";
import { useDictionary } from "@/hooks/use-dictionary";
import { ChallengeDifficulty } from "@/lib/consts";
import { cn } from "@/lib/utils";

interface ChallengeDifficultyBadgeProps {
    difficulty?: ChallengeDifficulty;
    selected?: boolean;
}

const _DEFAULT_COLOR = "bg-muted text-muted-foreground";

// Colores por nivel de dificultad (modo claro / oscuro)
const COLOR_SCHEMES: Record<
    ChallengeDifficulty,
    { default: string; hover: string; selected: string }
> = {
    [ChallengeDifficulty.EASY]: {
        default: "bg-[#CDFFC4] text-[#0F6B00]",
        hover: "hover:bg-[#CDFFC4] hover:text-[#0F6B00]",
        selected: "bg-[#CDFFC4] text-[#0F6B00]",
    },
    [ChallengeDifficulty.MEDIUM]: {
        default: "bg-[#FFFCB1] text-[#B17300]",
        hover: "hover:bg-[#FFFCB1] hover:text-[#B17300]",
        selected: "bg-[#FFFCB1] text-[#B17300]",
    },
    [ChallengeDifficulty.HARD]: {
        default: "bg-[#FFC78E] text-[#944B00]",
        hover: "hover:bg-[#FFC78E] hover:text-[#944B00]",
        selected: "bg-[#FFC78E] text-[#944B00]",
    },
    [ChallengeDifficulty.EXPERT]: {
        default: "bg-[#FFC9C9] text-[#940000]",
        hover: "hover:bg-[#FFC9C9] hover:text-[#940000]",
        selected: "bg-[#FFC9C9] text-[#940000]",
    },
};

const ChallengeDifficultyBadge: React.FC<ChallengeDifficultyBadgeProps> = ({
    difficulty,
    selected = false,
}) => {
    const dict = useDictionary();
    const safeDifficulty = difficulty ?? ChallengeDifficulty.EASY;
    const scheme = COLOR_SCHEMES[safeDifficulty];

    // Get difficulty name from dictionary
    const difficultyKey = safeDifficulty.toLowerCase();
    const displayName =
        dict?.challenges?.difficulty?.[difficultyKey] || safeDifficulty;

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

export default ChallengeDifficultyBadge;
