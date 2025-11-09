import { redirect } from "next/navigation";
import CodeVersionDetail from "@/components/challenges/code-versions/code-version-detail";
import { UserRole } from "@/lib/consts";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import { VersionTestController } from "@/services/internal/challenges/challenge/controller/versions-test.controller";
import type { VersionTest } from "@/services/internal/challenges/challenge/entities/version-test.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

interface PageProps {
    params: Promise<{ challengeId: string; codeVersionId: string }>;
    searchParams: Promise<{ editing?: string }>;
}

export default async function CodeVersionPage({
    params,
    searchParams,
}: PageProps) {
    const { challengeId, codeVersionId } = await params;
    const { editing } = await searchParams;

    // Check user roles
    const userRoles = await AuthController.getUserRoles();
    const isTeacherOrAdmin =
        userRoles.includes(UserRole.TEACHER) ||
        userRoles.includes(UserRole.ADMIN);

    if (!isTeacherOrAdmin) {
        // Redirect students back to the challenge page
        redirect(`/dashboard/challenges/${challengeId}`);
    }

    // Fetch data on the server
    const codeVersion = await CodeVersionController.getCodeVersionById(
        challengeId,
        codeVersionId,
    );

    if (!codeVersion) {
        redirect(`/dashboard/challenges/${challengeId}`);
    }

    const tests: VersionTest[] =
        await VersionTestController.getVersionTestsByChallengeIdAndCodeVersionId(
            challengeId,
            codeVersionId,
        );

    const isEditing = editing === "true";

    return (
        <CodeVersionDetail
            challengeId={challengeId}
            codeVersion={codeVersion}
            tests={tests}
            isEditing={isEditing}
        />
    );
}
