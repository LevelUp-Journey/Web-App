import Link from "next/link";
import { notFound } from "next/navigation";
import { serialize } from "next-mdx-remote-client/serialize";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocalizedPaths } from "@/lib/paths";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

export default async function GuidePage({
    params,
}: {
    params: Promise<{ lang: string; id: string; guideId: string }>;
}) {
    const { lang, guideId } = await params;
    const PATHS = getLocalizedPaths(lang);

    try {
        const guide = await GuideController.getGuideById(guideId);

        // Serialize the markdown content for MDX rendering
        const serializedMarkdown = guide.description
            ? await serialize({ source: guide.markdownContent })
            : null;

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{guide.title}</h1>
                        {guide.description && (
                            <p className="text-lg text-muted-foreground">
                                {guide.description}
                            </p>
                        )}
                        <p className="text-muted-foreground">
                            From course: {course.title}
                        </p>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    guide.status === "PUBLISHED"
                                        ? "default"
                                        : guide.status === "PROTECTED"
                                          ? "secondary"
                                          : "outline"
                                }
                            >
                                {guide.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                Order: {guide.orderIndex}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={PATHS.DASHBOARD.COURSES.GUIDES.ROOT(
                                    courseId,
                                )}
                            >
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

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Description</h2>
                    <div className="bg-muted p-4 rounded-md">
                        <MdxRenderer serializedSource={serializedMarkdown} />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                    <div className="text-sm text-muted-foreground">
                        Created:{" "}
                        {new Date(guide.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Updated:{" "}
                        {new Date(guide.updatedAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading guide:", error);
        notFound();
    }
}
