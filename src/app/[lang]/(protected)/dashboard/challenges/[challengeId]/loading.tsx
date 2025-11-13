"use client";

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useDictionary } from "@/hooks/use-dictionary";

export default function ChallengeLoading() {
    const dict = useDictionary();

    return (
        <Empty className="min-h-[400px] gap-4">
            <Spinner className="size-8 text-muted-foreground" />
            <EmptyHeader>
                <EmptyTitle>{dict?.common?.loading || "Loading..."}</EmptyTitle>
                <EmptyDescription>
                    {dict?.common?.loadingDescription ||
                        "Preparing your challenge details."}
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
