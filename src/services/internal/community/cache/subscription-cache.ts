/**
 * Cache manager for subscription data
 * Stores subscription counts and user subscription status to minimize API calls
 */

import type { Subscription, SubscriptionCount } from "../entities/subscription.entity";

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class SubscriptionCache {
    private countCache = new Map<string, CacheEntry<SubscriptionCount>>();
    private userSubscriptionCache = new Map<string, CacheEntry<Subscription | null>>();

    /**
     * Get cached subscription count for a community
     */
    getCount(communityId: string): SubscriptionCount | null {
        const cached = this.countCache.get(communityId);
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > CACHE_DURATION) {
            this.countCache.delete(communityId);
            return null;
        }

        return cached.data;
    }

    /**
     * Set subscription count in cache
     */
    setCount(communityId: string, count: SubscriptionCount): void {
        this.countCache.set(communityId, {
            data: count,
            timestamp: Date.now(),
        });
    }

    /**
     * Get cached user subscription status for a community
     */
    getUserSubscription(userId: string, communityId: string): Subscription | null | undefined {
        const key = `${userId}:${communityId}`;
        const cached = this.userSubscriptionCache.get(key);
        if (!cached) return undefined;

        const now = Date.now();
        if (now - cached.timestamp > CACHE_DURATION) {
            this.userSubscriptionCache.delete(key);
            return undefined;
        }

        return cached.data;
    }

    /**
     * Set user subscription status in cache
     */
    setUserSubscription(userId: string, communityId: string, subscription: Subscription | null): void {
        const key = `${userId}:${communityId}`;
        this.userSubscriptionCache.set(key, {
            data: subscription,
            timestamp: Date.now(),
        });
    }

    /**
     * Invalidate cache for a specific community (called after subscribe/unsubscribe)
     */
    invalidateCommunity(communityId: string): void {
        // Remove count cache
        this.countCache.delete(communityId);

        // Remove all user subscription cache entries for this community
        const keysToDelete: string[] = [];
        for (const key of this.userSubscriptionCache.keys()) {
            if (key.endsWith(`:${communityId}`)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.userSubscriptionCache.delete(key));
    }

    /**
     * Invalidate user subscription cache for a specific user-community pair
     */
    invalidateUserSubscription(userId: string, communityId: string): void {
        const key = `${userId}:${communityId}`;
        this.userSubscriptionCache.delete(key);

        // Also invalidate count since subscription changed
        this.countCache.delete(communityId);
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.countCache.clear();
        this.userSubscriptionCache.clear();
    }
}

// Export singleton instance
export const subscriptionCache = new SubscriptionCache();
