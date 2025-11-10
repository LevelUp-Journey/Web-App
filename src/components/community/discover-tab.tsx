"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import CommunityCard from "@/components/cards/community-card";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { CommunityController } from "@/services/internal/community/controller/community.controller";
import type { Community } from "@/services/internal/community/entities/community.entity";

export function DiscoverTab() {
    const [loading, setLoading] = useState(true);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCommunities = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await CommunityController.getCommunities();

                if (response) {
                    setCommunities(response);
                } else {
                    setError("We couldn't load the communities.");
                }
            } catch (err) {
                console.error("Error loading communities:", err);
                setError("We couldn't load the communities. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadCommunities();
    }, []);

    if (loading) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Spinner className="size-6 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>Loading communities</EmptyTitle>
                    <EmptyDescription>
                        Discovering communities for you...
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    if (error) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>Error loading communities</EmptyTitle>
                    <EmptyDescription>{error}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    if (communities.length === 0) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>No communities yet</EmptyTitle>
                    <EmptyDescription>
                        Be the first to create a community!
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Discover Communities</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Explore and join communities that match your interests
                </p>
            </div>

            {/* Communities Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {communities.map((community) => (
                    <CommunityCard key={community.id} community={community} />
                ))}
            </div>
        </div>
    );
}
