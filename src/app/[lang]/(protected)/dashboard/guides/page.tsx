import { BookOpen, Library } from "lucide-react";
import GuideCard from "@/components/cards/guide-card";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

export default async function GuidesPage() {
    const guides = await GuideController.getAllGuides();

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header Section */}
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Library className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Learning Guides
                    </h1>
                </div>
                <p className="text-muted-foreground">
                    Explore our collection of {guides.length} comprehensive
                    guides to level up your skills
                </p>
            </header>

            {/* Guides Grid */}
            {guides.length > 0 ? (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {guides.map((guide) => (
                        <GuideCard key={guide.id} guide={guide} />
                    ))}
                </section>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        No guides available
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Check back soon for new learning content and guides
                    </p>
                </div>
            )}
        </div>
    );
}
