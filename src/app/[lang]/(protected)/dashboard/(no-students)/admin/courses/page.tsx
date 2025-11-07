"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
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
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";

export default function AdminCoursesPage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const PATHS = useLocalizedPaths();

    useEffect(() => {
        const checkPermissionsAndLoad = async () => {
            try {
                const roles = await AuthController.getUserRoles();
                const role = roles.find(
                    (r) => r === "ROLE_TEACHER" || r === "ROLE_ADMIN",
                );
                setUserRole(role || null);

                if (role) {
                    const courseList = await CourseController.getCourses();
                    setCourses(courseList as Course[]);
                }
            } catch (err) {
                console.error("Error loading courses:", err);
                setError("We couldn't load the courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        checkPermissionsAndLoad();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="space-y-4">
                <Empty className="min-h-[400px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Spinner className="size-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>Loading courses</EmptyTitle>
                        <EmptyDescription>
                            Checking your permissions and fetching the catalog.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        );
    }

    // No permissions
    if (!userRole) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>Access denied</EmptyTitle>
                    <EmptyDescription>
                        You need teacher or admin permissions to manage courses.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    // Main content
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Courses</h2>
                <Button asChild>
                    <Link href={PATHS.DASHBOARD.ADMINISTRATION.COURSES.CREATE}>
                        Create Course
                    </Link>
                </Button>
            </div>

            {error ? (
                <Empty className="min-h-[300px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>Unable to load courses</EmptyTitle>
                        <EmptyDescription>{error}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : courses.length === 0 ? (
                <Empty className="min-h-[300px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>No courses yet</EmptyTitle>
                        <EmptyDescription>
                            Create your first course to populate the catalog.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button asChild>
                            <Link href={PATHS.DASHBOARD.ADMINISTRATION.COURSES.CREATE}>
                                Create Course
                            </Link>
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} adminMode />
                    ))}
                </div>
            )}
        </div>
    );
}
