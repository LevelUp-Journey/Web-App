"use client";

import { useState } from "react";
import { ChallengesPageSection } from "@/components/challenges/challenges-page-section";
import { SearchInput } from "@/components/searching/search-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ChallengesPage() {
    const [challengesCount, setChallengesCount] = useState<number | null>(null);

    return (
        <div className="container mx-auto px-4 pt-16 pb-8 space-y-6">
            {/* Inspirational Header */}
            <div className="text-center max-w-4xl mx-auto mb-12">
                <h1 className="text-4xl text-balance md:text-5xl font-medium text-foreground mb-6 leading-tight">
                    Start coding with purpose
                </h1>
                <p className="text-base text-pretty md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    Level Up Journey is the learning platform for UPC students
                    beginning their career path. Tackle real C++ challenges
                    designed by your professors — each crafted to guide you from
                    fundamentals to fluency. Learn by solving, level up.
                </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center">
                <SearchInput />
            </div>

            {/* Filters */}
            <div className="flex justify-center gap-4 flex-wrap">
                <Select>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="c++">C++</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Popularity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="most-popular">
                            Most Popular
                        </SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="least-popular">
                            Least Popular
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Recentness" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="recently-updated">
                            Recently Updated
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Header Section */}
            <header className="space-y-2">
                <h2 className="text-3xl font-medium tracking-tight">
                    Coding Challenges
                </h2>
                {challengesCount !== null && (
                    <p className="text-base text-muted-foreground">
                        {challengesCount}{" "}
                        {challengesCount === 1 ? "result" : "results"}
                    </p>
                )}
            </header>

            {/* Challenges Grid */}
            <ChallengesPageSection onCountChange={setChallengesCount} />
        </div>
    );
}
