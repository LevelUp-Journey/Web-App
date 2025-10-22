import VersionTestsManager from "@/components/challenges/version-tests-manager";
import type { ProgrammingLanguage } from "@/lib/consts";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import { VersionTestController } from "@/services/internal/challenges/controller/versions-test.controller";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/entities/version-test.entity";

interface PageProps {
    params: Promise<{ challengeId: string; codeVersionId: string }>;
    searchParams: Promise<{ editing?: string; testId?: string }>;
}

export default async function TestsPage({ params, searchParams }: PageProps) {
    const { challengeId, codeVersionId } = await params;
    const { editing, testId } = await searchParams;

    // Fetch data on the server
    const codeVersion: CodeVersion =
        await CodeVersionController.getCodeVersionById(
            challengeId,
            codeVersionId,
        );
    const tests: VersionTest[] =
        await VersionTestController.getVersionTestsByChallengeIdAndCodeVersionId(
            challengeId,
            codeVersionId,
        );

    const isEditing = editing === "true";

    return (
        <VersionTestsManager
            challengeId={challengeId}
            codeVersionId={codeVersionId}
            language={codeVersion.language as ProgrammingLanguage}
            defaultTestId={testId}
            isEditing={isEditing}
        />
    );
}
