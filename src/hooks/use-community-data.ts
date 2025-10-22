import { useEffect, useState } from "react";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { PostController } from "@/services/internal/community/controller/post.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import type { Post } from "@/services/internal/community/entities/post.entity";

export function useCommunityData(communityId: string) {
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [ownerProfile, setOwnerProfile] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [userId, communityData, allPosts] = await Promise.all([
                    AuthController.getUserId(),
                    CommunityController.getCommunityById(communityId),
                    PostController.getAllPosts()
                ]);

                setCurrentUserId(userId);
                setCommunity(communityData);

                const profile = await ProfileController.getProfileByUserId(communityData.ownerId);
                setOwnerProfile(profile);

                const communityPosts = allPosts.filter(post => post.communityId === communityId);
                setPosts(communityPosts);
            } catch (err) {
                console.error("Error loading community:", err);
            } finally {
                setLoading(false);
            }
        };

        if (communityId) loadData();
    }, [communityId]);

    return { community, posts, ownerProfile, currentUserId, loading };
}