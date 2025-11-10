"use client";

import React from "react";
import MyRankCard from "@/components/leaderboard/user-page/MyRankCard";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export function MyRankContent({ dict }: { dict: Dictionary }) {
    return (
        <div className="py-4">
            <MyRankCard dict={dict} />
        </div>
    );
}
