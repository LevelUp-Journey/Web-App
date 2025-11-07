import { useEffect, useState } from "react";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { ReactionController } from "@/services/internal/community/controller/reaction.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";
import type { Reaction } from "@/services/internal/community/entities/reaction.entity";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

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
                const allCommunities =
                    await CommunityController.getCommunities();
                setCommunities(allCommunities);

                // Create a map of community ID to community
                const communityMap = new Map(
                    allCommunities.map((c) => [c.id, c]),
                );

                // Get unique author IDs
                const authorIds = [...new Set(allPosts.map((p) => p.authorId))];

                // Get profiles for all authors
                const profilePromises = authorIds.map(async (authorId) => {
                    try {
                        const profile =
                            await ProfileController.getProfileByUserId(
                                authorId,
                            );
                        return {
                            authorId,
                            profile:
                                profile ?? {
                                    username: "Unknown User",
                                },
                        };
                    } catch (error) {
                        console.error(
                            `Error loading profile for ${authorId}:`,
                            error,
                        );
                        return {
                            authorId,
                            profile: { username: "Unknown User" },
                        };
                    }
                });

                const profiles = await Promise.all(profilePromises);
                const profileMap = new Map(
                    profiles.map((p) => [p.authorId, p.profile]),
                );

                // Get reactions for all posts
                const reactionPromises = allPosts.map(async (post) => {
                    try {
                        const reactions =
                            await ReactionController.getReactionsByPostId(
                                post.id,
                            );
                        return { postId: post.id, reactions };
                    } catch (error) {
                        console.error(
                            `Error loading reactions for post ${post.id}:`,
                            error,
                        );
                        return { postId: post.id, reactions: [] };
                    }
                });

                const postReactions = await Promise.all(reactionPromises);
                const reactionMap = new Map(
                    postReactions.map((r) => [r.postId, r.reactions]),
                );

                // Combine posts with details
                const postsWithDetails: PostWithDetails[] = allPosts.map(
                    (post) => ({
                        ...post,
                        authorProfile:
                            profileMap.get(post.authorId) ?? {
                                username: "Unknown User",
                            },
                        community: communityMap.get(post.communityId),
                        reactions: reactionMap.get(post.id) || [],
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
