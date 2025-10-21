import VersionEditing from "@/components/challenges/code-versions/version-editing";
import VersionSummary from "@/components/challenges/code-versions/version-summary";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";

interface PageProps {
    params: Promise<{ challengeId: string }>;
    searchParams: Promise<{ editing?: string }>;
}

export default async function ChallengeVersionsPage({
    params,
    searchParams,
}: PageProps) {
    const { challengeId } = await params;
    const { editing } = await searchParams;

    // Fetch data on the server
    const codeVersions: CodeVersion[] =
        await CodeVersionController.getCodeVersionsByChallengeId(challengeId);

    const isEditing = editing === "true";

    if (isEditing) {
        return <VersionEditing challengeId={challengeId} />;
    }

    return (
        <VersionSummary challengeId={challengeId} codeVersions={codeVersions} />
    );
}
