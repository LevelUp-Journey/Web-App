import { useCallback, useEffect, useState } from "react";
import { useSubscriptionContext } from "@/contexts/subscription-context";
import { SubscriptionController } from "@/services/internal/community/controller/subscription.controller";
import type { Subscription } from "@/services/internal/community/entities/subscription.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

const MAX_SUBSCRIPTIONS = 20; // Limit sidebar subscriptions for performance

export function useUserSubscriptions() {
    const { subscriptionKey } = useSubscriptionContext();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const loadSubscriptions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // TODO: The new API doesn't have an endpoint to get all user subscriptions
            // This functionality needs to be reimplemented or removed
            // const userId = await AuthController.getUserId();
            // const paginatedResponse =
            //     await SubscriptionController.getSubscriptionsByUser(
            //         userId,
            //         0,
            //         MAX_SUBSCRIPTIONS, // Limit for sidebar performance
            //     );

            // // API now returns community name and image directly
            // setSubscriptions(paginatedResponse.content);

            // Temporary: set empty array
            setSubscriptions([]);
        } catch (err) {
            console.error("Error loading subscriptions:", err);
            setError("Failed to load subscriptions");
            setSubscriptions([]); // Clear on error
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        if (isInitialLoad) {
            loadSubscriptions();
            setIsInitialLoad(false);
        }
    }, [isInitialLoad, loadSubscriptions]);

    // Only reload when subscriptionKey changes (not on initial mount)
    useEffect(() => {
        if (!isInitialLoad && subscriptionKey > 0) {
            loadSubscriptions();
        }
    }, [subscriptionKey, loadSubscriptions, isInitialLoad]);

    return {
        subscriptions,
        loading,
        error,
        reload: loadSubscriptions,
    };
}
