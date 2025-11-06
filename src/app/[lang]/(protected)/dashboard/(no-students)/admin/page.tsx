"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import ChallengeCard from "@/components/cards/challenge-card";
import CourseCard from "@/components/cards/course-card";
import GuideCard from "@/components/cards/guide-card";
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
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

export default function AdminPage() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [guides, setGuides] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(false);

            const userId = await AuthController.getUserId();

            const [challengesData, guidesData, coursesData] = await Promise.all([
                ChallengeController.getChallengesByTeacherId(userId),
                GuideController.getAllGuides(),
                CourseController.getCourses(),
            ]);

            setChallenges(challengesData);
            setGuides(guidesData);
            setCourses(coursesData);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Spinner className="size-8 mb-4" />
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>Error loading dashboard</EmptyTitle>
                    <EmptyDescription>
                        Could not load admin dashboard data. Please try again.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={loadData} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    // Ordenar cada tipo por fecha de actualización (más reciente primero)
    const sortByUpdated = (arr: any[]) =>
        arr.sort(
            (a, b) =>
                new Date(b.updatedAt ?? 0).getTime() -
                new Date(a.updatedAt ?? 0).getTime(),
        );

    const sortedChallenges = sortByUpdated([...challenges]);
    const sortedGuides = sortByUpdated([...guides]);
    const sortedCourses = sortByUpdated([...courses]);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold tracking-tight">
                Admin Dashboard — Recent Activity
            </h2>

            {/* Challenges Row */}
            <section className="space-y-3">
                <h3 className="text-lg font-semibold">Challenges</h3>
                {sortedChallenges.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No challenges found.
                    </p>
                ) : (
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                        {sortedChallenges.map((challenge: any) => (
                            <div
                                key={challenge.id}
                                className="min-w-[340px] flex-shrink-0"
                            >
                                <ChallengeCard
                                    challenge={challenge}
                                    codeVersions={challenge.codeVersions ?? []}
                                    adminMode={true}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Guides Row */}
            <section className="space-y-3">
                <h3 className="text-lg font-semibold">Guides</h3>
                {sortedGuides.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No guides found.
                    </p>
                ) : (
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                        {sortedGuides.map((guide: any) => (
                            <div
                                key={guide.id}
                                className="min-w-[340px] flex-shrink-0"
                            >
                                <GuideCard guide={guide} adminMode={true} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Courses Row */}
            <section className="space-y-3">
                <h3 className="text-lg font-semibold">Courses</h3>
                {sortedCourses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No courses found.
                    </p>
                ) : (
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                        {sortedCourses.map((course: any) => (
                            <div
                                key={course.id}
                                className="min-w-[340px] flex-shrink-0"
                            >
                                <CourseCard course={course} adminMode={true} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
