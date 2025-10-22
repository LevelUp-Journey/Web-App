import CodeVersionSummary from "@/components/challenges/code-versions/code-version-summary";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import { VersionTestController } from "@/services/internal/challenges/controller/versions-test.controller";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import type { VersionTest } from "@/services/internal/challenges/entities/version-test.entity";

interface PageProps {
    params: Promise<{ challengeId: string; codeVersionId: string }>;
    searchParams: Promise<{ editing?: string }>;
}

export default async function CodeVersionPage({ params }: PageProps) {
    const { challengeId, codeVersionId } = await params;

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

    return (
        <CodeVersionSummary
            challengeId={challengeId}
            codeVersion={codeVersion}
            tests={tests}
        />
    );
}
