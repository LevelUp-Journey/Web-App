import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function AdminChallengesLoading() {
    return (
        <Empty className="min-h-[400px] gap-4">
            <Spinner className="size-8 text-muted-foreground" />
            <EmptyHeader>
                <EmptyTitle>Loading challenges</EmptyTitle>
                <EmptyDescription>
                    Preparing your challenge workspace.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
