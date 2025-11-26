import { useCallback, useEffect, useState } from "react";
import { UserRole } from "@/lib/consts";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { SubscriptionController } from "@/services/internal/community/controller/subscription.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { UserController } from "@/services/internal/users/controller/user.controller";
import type { UserResponse } from "@/services/internal/users/controller/user.response";

// PostWithDetails is now just an alias since posts come with author info from backend
interface PostWithDetails extends Post {}

export function useCommunityData(communityId: string) {
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [ownerProfile, setOwnerProfile] = useState<UserResponse | null>(null);
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
                        PostController.getPostsByCommunityId(
                            communityId,
                            0,
                            PAGE_SIZE,
                        ),
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
                const profile = await UserController.getUserById(
                    communityData.ownerId,
                );
                setOwnerProfile(profile ?? null);

                // Posts now come with author data from backend (authorName, authorProfileUrl)
                // No need to fetch profiles separately! 🎉
                setPosts(postsData.posts);
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
        [communityId],
    );

    const loadMore = useCallback(async () => {
        if (!communityId || loadingMore || !hasMore) return;

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

            // Posts come with author data, just append them
            setPosts((prevPosts) => [...prevPosts, ...postsData.posts]);
        } catch (err) {
            console.error("Error loading more posts:", err);
        } finally {
            setLoadingMore(false);
        }
    }, [communityId, loadingMore, hasMore, currentPage]);

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
