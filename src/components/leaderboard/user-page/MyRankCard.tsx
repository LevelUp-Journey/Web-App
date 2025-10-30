"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CompetitiveController } from "@/services/internal/profiles/competitive/controller/competitive.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { CompetitiveProfile } from "@/services/internal/profiles/competitive/entities/competitive-profile.entity";

const RANK_ICONS: Record<string, string> = {
    BRONZE: "/ranks-trophies/trophy-bronze.svg",
    SILVER: "/ranks-trophies/trophy-silver.svg",
    GOLD: "/ranks-trophies/trophy-gold.svg",
    PLATINUM: "/ranks-trophies/trophy-platinum.svg",
    DIAMOND: "/ranks-trophies/trophy-diamond.svg",
    MASTER: "/ranks-trophies/trophy-master.svg",
    GRANDMASTER: "/ranks-trophies/trophy-grandmaster.svg",
};

function rankDescription(rank: string) {
    switch (rank) {
        case "BRONZE":
            return (
                "The Bronze rank marks the beginning of your coding journey. As a dedicated learner, you're building foundational skills and tackling your first challenges with enthusiasm."
            );
        case "SILVER":
            return (
                "Silver-ranked coders demonstrate growing proficiency. You've mastered basic concepts and are now solving more complex problems with increasing confidence and efficiency."
            );
        case "GOLD":
            return (
                "Gold rank signifies advanced coding abilities. You consistently deliver solid solutions, understand algorithmic principles, and are ready for more challenging technical puzzles."
            );
        case "PLATINUM":
            return (
                "Platinum coders excel in problem-solving and code quality. Your solutions are not only correct but optimized, showing deep understanding of data structures and algorithms."
            );
        case "DIAMOND":
            return (
                "An elite problem-solver. Diamond-ranked coders consistently deliver high-quality solutions and deep algorithmic knowledge."
            );
        case "MASTER":
            return (
                "A true architect of logic and precision. The Master Coder has conquered every challenge with elegance and consistency, demonstrating not just technical skill but creative problem-solving and deep understanding of algorithms."
            );
        case "GRANDMASTER":
            return (
                "A rare virtuoso — Grandmaster developers lead innovations, solve the hardest problems and inspire the community with creative, reliable solutions."
            );
        default:
            return (
                "A dedicated coder steadily climbing the ranks. Keep solving challenges to unlock the next tier and climb the leaderboard."
            );
    }
}

export default function MyRankCard() {
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

                const data = await CompetitiveController.getCompetitiveProfile(userId);
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
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!profile) {
        return <div className="text-center py-8">No rank information available</div>;
    }

    const icon = RANK_ICONS[profile.currentRank] || RANK_ICONS.BRONZE;

    return (
        <div className="max-w-md mx-auto">
            <Card className="bg-muted/20">
                <CardContent className="flex flex-col items-center gap-6 py-8">
                    <div className="text-2xl text-muted-foreground">My Current Rank</div>

                    <img
                        src={icon}
                        alt={profile.currentRank}
                        className="w-36 h-36 object-contain drop-shadow-[0_20px_40px_rgba(255,255,255,0.5)]"
                    />

                    <div className="text-2xl font-bold tracking-wide text-center">{profile.currentRank}</div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path d="M12 2l2.39 4.85L19 8.25l-3.5 3.42L16.18 18 12 15.27 7.82 18l.68-6.33L4.99 8.25l4.61-.4L12 2z" />
                        </svg>
                        <div className="font-semibold">{profile.totalPoints.toLocaleString()}</div>

                        {typeof profile.leaderboardPosition !== "undefined" && (
                            <div className="text-muted-foreground">• #{profile.leaderboardPosition}</div>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground max-w-[46ch] text-center">{rankDescription(profile.currentRank)}</p>
                </CardContent>
            </Card>
        </div>
    );
}
