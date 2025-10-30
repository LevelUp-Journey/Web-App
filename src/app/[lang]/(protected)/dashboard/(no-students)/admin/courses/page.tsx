"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "@/components/cards/course-card";
import { Button } from "@/components/ui/button";
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
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Courses</h2>
                </div>
                <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // No permissions
    if (!userRole) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Courses</h2>
                </div>
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-semibold">Access Denied</h1>
                    <p className="text-muted-foreground">
                        You don't have permission to view courses.
                    </p>
                </div>
            </div>
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
                <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                    <p>{error}</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                    <p>No courses created yet</p>
                </div>
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
