import { useEffect, useState } from "react";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { SubscriptionController } from "@/services/internal/community/controller/subscription.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

// Posts now come with author data from backend (authorName, authorProfileUrl)
interface PostWithDetails extends Post {
    community?: Community;
}

export function useFollowingFeed() {
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFollowingFeed = async () => {
            try {
                setLoading(true);

                // Get current user ID
                const userId = await AuthController.getUserId();
                if (!userId) {
                    setError("User not authenticated");
                    setLoading(false);
                    return;
                }

                // Get user's subscriptions (communities they follow)
                const subscriptions =
                    await SubscriptionController.getSubscriptionsByUser(userId);

                if (subscriptions.length === 0) {
                    setPosts([]);
                    setLoading(false);
                    return;
                }

                // Get all posts (now includes author data from backend)
                const allPosts = await PostController.getAllPosts();

                // Filter posts to only show from subscribed communities
                const subscribedCommunityIds = new Set(
                    subscriptions.map((sub) => sub.communityId),
                );
                const followingPosts = allPosts.filter((post) =>
                    subscribedCommunityIds.has(post.communityId),
                );

                // Get communities for mapping
                const communityIds = [
                    ...new Set(followingPosts.map((p) => p.communityId)),
                ];
                const communityPromises = communityIds.map(async (id) => {
                    try {
                        return await CommunityController.getCommunityById(id);
                    } catch {
                        return null;
                    }
                });
                const communities = (
                    await Promise.all(communityPromises)
                ).filter((c): c is Community => c !== null);
                const communityMap = new Map(communities.map((c) => [c.id, c]));

                // Combine posts with community details
                // No need to fetch profiles - they come in posts! 🎉
                const postsWithDetails: PostWithDetails[] = followingPosts.map(
                    (post) => ({
                        ...post,
                        community: communityMap.get(post.communityId),
                    }),
                );

                // Sort by creation date (newest first)
                postsWithDetails.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                );

                setPosts(postsWithDetails);
            } catch (err) {
                console.error("Error loading following feed:", err);
                setError("Failed to load following feed");
            } finally {
                setLoading(false);
            }
        };

        loadFollowingFeed();
    }, []);

    return { posts, loading, error };
}
