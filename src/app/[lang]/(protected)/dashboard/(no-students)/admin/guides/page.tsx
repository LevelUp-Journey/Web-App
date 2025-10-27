import { Button } from "@/components/ui/button";
import { PATHS } from "@/lib/paths";
import Link from "next/link";

export default function GuidesPage() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Guides</h2>
                <Button asChild>
                    <Link href={PATHS.DASHBOARD.COURSES.CREATE}>
                        Create Guide
                    </Link>
                </Button>
            </div>
            <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                <p>No courses created yet</p>
            </div>
        </div>
    );
}
