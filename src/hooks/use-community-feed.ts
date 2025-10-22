import { useEffect, useState } from "react";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import type { Post } from "@/services/internal/community/entities/post.entity";
import type { Community } from "@/services/internal/community/entities/community.entity";

interface PostWithDetails extends Post {
    authorProfile?: {
        username: string;
        profileUrl?: string;
        firstName?: string;
        lastName?: string;
    };
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

                // Get all posts
                const allPosts = await PostController.getAllPosts();

                // Get all communities for mapping
                const allCommunities = await CommunityController.getCommunities();
                setCommunities(allCommunities);

                // Create a map of community ID to community
                const communityMap = new Map(allCommunities.map(c => [c.id, c]));

                // Get unique author IDs
                const authorIds = [...new Set(allPosts.map(p => p.authorId))];

                // Get profiles for all authors
                const profilePromises = authorIds.map(async (authorId) => {
                    try {
                        const profile = await ProfileController.getProfileByUserId(authorId);
                        return { authorId, profile };
                    } catch (error) {
                        console.error(`Error loading profile for ${authorId}:`, error);
                        return { authorId, profile: { username: "Unknown User" } };
                    }
                });

                const profiles = await Promise.all(profilePromises);
                const profileMap = new Map(profiles.map(p => [p.authorId, p.profile]));

                // Combine posts with details
                const postsWithDetails: PostWithDetails[] = allPosts.map(post => ({
                    ...post,
                    authorProfile: profileMap.get(post.authorId),
                    community: communityMap.get(post.communityId),
                }));

                // Sort by creation date (newest first)
                postsWithDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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