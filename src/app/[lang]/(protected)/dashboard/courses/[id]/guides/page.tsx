import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getLocalizedPaths } from "@/lib/paths";
import { CourseController } from "@/services/internal/learning/controller/course.controller";
import type { CourseResponse } from "@/services/internal/learning/controller/course.response";
import { GuideController } from "@/services/internal/learning/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/controller/guide.response";

export default async function CourseGuidesPage({
    params,
}: {
    params: Promise<{ lang: string; id: string }>;
}) {
    const { lang, id } = await params;
    const PATHS = getLocalizedPaths(lang);

    try {
        const course = await CourseController.getById(id);
        const guides = await GuideController.getList({ courseId: id });

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {course.title} - Guides
                        </h1>
                        <p className="text-muted-foreground">
                            {course.description}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={PATHS.DASHBOARD.COURSES.VIEW(id)}>
                                Back to Course
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={PATHS.DASHBOARD.COURSES.ROOT}>
                                All Courses
                            </Link>
                        </Button>
                    </div>
                </div>

                {guides.data.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            No guides available for this course yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {guides.data
                            .sort((a, b) => a.order - b.order)
                            .map((guide) => (
                                <Card key={guide.id}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{guide.title}</span>
                                            {guide.isProtected && (
                                                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                    Protected
                                                </span>
                                            )}
                                        </CardTitle>
                                        <CardDescription>
                                            Order: {guide.order}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild>
                                            <Link
                                                href={PATHS.DASHBOARD.COURSES.GUIDES.VIEW(
                                                    course.id,
                                                    guide.id,
                                                )}
                                            >
                                                Read Guide
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error("Error loading course guides:", error);
        notFound();
    }
}
