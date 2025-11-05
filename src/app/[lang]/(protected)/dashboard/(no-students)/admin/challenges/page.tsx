import Link from "next/link";
import ChallengeCard from "@/components/cards/challenge-card";
import { Button } from "@/components/ui/button";
import { getLocalizedPaths } from "@/lib/paths";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default async function AdminChallengesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const PATHS = getLocalizedPaths(lang);
    const teacherId = await AuthController.getUserId();
    const challenges =
        await ChallengeController.getChallengesByTeacherId(teacherId);

    // Fetch code versions for each challenge
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
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Challenges</h2>
                <Button asChild>
                    <Link href={PATHS.DASHBOARD.CHALLENGES.CREATE}>
                        Create New Challenge
                    </Link>
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                {challenges.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
                        <p>No challenges created yet</p>
                    </div>
                ) : (
                    challenges.map((challenge) => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            codeVersions={
                                codeVersionsMap.get(challenge.id) || []
                            }
                            adminMode={true}
                            className="w-full"
                        />
                    ))
                )}
            </div>
        </div>
    );
}
