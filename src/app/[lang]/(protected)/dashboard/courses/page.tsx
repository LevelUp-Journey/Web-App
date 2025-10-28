"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CourseController } from "@/services/internal/learning/controller/course.controller";
import type { CourseResponse } from "@/services/internal/learning/controller/course.response";

export default function CoursesPage() {
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const PATHS = useLocalizedPaths();

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const courseList = await CourseController.getList({
                    status: "PUBLISHED",
                });
                setCourses(courseList.data);
            } catch (error) {
                console.error("Error loading courses:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    if (loading) {
        return <div>Loading courses...</div>;
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Available Courses</h1>
            {courses.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        No courses available yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card key={course.id}>
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                                <CardDescription>
                                    {course.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Difficulty: {course.difficulty}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Guides: {course.totalGuides}
                                    </p>
                                    <Button asChild className="w-full">
                                        <Link
                                            href={PATHS.DASHBOARD.COURSES.VIEW(
                                                course.id,
                                            )}
                                        >
                                            View Course
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
