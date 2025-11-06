import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getLocalizedPaths } from "@/hooks/use-localized-paths";
import { UserRole } from "@/lib/consts";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";

export default async function AdminViewCoursePage({
    params,
}: {
    params: Promise<{
        courseId: string;
        lang: string;
    }>;
}) {
    // Fetch roles and verify permissions
    const roles = await AuthController.getUserRoles();
    const hasAccess = roles.some(
        (r) => r === UserRole.TEACHER || r === UserRole.ADMIN,
    );

    if (!hasAccess) {
        redirect("/unauthorized");
    }

    const variables = await params;
    const courseId = variables.courseId;
    const lang = variables.lang as "en" | "es";
    const PATHS = getLocalizedPaths(lang);

    // Fetch course data
    let course: Course;
    try {
        course = (await CourseController.getCourseById({
            courseId: courseId,
        })) as Course;
    } catch (error) {
        console.error("Error fetching course:", error);
        notFound();
    }

    if (!course) {
        notFound();
    }

    const difficultyColors = {
        BEGINNER: "bg-green-100 text-green-800",
        INTERMEDIATE: "bg-yellow-100 text-yellow-800",
        ADVANCED: "bg-orange-100 text-orange-800",
        EXPERT: "bg-red-100 text-red-800",
    };

    const statusColors = {
        DRAFT: "bg-gray-100 text-gray-800",
        PUBLISHED: "bg-blue-100 text-blue-800",
        ARCHIVED: "bg-purple-100 text-purple-800",
    };

    return (
        <section className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                    <Link href={PATHS.DASHBOARD.ADMINISTRATION.COURSES.ROOT}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {course.title}
                        </h1>
                        <p className="text-muted-foreground">Course Details</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={PATHS.DASHBOARD.ADMINISTRATION.COURSES.EDIT(
                            course.id,
                        )}
                    >
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </header>

            <div className="h-full overflow-y-auto p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Cover Image */}
                    {course.coverImage && (
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={course.coverImage}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Status and Difficulty */}
                    <div className="flex gap-2">
                        <Badge
                            className={
                                statusColors[course.status] ||
                                "bg-gray-100 text-gray-800"
                            }
                        >
                            {course.status}
                        </Badge>
                        <Badge
                            className={
                                difficultyColors[course.difficultyLevel] ||
                                "bg-gray-100 text-gray-800"
                            }
                        >
                            {course.difficultyLevel}
                        </Badge>
                    </div>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {course.description ||
                                    "No description provided."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Topics */}
                    {course.topics && course.topics.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Topics</CardTitle>
                                <CardDescription>
                                    Categories covered in this course
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {course.topics.map((topic) => (
                                        <Badge
                                            key={topic.id}
                                            variant="secondary"
                                        >
                                            {topic.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Authors */}
                    {course.authorIds && course.authorIds.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Authors</CardTitle>
                                <CardDescription>
                                    {course.authorIds.length} author(s)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {course.authorIds.map((authorId) => (
                                        <Badge key={authorId} variant="outline">
                                            {authorId}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Guides */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Guides</CardTitle>
                            <CardDescription>
                                {course.guides?.length || 0} guide(s) in this
                                course
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {course.guides && course.guides.length > 0 ? (
                                <div className="space-y-4">
                                    {course.guides.map((guide, index) => (
                                        <div
                                            key={guide.id}
                                            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                                {index + 1}
                                            </div>
                                            {guide.coverImage && (
                                                <img
                                                    src={guide.coverImage}
                                                    alt={guide.title}
                                                    className="w-20 h-20 object-cover rounded-md"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold">
                                                    {guide.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {guide.description}
                                                </p>
                                                <div className="flex gap-2 mt-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {guide.pagesCount} pages
                                                    </Badge>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {guide.likesCount} likes
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            guide.status ===
                                                            "PUBLISHED"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {guide.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">
                                    No guides added yet. Edit this course to add
                                    guides.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Likes:
                                </span>
                                <span className="font-medium">
                                    {course.likesCount || 0}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Created:
                                </span>
                                <span className="font-medium">
                                    {new Date(
                                        course.createdAt,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Last Updated:
                                </span>
                                <span className="font-medium">
                                    {new Date(
                                        course.updatedAt,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
