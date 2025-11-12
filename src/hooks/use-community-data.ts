import { useEffect, useState } from "react";
import { UserRole } from "@/lib/consts";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

type ProfileSummary = {
    username?: string;
    profileUrl?: string;
    firstName?: string;
    lastName?: string;
} | null;

interface PostWithDetails extends Post {
    authorProfile?: ProfileSummary;
    community?: Community;
    commentProfiles?: Record<string, ProfileSummary>;
}

const toProfileSummary = (profile: ProfileResponse | null): ProfileSummary =>
    profile
        ? {
              username: profile.username,
              profileUrl: profile.profileUrl,
              firstName: profile.firstName,
              lastName: profile.lastName,
          }
        : null;

export function useCommunityData(communityId: string) {
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [ownerProfile, setOwnerProfile] = useState<ProfileResponse | null>(
        null,
    );
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [canCreatePost, setCanCreatePost] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [userId, userRoles, communityData, communityPosts] =
                    await Promise.all([
                        AuthController.getUserId(),
                        AuthController.getUserRoles(),
                        CommunityController.getCommunityById(communityId),
                        PostController.getPostsByCommunityId(communityId),
                    ]);

                setCurrentUserId(userId);

                // Check if user can create posts (only TEACHER and ADMIN)
                const hasCreatePermission =
                    userRoles.includes(UserRole.TEACHER) ||
                    userRoles.includes(UserRole.ADMIN);
                setCanCreatePost(hasCreatePermission);

                setCommunity(communityData);

                const profile = await ProfileController.getProfileByUserId(
                    communityData.ownerId,
                );
                setOwnerProfile(profile ?? null);

                // Get unique author IDs across posts and comments
                const authorIds = [
                    ...new Set([
                        ...communityPosts.map((p) => p.authorId),
                        ...communityPosts.flatMap((post) =>
                            post.comments.map((comment) => comment.authorId),
                        ),
                    ]),
                ];

                // Get profiles for all authors
                const profilePromises = authorIds.map(async (authorId) => {
                    try {
                        const profile =
                            await ProfileController.getProfileByUserId(
                                authorId,
                            );
                        return {
                            authorId,
                            profile: toProfileSummary(profile),
                        };
                    } catch (error) {
                        console.error(
                            `Error loading profile for ${authorId}:`,
                            error,
                        );
                        return {
                            authorId,
                            profile: null,
                        };
                    }
                });

                const profiles = await Promise.all(profilePromises);
                const profileMap = new Map(
                    profiles.map((p) => [p.authorId, p.profile]),
                );

                // Combine posts with details
                const postsWithDetails: PostWithDetails[] = communityPosts.map(
                    (post) => ({
                        ...post,
                        authorProfile: profileMap.get(post.authorId) ?? null,
                        community: communityData,
                        commentProfiles: post.comments.reduce<
                            Record<string, ProfileSummary>
                        >((acc, comment) => {
                            acc[comment.authorId] =
                                profileMap.get(comment.authorId) ?? null;
                            return acc;
                        }, {}),
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
                console.error("Error loading community:", err);
                setError("Failed to load community data");
            } finally {
                setLoading(false);
            }
        };

        if (communityId) loadData();
    }, [communityId]);

    return {
        community,
        posts,
        ownerProfile,
        currentUserId,
        canCreatePost,
        loading,
        error,
    };
}
