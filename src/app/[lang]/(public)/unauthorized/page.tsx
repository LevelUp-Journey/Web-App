"use client";

import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { useDictionary } from "@/hooks/use-dictionary";
import { getLocalizedPaths } from "@/lib/paths";

export default function UnauthorizedPage() {
    const params = useParams();
    const lang = params.lang as string;
    const PATHS = getLocalizedPaths(lang);
    const dict = useDictionary();

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ShieldX />
                </EmptyMedia>
                <EmptyTitle>
                    {dict?.unauthorized.title || "Unauthorized Access"}
                </EmptyTitle>
                <EmptyDescription>
                    {dict?.unauthorized.description ||
                        "You have attempted to access a page that you are not authorized to view. If you believe this is an error, please contact support."}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href={PATHS.DASHBOARD.ROOT}>
                            <ArrowLeft />{" "}
                            {dict?.unauthorized.goBackDashboard ||
                                "Go back to Dashboard"}
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={PATHS.ROOT}>
                            {dict?.unauthorized.homeButton || "Home"}
                        </Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    );
}
