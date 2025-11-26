import { useCallback, useEffect, useState } from "react";
import { UserRole } from "@/lib/consts";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { SubscriptionController } from "@/services/internal/community/controller/subscription.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post, PostsListResponse } from "@/services/internal/community/entities/post.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { UserController } from "@/services/internal/users/controller/user.controller";
import type { UserResponse } from "@/services/internal/users/controller/user.response";

// Posts now come with basic info, author data loaded separately
type PostWithDetails = Post;

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
                const [userId, userRoles, communityData] = await Promise.all([
                    AuthController.getUserId(),
                    AuthController.getUserRoles(),
                    CommunityController.getCommunityById(communityId),
                ]);

                // Fetch posts separately to handle errors gracefully
                let postsData: PostsListResponse;
                try {
                    postsData = await PostController.getPostsByCommunityId(
                        communityId,
                        0,
                        PAGE_SIZE,
                    );
                } catch (postsError) {
                    console.error("Failed to load posts:", postsError);
                    postsData = {
                        posts: [],
                        total: 0,
                        page: 0,
                        limit: PAGE_SIZE,
                        totalPages: 0,
                    };
                }

                setCurrentUserId(userId);
                setCurrentPage(0);
                setHasMore(postsData.page < postsData.totalPages - 1); // Check if there are more pages

                // Check subscription status
                const userSubscription =
                    await SubscriptionController.getUserSubscriptionForCommunity(
                        communityId,
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
                nextPage * PAGE_SIZE, // offset = page * limit
                PAGE_SIZE,
            );

            // Check if there are more pages
            setHasMore(postsData.page < postsData.totalPages - 1);
            setCurrentPage(nextPage);

            // Posts come with author data, just append them
            setPosts((prevPosts) => [...prevPosts, ...postsData.posts]);
        } catch (err) {
            console.error("Error loading more posts:", err);
            // Don't show error to user for load more failures, just stop loading
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
        posts: posts || [],
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
