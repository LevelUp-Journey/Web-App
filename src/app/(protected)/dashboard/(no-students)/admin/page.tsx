import ChallengeCard from "@/components/cards/challenge-card";
import { Button } from "@/components/ui/button";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/entities/code-version.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import Link from "next/link";

export default async function AdminPage() {
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
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">
                    Admin Dashboard - My Challenges
                </h1>
                <Button asChild>
                    <Link href="/dashboard/challenges/create">
                        Create New Challenge
                    </Link>
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {challenges.map((challenge) => (
                    <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        codeVersions={codeVersionsMap.get(challenge.id) || []}
                        adminMode={true}
                    />
                ))}
            </div>
        </div>
    );
}
