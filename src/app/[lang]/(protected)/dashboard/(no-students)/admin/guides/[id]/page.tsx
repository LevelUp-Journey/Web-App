import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getLocalizedPaths } from "@/lib/paths";
import { GuideController } from "@/services/internal/learning/controller/guide.controller";

export default async function GuidePage({
    params,
}: {
    params: Promise<{ lang: string; id: string }>;
}) {
    const { lang, id } = await params;
    const PATHS = getLocalizedPaths(lang);

    try {
        const guide = await GuideController.getById(id);

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{guide.title}</h2>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.EDIT(id)}>
                                Edit
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT}>
                                Back to Guides
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: guide.content }} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading guide:", error);
        notFound();
    }
}
