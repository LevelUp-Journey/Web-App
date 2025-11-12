import { useCallback, useEffect, useState } from "react";
import { UserRole } from "@/lib/consts";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { SubscriptionController } from "@/services/internal/community/controller/subscription.controller";
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
    const [canModerate, setCanModerate] = useState<boolean>(false);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followId, setFollowId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloading, setReloading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const PAGE_SIZE = 20;

    const buildPostsWithDetails = useCallback(
        async (
            communityPosts: Post[],
            communityData: Community,
        ): Promise<PostWithDetails[]> => {
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
                        await ProfileController.getProfileByUserId(authorId);
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

            // Combine posts with details (community already comes in post from API)
            const postsWithDetails: PostWithDetails[] = communityPosts.map(
                (post) => ({
                    ...post,
                    authorProfile: profileMap.get(post.authorId) ?? null,
                    commentProfiles: post.comments.reduce<
                        Record<string, ProfileSummary>
                    >((acc, comment) => {
                        acc[comment.authorId] =
                            profileMap.get(comment.authorId) ?? null;
                        return acc;
                    }, {}),
                }),
            );

            postsWithDetails.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );

            return postsWithDetails;
        },
        [],
    );

    const loadData = useCallback(
        async (options?: { silent?: boolean }) => {
            if (!communityId) return;
            try {
                if (options?.silent) {
                    setReloading(true);
                } else {
                    setLoading(true);
                }
                setError(null);

                // Fetch community and posts (first page) in parallel
                const [userId, userRoles, communityData, postsData] =
                    await Promise.all([
                        AuthController.getUserId(),
                        AuthController.getUserRoles(),
                        CommunityController.getCommunityById(communityId),
                        PostController.getPostsByCommunityId(communityId, 0, PAGE_SIZE),
                    ]);

                setCurrentUserId(userId);
                setCurrentPage(0);
                setHasMore(postsData.hasNext); // Use hasNext from backend

                // Check subscription status
                const userSubscription =
                    await SubscriptionController.getUserSubscriptionForCommunity(
                        communityId,
                        userId,
                    );
                setIsFollowing(!!userSubscription);
                setFollowId(userSubscription?.id ?? null);

                // Check if user can create posts (only TEACHER and ADMIN)
                const hasCreatePermission =
                    userRoles.includes(UserRole.TEACHER) ||
                    userRoles.includes(UserRole.ADMIN);
                setCanCreatePost(hasCreatePermission);

                // Check if user can moderate (delete posts, etc.) - TEACHER and ADMIN
                const canModerateContent =
                    userRoles.includes(UserRole.TEACHER) ||
                    userRoles.includes(UserRole.ADMIN);
                setCanModerate(canModerateContent);

                setCommunity(communityData);

                // Fetch owner profile
                const profile = await ProfileController.getProfileByUserId(
                    communityData.ownerId,
                );
                setOwnerProfile(profile ?? null);

                const postsWithDetails = await buildPostsWithDetails(
                    postsData.posts,
                    communityData,
                );
                
                // Backend includes reactions in posts response
                setPosts(postsWithDetails);
            } catch (err) {
                console.error("Error loading community:", err);
                setError("Failed to load community data");
            } finally {
                if (options?.silent) {
                    setReloading(false);
                } else {
                    setLoading(false);
                }
            }
        },
        [buildPostsWithDetails, communityId, PAGE_SIZE],
    );

    const loadMore = useCallback(async () => {
        if (!communityId || loadingMore || !hasMore || !community) return;

        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;

            const postsData = await PostController.getPostsByCommunityId(
                communityId,
                nextPage,
                PAGE_SIZE,
            );

            // Use hasNext from backend instead of inferring
            setHasMore(postsData.hasNext);
            setCurrentPage(nextPage);

            // Build details for new posts
            const newPostsWithDetails = await buildPostsWithDetails(
                postsData.posts,
                community,
            );

            // Append to existing posts
            setPosts((prevPosts) => [...prevPosts, ...newPostsWithDetails]);
        } catch (err) {
            console.error("Error loading more posts:", err);
        } finally {
            setLoadingMore(false);
        }
    }, [
        communityId,
        loadingMore,
        hasMore,
        community,
        currentPage,
        PAGE_SIZE,
        buildPostsWithDetails,
    ]);

    useEffect(() => {
        if (communityId) {
            loadData();
        }
    }, [communityId, loadData]);

    return {
        community,
        posts,
        ownerProfile,
        currentUserId,
        canCreatePost,
        canModerate,
        isFollowing,
        followId,
        loading,
        error,
        reloading,
        reload: loadData,
        loadMore,
        hasMore,
        loadingMore,
    };
}
