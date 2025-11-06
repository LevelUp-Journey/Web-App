"use client";

import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getLocalizedPaths } from "@/lib/paths";

export default function UnauthorizedPage() {
    const params = useParams();
    const lang = params.lang as string;
    const PATHS = getLocalizedPaths(lang);

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ShieldX />
                </EmptyMedia>
                <EmptyTitle>Unauthorized Access</EmptyTitle>
                <EmptyDescription>
                    You have attempted to access a page that you are not
                    authorized to view. If you believe this is an error, please
                    contact support.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href={PATHS.DASHBOARD.ROOT}>
                            <ArrowLeft /> Go back to Dashboard
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={PATHS.ROOT}>Home</Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    );
}
