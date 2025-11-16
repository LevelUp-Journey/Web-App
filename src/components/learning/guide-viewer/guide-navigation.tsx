import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/hooks/use-dictionary";
import { cn } from "@/lib/utils";

interface GuideNavigationProps {
    currentPageIndex: number;
    totalPages: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onGoToPage: (pageIndex: number) => void;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export function GuideNavigation({
    currentPageIndex,
    totalPages,
    onPreviousPage,
    onNextPage,
    onGoToPage,
    hasPreviousPage,
    hasNextPage,
}: GuideNavigationProps) {
    const dict = useDictionary();

    return (
        <div className="flex items-center justify-between mt-12 pt-8 border-t">
            <Button
                variant="outline"
                onClick={onPreviousPage}
                disabled={!hasPreviousPage}
                className="flex items-center gap-2"
            >
                <ChevronLeft className="h-4 w-4" />
                {dict?.guides?.viewer?.previousPage || "Previous Page"}
            </Button>

            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        type="button"
                        key={index}
                        onClick={() => onGoToPage(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            index === currentPageIndex
                                ? "bg-primary"
                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                        )}
                        aria-label={`Go to page ${index + 1}`}
                    />
                ))}
            </div>

            <Button
                variant="outline"
                onClick={onNextPage}
                disabled={!hasNextPage}
                className="flex items-center gap-2"
            >
                {dict?.guides?.viewer?.nextPage || "Next Page"}
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
