"use client";

import { ChallengesSection } from "@/components/dashboard/challenges-section";
import { Button } from "@/components/ui/button";
import UniversityAnnouncements from "@/components/dashboard/university-announcements";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Announcements */}
            <UniversityAnnouncements />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Left Column - Up Next and Featured Challenges */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Up Next Card */}
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Up Next</h3>
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <div className="flex items-start gap-6 h-full">
                                <Image
                                    src="/cat-walking.svg"
                                    alt="Cat walking"
                                    width={200}
                                    height={200}
                                    className="shrink-0"
                                />
                                <div className="flex-1 flex flex-col justify-between h-full min-h-[200px]">
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold mb-3">Plan your learning journey</h4>
                                        <p className="text-muted-foreground text-base leading-relaxed">
                                            Explore guided learning paths and curated courses designed for UPC students.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <Link href="/dashboard/guides">
                                            <Button size="lg" className="px-6 py-3">Explore Guides</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Challenges Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Featured Challenges</h2>
                        <ChallengesSection />
                    </div>
                </div>

                {/* Right Column - Streak and Progress */}
                <div className="space-y-6">
                    {/* Streak Card */}
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Streak</h3>
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <div className="text-center text-muted-foreground/75">
                                <p className="text-lg font-medium">Coming Soon</p>
                                <p className="text-sm mt-2">Track your coding consistency</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <div className="text-center text-muted-foreground/75">
                            <h3 className="text-xl font-semibold mb-4 text-foreground">Progress</h3>
                            <p className="text-lg font-medium">Coming Soon</p>
                            <p className="text-sm mt-2">Track your learning progress and achievements</p>
                        </div>
                    </div>

                    {/* Achievements Card */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <div className="text-center text-muted-foreground/75">
                            <h3 className="text-xl font-semibold mb-4 text-foreground">Achievements</h3>
                            <p className="text-lg font-medium">Coming Soon</p>
                            <p className="text-sm mt-2">Unlock badges and rewards for your progress</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
