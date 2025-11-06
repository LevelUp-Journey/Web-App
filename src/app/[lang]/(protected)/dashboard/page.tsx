"use client";

import { ChallengesSection } from "@/components/dashboard/challenges-section";
import UniversityAnnouncements from "@/components/dashboard/university-announcements";
import { useState } from "react";

export default function DashboardPage() {
    const [challengesCount, setChallengesCount] = useState<number | null>(null);

    return (
        <div className="space-y-4 w-full container mx-auto pt-4">
            {/* Carousel - Full Width */}
            <UniversityAnnouncements />

            <div className="container mx-auto p-4 space-y-4">
                <h2 className="text-2xl font-semibold">Challenges</h2>
                {challengesCount !== null && (
                    <p className="text-sm text-muted-foreground">
                        {challengesCount} {challengesCount === 1 ? 'result' : 'results'}
                    </p>
                )}
                <ChallengesSection onCountChange={setChallengesCount} />
            </div>
        </div>
    );
}
