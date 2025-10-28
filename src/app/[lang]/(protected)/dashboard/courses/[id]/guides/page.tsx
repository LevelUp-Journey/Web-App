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

export default async function CourseGuidesPage({
    params,
}: {
    params: Promise<{ lang: string; id: string }>;
}) {
    const { lang, id } = await params;
    const PATHS = getLocalizedPaths(lang);

    try {
        const course = await CourseController.getById(id);
        const guides = await GuideController.getByCourse(id);

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

                {guides.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            No guides available for this course yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {guides
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((guide) => (
                                <Card key={guide.id}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{guide.title}</span>
                                            <span
                                                className={`text-sm px-2 py-1 rounded ${
                                                    guide.status === "PUBLISHED"
                                                        ? "bg-green-100 text-green-800"
                                                        : guide.status ===
                                                            "PROTECTED"
                                                          ? "bg-blue-100 text-blue-800"
                                                          : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {guide.status}
                                            </span>
                                        </CardTitle>
                                        <CardDescription>
                                            {guide.description ||
                                                "No description"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-muted-foreground">
                                                Order: {guide.orderIndex} •
                                                Likes: {guide.totalLikes}
                                            </div>
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
                                        </div>
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
