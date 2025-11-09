import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/app/[lang]/dictionaries";
import ChallengeCard from "@/components/cards/challenge-card";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { getLocalizedPaths } from "@/lib/paths";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

// Force dynamic rendering since we use cookies for authentication
export const dynamic = "force-dynamic";

export default async function AdminChallengesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");
    const PATHS = getLocalizedPaths(lang);

    try {
        const teacherId = await AuthController.getUserId();
        const challenges =
            await ChallengeController.getChallengesByTeacherId(teacherId);

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

        if (challenges.length === 0) {
            return (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            {dict.admin.challenges.title}
                        </h2>
                        <Button asChild>
                            <Link href={PATHS.DASHBOARD.CHALLENGES.CREATE}>
                                {dict.admin.challenges.createNew}
                            </Link>
                        </Button>
                    </div>
                    <Empty className="min-h-[300px]">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <AlertCircle />
                            </EmptyMedia>
                            <EmptyTitle>
                                {dict.admin.challenges.noChallenges}
                            </EmptyTitle>
                            <EmptyDescription>
                                {dict.admin.challenges.noChallengesDescription}
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button asChild>
                                <Link href={PATHS.DASHBOARD.CHALLENGES.CREATE}>
                                    {dict.admin.challenges.create}
                                </Link>
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        {dict.admin.challenges.title}
                    </h2>
                    <Button asChild>
                        <Link href={PATHS.DASHBOARD.CHALLENGES.CREATE}>
                            {dict.admin.challenges.createNew}
                        </Link>
                    </Button>
                </div>
                <div className="flex flex-col gap-4">
                    {challenges.map((challenge) => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            codeVersions={
                                codeVersionsMap.get(challenge.id) || []
                            }
                            adminMode={true}
                            className="w-full"
                        />
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>{dict.admin.challenges.error}</EmptyTitle>
                    <EmptyDescription>
                        {dict.admin.challenges.errorDescription}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button asChild>
                        <Link href={PATHS.DASHBOARD.CHALLENGES.CREATE}>
                            {dict.admin.challenges.create}
                        </Link>
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }
}
