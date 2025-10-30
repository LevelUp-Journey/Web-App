import { useEffect, useState } from "react";
import { UserRole } from "@/lib/consts";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

export function useCreatePostData() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [authorId, setAuthorId] = useState<string>("");
    const [usernames, setUsernames] = useState<Record<string, string>>({});
    const [canCreatePost, setCanCreatePost] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Get current user ID and roles
                const [userId, userRoles] = await Promise.all([
                    AuthController.getUserId(),
                    AuthController.getUserRoles(),
                ]);
                
                setAuthorId(userId);

                // Check if user can create posts (only TEACHER and ADMIN)
                const hasCreatePermission =
                    userRoles.includes(UserRole.TEACHER) ||
                    userRoles.includes(UserRole.ADMIN);
                setCanCreatePost(hasCreatePermission);

                // Get all communities
                const allCommunities =
                    await CommunityController.getCommunities();
                setCommunities(allCommunities);

                // Load usernames for community owners
                const usernameMap: Record<string, string> = {};
                await Promise.all(
                    allCommunities.map(async (community) => {
                        try {
                            const profile =
                                await ProfileController.getProfileById(
                                    community.ownerProfileId,
                                );
                            usernameMap[community.ownerId] = profile.username;
                        } catch (error) {
                            console.error(
                                `Error loading profile for ${community.ownerProfileId}:`,
                                error,
                            );
                            usernameMap[community.ownerId] = "Unknown User";
                        }
                    }),
                );
                setUsernames(usernameMap);
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load communities");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { communities, authorId, usernames, canCreatePost, loading, error };
}
