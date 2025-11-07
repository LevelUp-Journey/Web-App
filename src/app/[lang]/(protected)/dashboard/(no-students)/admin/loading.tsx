import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function AdminDashboardLoading() {
    return (
        <Empty className="min-h-[400px] gap-4">
            <Spinner className="size-8 text-muted-foreground" />
            <EmptyHeader>
                <EmptyTitle>Loading admin dashboard</EmptyTitle>
                <EmptyDescription>
                    Fetching the latest challenges, guides, and courses.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
