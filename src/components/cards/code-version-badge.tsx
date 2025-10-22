import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import { ProgrammingLanguage } from "@/lib/consts";
import { CPlusPlus } from "../ui/svgs/cplusplus";
import { Java } from "../ui/svgs/java";
import { Javascript } from "../ui/svgs/javascript";
import { Python } from "../ui/svgs/python";

const ICONS = {
    [ProgrammingLanguage.JAVA]: Java,
    [ProgrammingLanguage.PYTHON]: Python,
    [ProgrammingLanguage.JAVASCRIPT]: Javascript,
    [ProgrammingLanguage.C_PLUS_PLUS]: CPlusPlus,
};

export default function CodeVersionBadge({
    version,
}: {
    version: CodeVersion;
}) {
    const Icon = ICONS[version.language as ProgrammingLanguage];

    return <>{Icon && <Icon width={28} height={28} />}</>;
}
