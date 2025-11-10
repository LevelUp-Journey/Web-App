"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { CompetitiveController } from "@/services/internal/profiles/competitive/controller/competitive.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { CompetitiveProfile } from "@/services/internal/profiles/competitive/entities/competitive-profile.entity";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const RANK_ICONS: Record<string, string> = {
    BRONZE: "/ranks-trophies/trophy-bronze.svg",
    SILVER: "/ranks-trophies/trophy-silver.svg",
    GOLD: "/ranks-trophies/trophy-gold.svg",
    PLATINUM: "/ranks-trophies/trophy-platinum.svg",
    DIAMOND: "/ranks-trophies/trophy-diamond.svg",
    MASTER: "/ranks-trophies/trophy-master.svg",
    GRANDMASTER: "/ranks-trophies/trophy-grandmaster.svg",
};

function rankDescription(rank: string, dict: Dictionary) {
    const rankKey = rank.toLowerCase() as keyof typeof dict.leaderboard.ranks;
    return (
        dict.leaderboard.ranks[rankKey]?.description ||
        dict.leaderboard.ranks.bronze.description
    );
}

export default function MyRankCard({ dict }: { dict: Dictionary }) {
    const [profile, setProfile] = useState<CompetitiveProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const userId = await AuthController.getUserId();
                if (!userId) {
                    setProfile(null);
                    return;
                }

                const data =
                    await CompetitiveController.getCompetitiveProfile(userId);
                setProfile(data);
            } catch (error) {
                console.error("Failed to load competitive profile:", error);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner className="size-8 mb-4" />
                <p className="text-muted-foreground">
                    {dict.leaderboard.loading.rank}
                </p>
            </div>
        );
    }

    if (!profile) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>{dict.leaderboard.empty.noRankInfo}</EmptyTitle>
                    <EmptyDescription>
                        {dict.leaderboard.empty.loadError}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {dict.leaderboard.ui.retry}
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    const icon = RANK_ICONS[profile.currentRank] || RANK_ICONS.BRONZE;

    return (
        <div className="max-w-md mx-auto">
            <Card className="bg-transparent border-none">
                <CardContent className="flex flex-col items-center gap-6 py-8">
                    <div className="text-2xl text-muted-foreground">
                        {dict.leaderboard.ui.myCurrentRank}
                    </div>

                    <Image
                        src={icon}
                        alt={profile.currentRank}
                        width={144}
                        height={144}
                        className="w-36 h-36 object-contain"
                        unoptimized
                    />

                    <div className="text-2xl font-bold tracking-wide text-center">
                        {profile.currentRank}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path d="M12 2l2.39 4.85L19 8.25l-3.5 3.42L16.18 18 12 15.27 7.82 18l.68-6.33L4.99 8.25l4.61-.4L12 2z" />
                        </svg>
                        <div className="font-semibold">
                            {profile.totalPoints.toLocaleString()}
                        </div>

                        {typeof profile.leaderboardPosition !== "undefined" && (
                            <div className="text-muted-foreground">
                                • #{profile.leaderboardPosition}
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground max-w-[46ch] text-center">
                        {rankDescription(profile.currentRank, dict)}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
