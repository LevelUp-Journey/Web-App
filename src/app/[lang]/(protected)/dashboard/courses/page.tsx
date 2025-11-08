"use client";

import { AlertCircle, BookOpen, GraduationCap, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "@/components/cards/course-card";
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
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";

export default function AdminCoursesPage() {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const PATHS = useLocalizedPaths();

    useEffect(() => {
        const checkPermissionsAndLoad = async () => {
            try {
                const courseList = await CourseController.getCourses();
                setCourses(courseList as Course[]);
            } catch (err) {
                console.error("Error loading courses:", err);
                setError("Error loading courses");
            } finally {
                setLoading(false);
            }
        };

        checkPermissionsAndLoad();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8">
                <header className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            My Courses
                        </h1>
                    </div>
                </header>

                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Spinner className="size-8 mb-4" />
                    <p className="text-muted-foreground">Loading courses...</p>
                </div>
            </div>
        );
    }

    // Main content
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header Section */}
            <header className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                My Courses
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Manage and review your {courses.length} active
                                courses
                            </p>
                        </div>
                    </div>

                    <Button asChild>
                        <Link
                            href={PATHS.DASHBOARD.ADMINISTRATION.COURSES.CREATE}
                        >
                            Create Course
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Courses Grid */}
            {error ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>Error fetching courses</EmptyTitle>
                        <EmptyDescription>{error}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retry
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : courses.length > 0 ? (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </section>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <GraduationCap className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        No courses available
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Start by creating your first course to share your
                        knowledge with students.
                    </p>
                </div>
            )}
        </div>
    );
}
