import { useEffect, useState } from "react";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";

export function useCreatePostData() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [authorId, setAuthorId] = useState<string>("");
    const [usernames, setUsernames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Get current user ID
                const userId = await AuthController.getUserId();
                setAuthorId(userId);

                // Get all communities
                const allCommunities = await CommunityController.getCommunities();
                setCommunities(allCommunities);

                // Load usernames for community owners
                const usernameMap: Record<string, string> = {};
                await Promise.all(
                    allCommunities.map(async (community) => {
                        try {
                            const profile = await ProfileController.getProfileByUserId(community.ownerId);
                            usernameMap[community.ownerId] = profile.username;
                        } catch (error) {
                            console.error(`Error loading profile for ${community.ownerId}:`, error);
                            usernameMap[community.ownerId] = "Unknown User";
                        }
                    })
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

    return { communities, authorId, usernames, loading, error };
}