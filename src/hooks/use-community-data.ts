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
    const [users, setUsers] = useState<Map<string, UserResponse>>(new Map());
    const [ownerProfile, setOwnerProfile] = useState<UserResponse | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [canCreatePost, setCanCreatePost] = useState<boolean>(false);
    const [canModerate, setCanModerate] = useState<boolean>(false);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followerCount, setFollowerCount] = useState<number>(0);
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

                // Check subscription status and load follower count in parallel
                const [userSubscription, subscriptionCount] = await Promise.all([
                    SubscriptionController.getUserSubscriptionForCommunity(
                        userId,
                        communityId,
                    ),
                    SubscriptionController.getSubscriptionCount(communityId).catch(() => ({
                        community_id: communityId,
                        count: 0,
                    })),
                ]);

                setIsFollowing(!!userSubscription);
                setFollowerCount(subscriptionCount.count);

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

                // Load all unique authors in parallel for better performance
                const uniqueAuthorIds = [...new Set(postsData.posts.map(post => post.authorId))];
                if (uniqueAuthorIds.length > 0) {
                    try {
                        const userPromises = uniqueAuthorIds.map(authorId =>
                            UserController.getUserById(authorId).catch(err => {
                                console.warn(`Failed to load user ${authorId}:`, err);
                                return null;
                            })
                        );
                        const usersData = await Promise.all(userPromises);
                        const usersMap = new Map<string, UserResponse>();
                        uniqueAuthorIds.forEach((authorId, index) => {
                            const user = usersData[index];
                            if (user) {
                                usersMap.set(authorId, user);
                            }
                        });
                        setUsers(usersMap);
                    } catch (usersError) {
                        console.error("Error loading users:", usersError);
                        // Continue without users data
                    }
                }
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
        users,
        ownerProfile,
        currentUserId,
        canCreatePost,
        canModerate,
        isFollowing,
        followerCount,
        loading,
        error,
        reloading,
        reload: loadData,
        loadMore,
        hasMore,
        loadingMore,
    };
}
