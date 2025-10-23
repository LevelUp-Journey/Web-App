"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { CommunityCard } from "@/components/community/community-card";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { UserRole } from "@/lib/consts";
import type { Community } from "@/services/internal/community/entities/community.entity";

export default function MyCommunitiesPage() {
    const router = useRouter();
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [usernames, setUsernames] = useState<Record<string, string>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [canCreateCommunity, setCanCreateCommunity] =
        useState<boolean>(false);

    useEffect(() => {
        loadUserCommunities();
    }, []);

    const loadUserCommunities = async () => {
        try {
            setLoading(true);
            const [userId, userRoles] = await Promise.all([
                AuthController.getUserId(),
                AuthController.getUserRoles(),
            ]);

            // Check if user can create communities (only TEACHER and ADMIN)
            const hasCreatePermission =
                userRoles.includes(UserRole.TEACHER) ||
                userRoles.includes(UserRole.ADMIN);
            setCanCreateCommunity(hasCreatePermission);

            const allCommunities = await CommunityController.getCommunities();

            // Filtrar solo las comunidades del usuario actual
            const userCommunities = allCommunities.filter(
                (community) => community.ownerId === userId,
            );

            // Cargar usernames para cada comunidad
            const usernameMap: Record<string, string> = {};
            await Promise.all(
                userCommunities.map(async (community) => {
                    try {
                        const profile = await ProfileController.getProfileById(
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
            setCommunities(userCommunities);
        } catch (error) {
            console.error("Error loading communities:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar comunidades basado en el término de búsqueda
    const filteredCommunities = useMemo(() => {
        if (!searchTerm.trim()) return communities;

        return communities.filter(
            (community) =>
                community.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                community.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
        );
    }, [communities, searchTerm]);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">
                        Loading communities...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            {/* Search Bar - Centered */}
            <div className="flex justify-center pt-4">
                <div className="relative max-w-md w-full">
                    <InputGroup>
                        <InputGroupInput
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton>Search</InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </div>

            {/* Communities List */}
            <div className="container mx-auto p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">My Communities</h2>
                    {canCreateCommunity && (
                        <Button
                            onClick={() =>
                                router.push("/dashboard/community/create")
                            }
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Community
                        </Button>
                    )}
                </div>

                {filteredCommunities.length === 0 && communities.length > 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-8">
                        <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">
                            No communities found
                        </h2>
                        <p className="text-muted-foreground text-center mb-4 max-w-md">
                            No communities match your search. Try different
                            keywords.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setSearchTerm("")}
                        >
                            Clear Search
                        </Button>
                    </div>
                ) : filteredCommunities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-8">
                        <Users className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">
                            No communities yet
                        </h2>
                        <p className="text-muted-foreground text-center mb-4 max-w-md">
                            Create your first community to start building your
                            network and sharing content
                        </p>
                        {canCreateCommunity && (
                            <Button
                                onClick={() =>
                                    router.push("/dashboard/community/create")
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Community
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCommunities.map((community) => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                                username={usernames[community.ownerId]}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
