import { useEffect, useState } from "react";
import { SubscriptionController } from "@/services/internal/community/controller/subscription.controller";

/**
 * Hook to fetch and cache the follower count for a community
 * Uses the subscription cache system for optimal performance
 */
export function useCommunityFollowerCount(communityId: string) {
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchCount() {
            try {
                setLoading(true);
                const result = await SubscriptionController.getSubscriptionCount(communityId);

                if (isMounted) {
                    setCount(result.count);
                }
            } catch (error) {
                console.error("Failed to fetch follower count:", error);
                // Keep existing count on error
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchCount();

        return () => {
            isMounted = false;
        };
    }, [communityId]);

    return { count, loading };
}
