import { useEffect, useMemo, useState } from "react";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";

export function useRelatedChallenges(challengeIds: string[]) {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Memoize the challengeIds to prevent infinite re-renders
    const memoizedChallengeIds = useMemo(
        () => challengeIds || [],
        [challengeIds?.join(",")], // Use join to create a stable string dependency
    );

    useEffect(() => {
        const fetchRelatedChallenges = async () => {
            if (!memoizedChallengeIds || memoizedChallengeIds.length === 0) {
                setChallenges([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const fetchedChallenges = [];
                for (const challengeId of memoizedChallengeIds) {
                    const challenge =
                        await ChallengeController.getChallengeById(challengeId);
                    if (challenge) {
                        fetchedChallenges.push(challenge);
                    }
                }
                setChallenges(fetchedChallenges);
            } catch (err) {
                console.error("Error fetching related challenges:", err);
                setError("Failed to load related challenges");
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedChallenges();
    }, [memoizedChallengeIds]);

    return { challenges, loading, error };
}
