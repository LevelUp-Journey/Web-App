import { BookOpen, Calendar, Heart, Pencil, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { UserRole } from "@/lib/consts";
import { cn } from "@/lib/utils";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import { PATHS } from "@/lib/paths";
import {
    CourseStats,
    getDifficultyColor,
} from "@/components/learning/courses/server/course-stats";
import { CourseGuides } from "@/components/learning/courses/client/course-guides";

export default async function DashboardCoursePage({
    params,
}: {
    params: Promise<{ courseId: string; lang: string }>;
}) {
    const { courseId, lang } = await params;

    // Fetch course data
    let course: Course;
    try {
        course = (await CourseController.getCourseById({
            courseId,
        })) as Course;
    } catch (error) {
        console.error("Error fetching course:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Course not found</h2>
                <p className="text-muted-foreground">
                    The course you're looking for doesn't exist.
                </p>
            </div>
        );
    }

    // Format date
    const formattedDate = new Date(course.createdAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    );

    // Check user permissions
    const roles = await AuthController.getUserRoles();
    const isTeacherOrAdmin = roles.some(
        (r) => r === UserRole.TEACHER || r === UserRole.ADMIN,
    );

    // Fetch author profiles
    const authorProfiles: { [key: string]: string } = {};
    try {
        for (const authorId of course.authorIds) {
            const profile =
                await ProfileController.getProfileByUserId(authorId);
            authorProfiles[authorId] = profile?.username || "Unknown Author";
        }
    } catch (error) {
        console.error("Error fetching author profiles:", error);
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Cover */}
            {course.coverImage && (
                <div className="relative w-full h-[400px] bg-linear-to-b from-muted to-background">
                    <Image
                        src={course.coverImage}
                        alt={course.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
                </div>
            )}

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <header
                    className={cn(
                        "py-8 space-y-6",
                        course.coverImage && "-mt-32 relative z-10",
                    )}
                >
                    {/* Status Badge & Meta */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-xs uppercase tracking-wider",
                                    getDifficultyColor(course.difficultyLevel),
                                )}
                            >
                                {course.difficultyLevel}
                            </Badge>
                            <Badge
                                variant={
                                    course.status === "PUBLISHED"
                                        ? "default"
                                        : "secondary"
                                }
                                className="text-xs uppercase tracking-wider"
                            >
                                {course.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {course.guides?.length || 0}{" "}
                                {course.guides?.length === 1
                                    ? "guide"
                                    : "guides"}
                            </span>
                        </div>

                        {/* Edit Button - Only for teachers/admins */}
                        {isTeacherOrAdmin && (
                            <Button asChild size="sm" variant="outline">
                                <Link
                                    href={PATHS.DASHBOARD.ADMINISTRATION.COURSES.EDIT(
                                        courseId,
                                    )}
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Course
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        {course.title}
                    </h1>

                    {/* Description */}
                    {course.description && (
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {course.description}
                        </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {/* Authors */}
                        {course.authorIds && course.authorIds.length > 0 && (
                            <>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span className="font-medium text-foreground">
                                        By{" "}
                                        {course.authorIds
                                            .map(
                                                (id) =>
                                                    authorProfiles[id] ||
                                                    "Unknown",
                                            )
                                            .join(", ")}
                                    </span>
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="h-4"
                                />
                            </>
                        )}

                        {/* Date */}
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={course.createdAt}>
                                {formattedDate}
                            </time>
                        </div>

                        <Separator orientation="vertical" className="h-4" />

                        {/* Likes */}
                        <div className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4" />
                            <span>{course.likesCount || 0} likes</span>
                        </div>
                    </div>

                    {/* Topics */}
                    {course.topics && course.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {course.topics.map((topic) => (
                                <Badge key={topic.id} variant="outline">
                                    {topic.name}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Stats Grid */}
                    <CourseStats course={course} />
                </header>

                <Separator className="my-8" />

                {/* Course Content Section */}
                <section className="space-y-6 pb-16">
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Course Content
                        </h2>
                        <p className="text-muted-foreground">
                            {course.guides?.length || 0}{" "}
                            {course.guides?.length === 1 ? "guide" : "guides"}{" "}
                            in this course
                        </p>
                    </div>

                    <CourseGuides
                        course={course}
                        courseId={courseId}
                        lang={lang}
                    />
                </section>
            </div>
        </div>
    );
}
