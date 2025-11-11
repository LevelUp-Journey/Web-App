import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingCommunity() {
    return (
        <Empty className="min-h-[400px]">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Spinner className="size-6 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>Loading communities</EmptyTitle>
                <EmptyDescription>
                    Preparing your community management tools.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
