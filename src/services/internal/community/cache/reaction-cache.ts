import type {
    Reaction,
    ReactionCount,
    ReactionType,
} from "../entities/reaction.entity";

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ReactionCache {
    private countsCache = new Map<string, CacheEntry<ReactionCount>>();
    private userReactionCache = new Map<string, CacheEntry<Reaction | null>>();

    getCounts(postId: string): ReactionCount | null {
        const cached = this.countsCache.get(postId);
        if (!cached) return null;

        const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
        if (isExpired) {
            this.countsCache.delete(postId);
            return null;
        }

        return cached.data;
    }

    setCounts(postId: string, counts: ReactionCount): void {
        this.countsCache.set(postId, { data: counts, timestamp: Date.now() });
    }

    getUserReaction(
        userId: string,
        postId: string,
    ): Reaction | null | undefined {
        const key = this.userReactionKey(userId, postId);
        const cached = this.userReactionCache.get(key);
        if (!cached) return undefined;

        const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
        if (isExpired) {
            this.userReactionCache.delete(key);
            return undefined;
        }

        return cached.data;
    }

    setUserReaction(
        userId: string,
        postId: string,
        reaction: Reaction | null,
    ): void {
        const key = this.userReactionKey(userId, postId);
        this.userReactionCache.set(key, {
            data: reaction,
            timestamp: Date.now(),
        });
    }

    invalidatePost(postId: string): void {
        this.countsCache.delete(postId);

        for (const key of this.userReactionCache.keys()) {
            if (key.endsWith(`:${postId}`)) {
                this.userReactionCache.delete(key);
            }
        }
    }

    invalidateUserReaction(userId: string, postId: string): void {
        const key = this.userReactionKey(userId, postId);
        this.userReactionCache.delete(key);
        // Also drop counts so they can be reloaded with the new reaction state
        this.countsCache.delete(postId);
    }

    private userReactionKey(userId: string, postId: string): string {
        return `${userId}:${postId}`;
    }
}

export const reactionCache = new ReactionCache();
