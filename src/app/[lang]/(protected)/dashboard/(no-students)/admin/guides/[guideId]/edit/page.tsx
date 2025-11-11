import { redirect } from "next/navigation";
import { EditGuideClient } from "@/components/learning/guide/editor/edit-guide-client";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { ChallengeReference } from "@/services/internal/learning/guides/controller/guide.response";
import type { GuideEditorChallengeSummary } from "@/stores/guide-editor-store";
import { getLocalizedPaths } from "@/lib/paths";

interface EditGuidePageProps {
    params: {
        lang: string;
        guideId: string;
    };
    searchParams: {
        tab?: string;
    };
}

function mapGuideChallenges(
    challenges: (GuideEditorChallengeSummary | ChallengeReference)[] | undefined,
): GuideEditorChallengeSummary[] {
    if (!challenges?.length) {
        return [];
    }

    const unique = new Map<string, GuideEditorChallengeSummary>();
    challenges.forEach((challenge) => {
        unique.set(challenge.id, challenge);
    });
    return Array.from(unique.values());
}

export default async function EditGuidePage({
    params,
    searchParams,
}: EditGuidePageProps) {
    const { lang, guideId } = params;
    const PATHS = getLocalizedPaths(lang);

    const guide = await GuideController.getGuideById(guideId);

    if (!guide) {
        redirect(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
    }

    const challenges = mapGuideChallenges(guide.challenges);

    return (
        <EditGuideClient
            guide={guide}
            challenges={challenges}
            initialTab={searchParams?.tab}
        />
    );
}
