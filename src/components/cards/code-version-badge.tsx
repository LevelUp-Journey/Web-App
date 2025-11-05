import { CPlusPlus } from "@/components/ui/svgs/cplusplus";
import { Java } from "@/components/ui/svgs/java";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Python } from "@/components/ui/svgs/python";
import { ProgrammingLanguage } from "@/lib/consts";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

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
