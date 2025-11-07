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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getLocalizedPaths } from "@/hooks/use-localized-paths";
import { UserRole } from "@/lib/consts";
import { cn } from "@/lib/utils";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

// Helper function for difficulty badge colors
function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    BEGINNER: "bg-green-500/10 text-green-700 dark:text-green-400",
    INTERMEDIATE: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    ADVANCED: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    EXPERT: "bg-red-500/10 text-red-700 dark:text-red-400",
  };
  return (
    colors[difficulty.toUpperCase()] ??
    "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  );
}

// Component for course statistics
function CourseStats({ course }: { course: Course }) {
  const stats = [
    {
      icon: BookOpen,
      label: "Guides",
      value: course.guides?.length || 0,
    },
    {
      icon: Heart,
      label: "Likes",
      value: course.likesCount || 0,
    },
    {
      icon: Award,
      label: "Difficulty",
      value: course.difficultyLevel,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card"
        >
          <Icon className="h-5 w-5 text-muted-foreground mb-1" />
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}

// Component for course guides list
function CourseGuides({
  course,
  courseId,
  lang,
}: {
  course: Course;
  courseId: string;
  lang: string;
}) {
  const PATHS = getLocalizedPaths(lang as "en" | "es");

  if (!course.guides) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No guides yet</h3>
        <p className="text-sm text-muted-foreground">
          This course doesn't have any guides yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {course.guides.map((guide, index) => (
        <div key={guide.id} className="flex gap-3 items-start group">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary mt-2">
            {index + 1}
          </div>
          <Link
            href={PATHS.DASHBOARD.COURSES.GUIDES.VIEW(courseId, guide.id)}
            className="flex-1 min-w-0"
          >
            <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-4">
                {guide.coverImage && (
                  <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={guide.coverImage}
                      alt={guide.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                  {guide.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {guide.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{guide.pagesCount} pages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{guide.likesCount} likes</span>
                    </div>
                    <Badge
                      variant={
                        guide.status === "PUBLISHED" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {guide.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardCoursePage({
  params,
}: {
  params: Promise<{ courseId: string; lang: string }>;
}) {
  const { courseId, lang } = await params;
  const PATHS = getLocalizedPaths(lang as "en" | "es");

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
  const formattedDate = new Date(course.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Check user permissions
  const roles = await AuthController.getUserRoles();
  const isTeacherOrAdmin = roles.some(
    (r) => r === UserRole.TEACHER || r === UserRole.ADMIN,
  );

  // Fetch author profiles
  const authorProfiles: { [key: string]: string } = {};
  try {
    for (const authorId of course.authorIds) {
      const profile = await ProfileController.getProfileByUserId(authorId);
      authorProfiles[authorId] = profile?.username || "Unknown Author";
    }
  } catch (error) {
    console.error("Error fetching author profiles:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Cover */}
      {course.coverImage && (
        <div className="relative w-full h-[400px] bg-gradient-to-b from-muted to-background">
          <Image
            src={course.coverImage}
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
                  course.status === "PUBLISHED" ? "default" : "secondary"
                }
                className="text-xs uppercase tracking-wider"
              >
                {course.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {course.guides?.length || 0}{" "}
                {course.guides?.length === 1 ? "guide" : "guides"}
              </span>
            </div>

            {/* Edit Button - Only for teachers/admins */}
            {isTeacherOrAdmin && (
              <Button asChild size="sm" variant="outline">
                <Link
                  href={PATHS.DASHBOARD.ADMINISTRATION.COURSES.EDIT(courseId)}
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
                      .map((id) => authorProfiles[id] || "Unknown")
                      .join(", ")}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-4" />
              </>
            )}

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={course.createdAt}>{formattedDate}</time>
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
              {course.guides?.length === 1 ? "guide" : "guides"} in this course
            </p>
          </div>

          <CourseGuides course={course} courseId={courseId} lang={lang} />
        </section>
      </div>
    </div>
  );
}
