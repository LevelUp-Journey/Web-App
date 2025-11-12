"use client";

import type React from "react";
import { useDictionary } from "@/hooks/use-dictionary";
import { ProgrammingLanguage } from "@/lib/consts";

interface FullLanguageBadgeProps {
    language: ProgrammingLanguage;
    selected?: boolean;
}

const _DEFAULT_COLOR = "bg-muted text-muted-foreground";

const FullLanguageBadge: React.FC<FullLanguageBadgeProps> = ({
    language,
    selected = false,
}) => {
    // Define color schemes for each supported language
    const colorSchemes: Record<
        ProgrammingLanguage,
        {
            default: string;
            hover: string;
            selected: string;
        }
    > = {
        [ProgrammingLanguage.JAVA]: {
            default: "bg-[#75D0F8] text-[#1D5168]",
            hover: "hover:bg-[#75D0F8] hover:text-[#1D5168]",
            selected: "bg-[#75D0F8] text-[#1D5168]",
        },
        [ProgrammingLanguage.PYTHON]: {
            default: "bg-[#75D0F8] text-[#1D5168]",
            hover: "hover:bg-[#75D0F8] hover:text-[#1D5168]",
            selected: "bg-[#75D0F8] text-[#1D5168]",
        },
        [ProgrammingLanguage.C_PLUS_PLUS]: {
            default: "bg-[#75D0F8] text-[#1D5168]",
            hover: "hover:bg-[#75D0F8] hover:text-[#1D5168]",
            selected: "bg-[#75D0F8] text-[#1D5168]",
        },
        [ProgrammingLanguage.JAVASCRIPT]: {
            default: "bg-[#75D0F8] text-[#1D5168]",
            hover: "hover:bg-[#75D0F8] hover:text-[#1D5168]",
            selected: "bg-[#75D0F8] text-[#1D5168]",
        },
    };

    // Get the scheme for the language, fallback to JAVA if not found
    const scheme =
        colorSchemes[language] || colorSchemes[ProgrammingLanguage.JAVA];

    // Determine classes based on selected prop
    const classes = selected
        ? scheme.selected
        : `${scheme.default} ${scheme.hover}`;

    const dict = useDictionary();

    // Get the display name from dictionary, fallback to the original language if not mapped
    const languageKey = language
        .toLowerCase()
        .replace(/_plus_plus/g, "pp")
        .replace(/_/g, "");
    const displayName = dict?.challenges?.languages?.[languageKey] || language;

    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${classes}`}
        >
            {displayName}
        </span>
    );
};

export default FullLanguageBadge;
