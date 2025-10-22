import VersionTestsManager from "@/components/challenges/version-tests-manager";
import type { ProgrammingLanguage } from "@/lib/consts";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";

interface PageProps {
    params: Promise<{ challengeId: string; codeVersionId: string }>;
    searchParams: Promise<{ testId?: string }>;
}

export default async function TestsPage({ params, searchParams }: PageProps) {
    const { challengeId, codeVersionId } = await params;
    const { testId } = await searchParams;

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
            defaultTestId={testId}
        />
    );
}
