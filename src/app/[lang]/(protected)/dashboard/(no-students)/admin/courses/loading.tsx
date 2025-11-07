import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function AdminCoursesLoading() {
    return (
        <Empty className="min-h-[400px] gap-4">
            <Spinner className="size-8 text-muted-foreground" />
            <EmptyHeader>
                <EmptyTitle>Loading courses</EmptyTitle>
                <EmptyDescription>
                    Fetching the latest course catalog for you.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
