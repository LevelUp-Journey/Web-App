import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function AdminCommunityLoading() {
    return (
        <Empty className="min-h-[400px] gap-4">
            <Spinner className="size-8 text-muted-foreground" />
            <EmptyHeader>
                <EmptyTitle>Loading communities</EmptyTitle>
                <EmptyDescription>
                    Preparing your community management tools.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
