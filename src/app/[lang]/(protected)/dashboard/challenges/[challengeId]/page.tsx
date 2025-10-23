import { serialize } from "next-mdx-remote-client/serialize";
import ChallengeEditing from "@/components/challenges/challenge-editing";
import ChallengeSummary from "@/components/challenges/challenge-summary";
import { UserRole } from "@/lib/consts";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

interface PageProps {
    params: Promise<{ challengeId: string }>;
    searchParams: Promise<{ editing?: string }>;
}

export default async function ChallengePage({
    params,
    searchParams,
}: PageProps) {
    const { challengeId } = await params;
    const { editing } = await searchParams;

    // Fetch data on the server
    const challenge: Challenge =
        await ChallengeController.getChallengeById(challengeId);
    const codeVersions: CodeVersion[] =
        await CodeVersionController.getCodeVersionsByChallengeId(challengeId);
    const userRoles = await AuthController.getUserRoles();
    const isTeacher = userRoles.includes(UserRole.TEACHER);

    const isEditing = editing === "true";

    // Serialize the description for client-side rendering
    const serializedMarkdown = challenge.description
        ? await serialize({ source: challenge.description })
        : null;

    if (isEditing) {
        return (
            <ChallengeEditing
                challengeId={challengeId}
                initialChallenge={challenge}
                initialCodeVersions={codeVersions}
            />
        );
    }

    return (
        <ChallengeSummary
            challenge={challenge}
            codeVersions={codeVersions}
            serializedMarkdown={serializedMarkdown}
            isTeacher={isTeacher}
        />
    );
}
