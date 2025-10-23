import { useEffect, useState } from "react";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { UserRole } from "@/lib/consts";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";

interface PostWithDetails extends Post {
    authorProfile?: {
        username: string;
        profileUrl?: string;
        firstName?: string;
        lastName?: string;
    };
    community?: Community;
}

export function useCommunityData(communityId: string) {
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [ownerProfile, setOwnerProfile] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [canCreatePost, setCanCreatePost] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [userId, userRoles, communityData, allPosts] = await Promise.all([
                    AuthController.getUserId(),
                    AuthController.getUserRoles(),
                    CommunityController.getCommunityById(communityId),
                    PostController.getAllPosts()
                ]);

                setCurrentUserId(userId);
                
                // Check if user can create posts (only TEACHER and ADMIN)
                const hasCreatePermission = userRoles.includes(UserRole.TEACHER) || userRoles.includes(UserRole.ADMIN);
                setCanCreatePost(hasCreatePermission);
                
                setCommunity(communityData);

                const profile = await ProfileController.getProfileByUserId(communityData.ownerId);
                setOwnerProfile(profile);

                const communityPosts = allPosts.filter(post => post.communityId === communityId);

                // Get unique author IDs
                const authorIds = [...new Set(communityPosts.map(p => p.authorId))];

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
                const postsWithDetails: PostWithDetails[] = communityPosts.map(post => ({
                    ...post,
                    authorProfile: profileMap.get(post.authorId),
                    community: communityData,
                }));

                // Sort by creation date (newest first)
                postsWithDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setPosts(postsWithDetails);
            } catch (err) {
                console.error("Error loading community:", err);
            } finally {
                setLoading(false);
            }
        };

        if (communityId) loadData();
    }, [communityId]);

    return { community, posts, ownerProfile, currentUserId, canCreatePost, loading };
}