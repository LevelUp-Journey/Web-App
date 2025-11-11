import { Library } from "lucide-react";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { GuidesSection } from "@/components/guides/guides-section";

export default async function GuidesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header Section */}
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Library className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {dict.guides.title}
                    </h1>
                </div>
                <p className="text-muted-foreground">
                    {dict.guides.description}
                </p>
            </header>

            {/* Guides Grid */}
            <GuidesSection />
        </div>
    );
}
