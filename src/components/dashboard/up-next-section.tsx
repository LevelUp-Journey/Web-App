"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface UpNextSectionProps {
    dict: any; // Dictionary type from getDictionary
}

export default function UpNextSection({ dict }: UpNextSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem("upNextDismissed") === "true";
        setIsVisible(!dismissed);
        setHasCheckedStorage(true);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        if (typeof window !== "undefined") {
            localStorage.setItem("upNextDismissed", "true");
        }
    };

    if (!hasCheckedStorage || !isVisible) return null;

    return (
        <div>
            <h3 className="text-xl font-semibold mb-3">
                {dict.dashboardPage.upNext.title}
            </h3>
            <div className="bg-card border rounded-lg p-6 shadow-sm relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleDismiss}
                >
                    <X className="h-4 w-4" />
                </Button>
                <div className="flex items-start gap-6 h-full">
                    <Image
                        src="/cat-walking.svg"
                        alt="Cat walking"
                        width={200}
                        height={200}
                        className="shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between h-full min-h-[200px]">
                        <div className="flex-1">
                            <h4 className="text-xl font-semibold mb-3">
                                {dict.dashboardPage.upNext.card.title}
                            </h4>
                            <p className="text-muted-foreground text-base leading-relaxed">
                                {dict.dashboardPage.upNext.card.description}
                            </p>
                        </div>
                        <div className="mt-auto pt-4">
                            <Link href="/dashboard/guides">
                                <Button size="lg" className="px-6 py-3">
                                    {dict.dashboardPage.upNext.card.button}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
