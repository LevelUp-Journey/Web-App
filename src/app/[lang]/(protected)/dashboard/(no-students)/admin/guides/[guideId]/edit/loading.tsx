"use client";

import { useDictionary } from "@/hooks/use-dictionary";

export default function Loading() {
    const dict = useDictionary();

    return (
        <section className="flex flex-col h-full items-center justify-center">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground">
                    {dict?.admin?.guides?.editGuide?.loading}
                </p>
            </div>
        </section>
    );
}
