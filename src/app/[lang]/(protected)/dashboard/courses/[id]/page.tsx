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
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

export default async function CoursePage({
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
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {course.title}
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                {course.description}
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href={PATHS.DASHBOARD.COURSES.ROOT}>
                                Back to Courses
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">
                                {course.totalGuides}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Guides
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">
                                {course.rating}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Rating
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">
                                {course.totalLikes}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Likes
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">
                                {course.difficulty}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Difficulty
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Course Guides</h2>
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
            </div>
        );
    } catch (error) {
        console.error("Error loading course:", error);
        notFound();
    }
}
