import { useCallback, useEffect, useState } from "react";
import { useSubscriptionContext } from "@/contexts/subscription-context";
import { SubscriptionController } from "@/services/internal/community/controller/subscription.controller";
import type { SubscriptionResponse } from "@/services/internal/community/server/subscription.actions";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

const MAX_SUBSCRIPTIONS = 20; // Limit sidebar subscriptions for performance

export function useUserSubscriptions() {
    const { subscriptionKey } = useSubscriptionContext();
    const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSubscriptions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const userId = await AuthController.getUserId();
            const paginatedResponse =
                await SubscriptionController.getSubscriptionsByUser(
                    userId,
                    0,
                    MAX_SUBSCRIPTIONS, // Limit for sidebar performance
                );

            // API now returns community name and image directly
            setSubscriptions(paginatedResponse.content);
        } catch (err) {
            console.error("Error loading subscriptions:", err);
            setError("Failed to load subscriptions");
            setSubscriptions([]); // Clear on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSubscriptions();
    }, [loadSubscriptions, subscriptionKey]); // Re-run when subscriptionKey changes

    return {
        subscriptions,
        loading,
        error,
        reload: loadSubscriptions,
    };
}
