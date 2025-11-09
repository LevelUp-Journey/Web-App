"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import ChallengeCard from "@/components/cards/challenge-card";
import GuideCard from "@/components/cards/guide-card";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useDictionary } from "@/hooks/use-dictionary";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { Guide } from "@/services/internal/learning/guides/domain/guide.entity";

export default function AdminPage() {
    const dict = useDictionary();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(false);

            const userId = await AuthController.getUserId();

            const [challengesData, guidesData] = await Promise.all([
                ChallengeController.getChallengesByTeacherId(userId),
                GuideController.getAllGuides(),
            ]);

            setChallenges(challengesData);
            setGuides(guidesData);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Spinner className="size-6 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>{dict?.admin.dashboard.loading}</EmptyTitle>
                    <EmptyDescription>
                        {dict?.admin.dashboard.loadingDescription}
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    if (error) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>{dict?.admin.dashboard.error}</EmptyTitle>
                    <EmptyDescription>
                        {dict?.admin.dashboard.errorDescription}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={loadData} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {dict?.admin.dashboard.retry}
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    // Ordenar cada tipo por fecha de actualización (más reciente primero)
    const sortByUpdated = (arr: any[]) =>
        arr.sort(
            (a, b) =>
                new Date(b.updatedAt ?? 0).getTime() -
                new Date(a.updatedAt ?? 0).getTime(),
        );

    const sortedChallenges = sortByUpdated([...challenges]);
    const sortedGuides = sortByUpdated([...guides]);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold tracking-tight">
                {dict?.admin.dashboard.title}
            </h2>

            {/* Challenges Row */}
            <section className="space-y-3">
                <h3 className="text-lg font-semibold">
                    {dict?.admin.dashboard.challenges}
                </h3>
                {sortedChallenges.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        {dict?.admin.dashboard.noChallenges}
                    </p>
                ) : (
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                        {sortedChallenges.map((challenge) => (
                            <div
                                key={challenge.id}
                                className="min-w-[340px] shrink-0"
                            >
                                <ChallengeCard
                                    challenge={challenge}
                                    codeVersions={challenge.codeVersions ?? []}
                                    adminMode={true}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Guides Row */}
            <section className="space-y-3">
                <h3 className="text-lg font-semibold">
                    {dict?.admin.dashboard.guides}
                </h3>
                {sortedGuides.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        {dict?.admin.dashboard.noGuides}
                    </p>
                ) : (
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                        {sortedGuides.map((guide) => (
                            <div
                                key={guide.id}
                                className="min-w-[340px] shrink-0"
                            >
                                <GuideCard guide={guide} adminMode={true} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
