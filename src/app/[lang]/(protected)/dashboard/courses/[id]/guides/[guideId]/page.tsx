import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getLocalizedPaths } from "@/lib/paths";
import { CourseController } from "@/services/internal/learning/controller/course.controller";
import type { CourseResponse } from "@/services/internal/learning/controller/course.response";
import { GuideController } from "@/services/internal/learning/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/controller/guide.response";

export default async function GuidePage({
    params,
}: {
    params: Promise<{ lang: string; id: string; guideId: string }>;
}) {
    const { lang, id: courseId, guideId } = await params;
    const PATHS = getLocalizedPaths(lang);

    try {
        const course = await CourseController.getById(courseId);
        const guide = await GuideController.getById(guideId);

        // Verify guide belongs to course
        if (guide.courseId !== courseId) {
            notFound();
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{guide.title}</h1>
                        <p className="text-muted-foreground mt-2">
                            From course: {course.title}
                        </p>
                        {guide.isProtected && (
                            <span className="inline-block mt-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Protected Content
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={PATHS.DASHBOARD.COURSES.GUIDES.ROOT(courseId)}>
                                Back to Guides
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={PATHS.DASHBOARD.COURSES.VIEW(courseId)}>
                                Back to Course
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: guide.content }} />
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                    <div className="text-sm text-muted-foreground">
                        Created: {new Date(guide.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Updated: {new Date(guide.updatedAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading guide:", error);
        notFound();
    }
}
