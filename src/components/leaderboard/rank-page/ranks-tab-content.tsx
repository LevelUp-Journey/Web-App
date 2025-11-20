"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Spinner } from "@/components/ui/spinner";
import { RankingIntro } from "./ranking-intro";
import { RanksByScore } from "./ranks-by-score";
import { ScoringSystemInfo } from "./scoring-system-info";

export function RanksTabContent({ dict }: { dict: Dictionary }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner className="size-8" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <RankingIntro dict={dict} />
            <RanksByScore dict={dict} />
            <ScoringSystemInfo dict={dict} />
        </div>
    );
}
