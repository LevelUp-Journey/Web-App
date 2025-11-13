"use client";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import MyRankCard from "@/components/leaderboard/user-page/MyRankCard";

export function MyRankContent({ dict }: { dict: Dictionary }) {
    return (
        <div className="py-4">
            <MyRankCard dict={dict} />
        </div>
    );
}
