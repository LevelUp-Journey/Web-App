import VersionEditing from "@/components/challenges/code-versions/version-editing";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";

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

    const isEditing = editing === "true";

    // This page is only for creating new code versions
    if (!isEditing) {
        // Redirect to challenge edit page if not editing
        return null;
    }

    return <VersionEditing challengeId={challengeId} />;
}
