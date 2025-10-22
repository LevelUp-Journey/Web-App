import VersionTestsManager from "@/components/challenges/version-tests-manager";
import type { ProgrammingLanguage } from "@/lib/consts";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";

interface PageProps {
    params: Promise<{ challengeId: string; codeVersionId: string }>;
}

export default async function TestsPage({ params }: PageProps) {
    const { challengeId, codeVersionId } = await params;

    // Fetch the code version to get the language
    const codeVersion = await CodeVersionController.getCodeVersionById(
        challengeId,
        codeVersionId,
    );

    return (
        <VersionTestsManager
            challengeId={challengeId}
            codeVersionId={codeVersionId}
            language={codeVersion.language as ProgrammingLanguage}
        />
    );
}
