import {
    Award,
    BookOpen,
    Calendar,
    Heart,
    Pencil,
    Star,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import CourseGuideCard from "@/components/cards/course-guide-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import type { CourseGuideFullResponse } from "@/services/internal/learning/courses/controller/course.response";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

// Helper to check if user is teacher/admin
async function getUserRole(): Promise<string | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    
    if (!sessionCookie?.value) {
        return null;
    }

    try {
        // Decode JWT to get role
        const payload = JSON.parse(
            Buffer.from(sessionCookie.value.split(".")[1], "base64").toString()
        );
        return payload.role || null;
    } catch {
        return null;
    }
}

export default async function DashboardCoursePage({
    params,
}: {
    params: Promise<{ courseId: string; lang: string }>;
}) {
    const { courseId, lang } = await params;

    // ✅ Fetch data from controllers (Server-side)
    const course = await CourseController.getCourseById(courseId);
    if (!course) {
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

    const profile: ProfileResponse = await ProfileController.getProfileByUserId(
        course.teacherId,
    );
    const guides: CourseGuideFullResponse[] =
        await CourseController.getCourseGuidesFullByCourseId(courseId);

    const formattedDate = new Date(course.createdAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    );

    // Check if user is teacher/admin
    const userRole = await getUserRole();
    const isTeacherOrAdmin = userRole === "TEACHER" || userRole === "ADMIN";

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Cover */}
            {course.cover && (
                <div className="relative w-full h-[400px] bg-gradient-to-b from-muted to-background">
                    <Image
                        src={course.cover}
                        alt={course.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
            )}

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <header
                    className={cn(
                        "py-8 space-y-6",
                        course.cover && "-mt-32 relative z-10",
                    )}
                >
                    {/* Status Badge & Meta */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-xs uppercase tracking-wider",
                                    getDifficultyColor(course.difficulty),
                                )}
                            >
                                {course.difficulty}
                            </Badge>
                            <Badge
                                variant={
                                    course.status === "published"
                                        ? "default"
                                        : "secondary"
                                }
                                className="text-xs uppercase tracking-wider"
                            >
                                {course.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {course.totalGuides}{" "}
                                {course.totalGuides === 1 ? "guide" : "guides"}
                            </span>
                        </div>

                        {/* Edit Button - Only for teachers/admins */}
                        {isTeacherOrAdmin && (
                            <Button asChild size="sm" variant="outline">
                                <Link
                                    href={`/${lang}/dashboard/admin/courses/edit/${courseId}`}
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
                        {/* Instructor */}
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={profile.profileUrl} />
                                <AvatarFallback>
                                    {profile.firstName[0]}
                                    {profile.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">
                                {profile.firstName} {profile.lastName}
                            </span>
                        </div>

                        <Separator orientation="vertical" className="h-4" />

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
                            <span>{course.totalLikes} likes</span>
                        </div>

                        <Separator orientation="vertical" className="h-4" />

                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4" />
                            <span>{course.rating.toFixed(1)} rating</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                        {[
                            {
                                icon: BookOpen,
                                label: "Guides",
                                value: course.totalGuides,
                            },
                            {
                                icon: Users,
                                label: "Students",
                                value: course.totalLikes,
                            },
                            {
                                icon: Award,
                                label: "Points",
                                value: course.completionScore,
                            },
                            {
                                icon: Star,
                                label: "Rating",
                                value: course.rating.toFixed(1),
                            },
                        ].map(({ icon: Icon, label, value }) => (
                            <div
                                key={label}
                                className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card"
                            >
                                <Icon className="h-5 w-5 text-muted-foreground mb-1" />
                                <p className="text-2xl font-bold">{value}</p>
                                <p className="text-xs text-muted-foreground">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </header>

                <Separator className="my-8" />
                <Separator className="my-8" />

                {/* Course Content Section */}
                <section className="space-y-6 pb-16">
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Course Content
                        </h2>
                        <p className="text-muted-foreground">
                            {guides.length}{" "}
                            {guides.length === 1 ? "guide" : "guides"} in this
                            course
                        </p>
                    </div>

                    {guides.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
                            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No guides yet
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                This course doesn't have any guides yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {guides.map((guide, index) => (
                                <div
                                    key={guide.id}
                                    className="flex gap-3 items-start group"
                                >
                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-medium mt-1">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CourseGuideCard guide={guide} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

// Helper para colores del badge
function getDifficultyColor(difficulty: string): string {
    const colors: Record<string, string> = {
        beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
        intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
    };
    return (
        colors[difficulty.toLowerCase()] ??
        "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    );
}
