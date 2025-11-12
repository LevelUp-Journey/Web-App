import { useEffect, useState } from "react";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";

// Posts now come with author data from backend (authorName, authorProfileUrl)
interface PostWithDetails extends Post {
    community?: Community;
}

export function useCommunityFeed() {
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Get all posts (now includes author data from backend)
                const allPosts = await PostController.getAllPosts();

                // Get all communities for mapping
                const allCommunities =
                    await CommunityController.getCommunities();
                setCommunities(allCommunities);

                // Create a map of community ID to community
                const communityMap = new Map(
                    allCommunities.map((c) => [c.id, c]),
                );

                // Combine posts with community details
                // No need to fetch profiles - they come in posts! 🎉
                const postsWithDetails: PostWithDetails[] = allPosts.map(
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
                console.error("Error loading feed:", err);
                setError("Failed to load community feed");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { posts, communities, loading, error };
}
