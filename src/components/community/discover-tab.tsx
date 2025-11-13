"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { Community } from "@/services/internal/community/entities/community.entity";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import CommunityCard from "./community-card";

export function DiscoverTab() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                setLoading(true);
                const data = await CommunityController.getCommunities();
                setCommunities(data);
                setError(null);
            } catch (err) {
                console.error("Error loading communities:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load communities",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Spinner className="size-8" />
                <p className="text-sm text-muted-foreground">
                    Loading communities...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-8 text-center space-y-4">
                    <p className="font-semibold text-destructive">
                        Failed to load communities
                    </p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (communities.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center space-y-2">
                    <p className="font-semibold">No communities found</p>
                    <p className="text-sm text-muted-foreground">
                        Be the first to create a community!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Discover Communities</h2>
                <p className="text-sm text-muted-foreground">
                    Explore all available communities and find your interests
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                    <CommunityCard key={community.id} community={community} />
                ))}
            </div>
        </div>
    );
}
