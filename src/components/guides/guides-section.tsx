"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import GuideCard from "@/components/cards/guide-card";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";

export function GuidesSection() {
    const [guides, setGuides] = useState<GuideResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadGuides = async () => {
        try {
            setLoading(true);
            setError(false);

            const guidesData = await GuideController.getAllGuides();

            // If no guides returned, consider it an error
            if (guidesData.length === 0) {
                setError(true);
                setGuides([]);
                return;
            }

            setGuides(guidesData);
        } catch (err) {
            console.error("Error loading guides:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGuides();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner className="size-8 mb-4" />
                <p className="text-muted-foreground">Loading guides...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>Error fetching guides</EmptyTitle>
                    <EmptyDescription>
                        The guides service is temporarily unavailable. Please
                        try again.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={loadGuides} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
            ))}
        </section>
    );
}
