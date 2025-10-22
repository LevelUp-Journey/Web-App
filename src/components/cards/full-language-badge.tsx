import type React from "react";
import { ProgrammingLanguage } from "@/lib/consts";

interface FullLanguageBadgeProps {
    language: ProgrammingLanguage;
    selected?: boolean;
}

const DEFAULT_COLOR = "bg-muted text-muted-foreground";

// Mapping of language keys to display names
const LANGUAGE_NAMES: Record<ProgrammingLanguage, string> = {
    [ProgrammingLanguage.JAVA]: "Java",
    [ProgrammingLanguage.PYTHON]: "Python",
    [ProgrammingLanguage.C_PLUS_PLUS]: "C++",
    [ProgrammingLanguage.JAVASCRIPT]: "JavaScript",
};

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
            default: DEFAULT_COLOR,
            hover: "hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300",
            selected:
                "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
        },
        [ProgrammingLanguage.PYTHON]: {
            default: DEFAULT_COLOR,
            hover: "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300",
            selected:
                "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        },
        [ProgrammingLanguage.C_PLUS_PLUS]: {
            default: DEFAULT_COLOR,
            hover: "hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900 dark:hover:text-sky-300",
            selected:
                "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
        },
        [ProgrammingLanguage.JAVASCRIPT]: {
            default: DEFAULT_COLOR,
            hover: "hover:bg-yellow-100 hover:text-yellow-700 dark:hover:bg-yellow-900 dark:hover:text-yellow-300",
            selected:
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
        },
    };

    // Get the scheme for the language, fallback to JAVA if not found
    const scheme =
        colorSchemes[language] || colorSchemes[ProgrammingLanguage.JAVA];

    // Determine classes based on selected prop
    const classes = selected
        ? scheme.selected
        : `${scheme.default} ${scheme.hover}`;

    // Get the display name, fallback to the original language if not mapped
    const displayName = LANGUAGE_NAMES[language] || language;

    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${classes}`}
        >
            {displayName}
        </span>
    );
};

export default FullLanguageBadge;
