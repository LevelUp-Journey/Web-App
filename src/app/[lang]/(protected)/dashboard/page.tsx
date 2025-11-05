import ChallengeCard from "@/components/cards/challenge-card";
import UniversityAnnouncements from "@/components/dashboard/university-announcements";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

export default async function DashboardPage() {
    // fetch all challenges
    const challenges = await ChallengeController.getPublicChallenges();

    // fetch code versions for each challenge
    const codeVersionsMap = new Map<string, CodeVersion[]>();
    await Promise.all(
        challenges.map(async (challenge) => {
            const versions =
                await CodeVersionController.getCodeVersionsByChallengeId(
                    challenge.id,
                );
            codeVersionsMap.set(challenge.id, versions);
        }),
    );

    return (
        <div className="space-y-4 w-full container mx-auto pt-4">
            {/* Carousel - Full Width */}
            <UniversityAnnouncements />

            <div className="container mx-auto p-4 space-y-4">
                <h2 className="text-2xl font-semibold">Challenges</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {challenges.map((challenge) => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            codeVersions={
                                codeVersionsMap.get(challenge.id) || []
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
