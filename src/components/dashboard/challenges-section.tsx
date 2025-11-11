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
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { CodeVersionController } from "@/services/internal/challenges/challenge/controller/code-version.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import type { CodeVersion } from "@/services/internal/challenges/challenge/entities/code-version.entity";

interface ChallengesSectionProps {
    onCountChange?: (count: number) => void;
    translations?: {
        loading?: string;
        error?: string;
        errorDescription?: string;
        retry?: string;
    };
}

export function ChallengesSection({
    onCountChange,
    translations = {
        loading: "Loading challenges...",
        error: "Error fetching challenges",
        errorDescription:
            "The challenge service is temporarily unavailable. Please try again.",
        retry: "Retry",
    },
}: ChallengesSectionProps = {}) {
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

            // Fetch all challenges
            const challengesData =
                await ChallengeController.getPublicChallenges();

            // If no challenges returned, consider it an error
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
                <p className="text-muted-foreground">{translations.loading}</p>
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
                    <EmptyTitle>{translations.error}</EmptyTitle>
                    <EmptyDescription>
                        {translations.errorDescription}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={loadChallenges} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {translations.retry}
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
