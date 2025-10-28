import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocalizedPaths } from "@/lib/paths";

export default async function AdminCoursesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const PATHS = getLocalizedPaths(lang);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Courses</h2>
                <Button asChild>
                    <Link href={PATHS.DASHBOARD.ADMINISTRATION.COURSES.CREATE}>
                        Create Course
                    </Link>
                </Button>
            </div>
            <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                <p>No courses created yet</p>
            </div>
        </div>
    );
}
