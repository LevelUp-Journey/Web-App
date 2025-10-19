import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import { CPlusPlus } from "../ui/svgs/cplusplus";
import { Java } from "../ui/svgs/java";
import { Javascript } from "../ui/svgs/javascript";
import { Python } from "../ui/svgs/python";

const ICONS = {
    JAVA: Java,
    PYTHON: Python,
    JAVASCRIPT: Javascript,
    C_PLUS_PLUS: CPlusPlus,
};

export default function CodeVersionBadge({
    version,
}: {
    version: CodeVersion;
}) {
    const Icon = ICONS[version.language as keyof typeof ICONS];

    return <>{Icon && <Icon width={28} height={28} />}</>;
}
