import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function AdminGuidesLoading() {
    return (
        <Empty className="min-h-[400px] gap-4">
            <Spinner className="size-8 text-muted-foreground" />
            <EmptyHeader>
                <EmptyTitle>Loading guides</EmptyTitle>
                <EmptyDescription>
                    Gathering the learning guides you can manage.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
