"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { useDictionary } from "@/hooks/use-dictionary";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

interface ChallengesPageSectionProps {
    onCountChange?: (count: number) => void;
}

export function ChallengesPageSection({
    onCountChange,
}: ChallengesPageSectionProps = {}) {
    const dict = useDictionary();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [codeVersionsMap, setCodeVersionsMap] = useState<
        Map<string, CodeVersion[]>
    >(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadChallenges = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);

            // Fetch challenges
            const challengesData =
                await ChallengeController.getPublicChallenges();

            if (challengesData.length === 0) {
                setError(true);
                setChallenges([]);
                onCountChange?.(0);
                return;
            }

            setChallenges(challengesData);

            // Get all challenge IDs
            const challengeIds = challengesData.map(
                (challenge) => challenge.id,
            );

            // Fetch all code versions in a single batch request
            const codeVersionsBatch =
                await CodeVersionController.getCodeVersionsBatchByChallengesId(
                    challengeIds,
                );

            // Create a map for easy lookup: challengeId -> codeVersions
            const versionsMap = new Map(
                codeVersionsBatch.map((item) => [
                    item.challengeId,
                    item.codeVersions,
                ]),
            );

            setCodeVersionsMap(versionsMap);
            onCountChange?.(challengesData.length);
        } catch (err) {
            console.error("Error loading challenges:", err);
            setError(true);
            onCountChange?.(0);
        } finally {
            setLoading(false);
        }
    }, [onCountChange]);

    useEffect(() => {
        loadChallenges();
    }, [loadChallenges]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner className="size-8 mb-4" />
                <p className="text-muted-foreground">
                    {dict?.challenges?.messages?.loadingChallenges ||
                        "Loading challenges..."}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>
                        {dict?.challenges?.messages?.errorFetchingChallenges ||
                            "Error fetching challenges"}
                    </EmptyTitle>
                    <EmptyDescription>
                        {dict?.challenges?.messages?.challengesUnavailable ||
                            "The challenge service is temporarily unavailable. Please try again."}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={loadChallenges} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {dict?.challenges?.buttons?.retry || "Retry"}
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
                <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    codeVersions={codeVersionsMap.get(challenge.id) || []}
                />
            ))}
        </section>
    );
}
