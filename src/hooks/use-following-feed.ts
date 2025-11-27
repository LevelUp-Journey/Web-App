import { useEffect, useState } from "react";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

// Posts now come with author data from backend (authorName, authorProfileUrl)
// Using /api/v1/posts/feed/{userId} endpoint
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

                // TODO: The new API doesn't have a feed endpoint
                // This functionality needs to be reimplemented or removed
                // const feedPosts = await PostController.getFeedPosts(userId);
                const feedPosts: any[] = []; // Empty array for now

                if (feedPosts.length === 0) {
                    setPosts([]);
                    setLoading(false);
                    return;
                }

                // Get communities for mapping
                const communityIds = [
                    ...new Set(feedPosts.map((p) => p.communityId)),
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
                // Posts already include authorName (username) and authorProfileUrl from backend! 🎉
                const postsWithDetails: PostWithDetails[] = feedPosts.map(
                    (post) => ({
                        ...post,
                        community: communityMap.get(post.communityId),
                    }),
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
