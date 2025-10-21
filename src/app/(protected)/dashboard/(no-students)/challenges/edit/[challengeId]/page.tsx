import { MDXRemote } from "next-mdx-remote-client/rsc";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import ChallengeEditing from "./ChallengeEditing";
import ChallengeSummaryClient from "./ChallengeSummaryClient";

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

    // Render MDX for viewing mode
    const renderedMdx = <MDXRemote source={challenge.description || ""} />;

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
        <ChallengeSummaryClient
            challenge={challenge}
            codeVersions={codeVersions}
            renderedMdx={renderedMdx}
        />
    );
}
