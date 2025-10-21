import ChallengeEditing from "@/components/challenges/challenge-editing";
import ChallengeSummary from "@/components/challenges/challenge-summary";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";

interface PageProps {
    params: Promise<{ challengeId: string }>;
    searchParams: Promise<{ editing?: string }>;
}

export default async function ChallengeEditPage({
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

    console.log("CHALLENGE", challenge);

    const isEditing = editing === "true";

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
            renderedMdx={<MdxRenderer source={challenge.description || ""} />}
        />
    );
}
