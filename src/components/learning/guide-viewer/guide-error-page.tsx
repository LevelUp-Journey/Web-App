import { Button } from "@/components/ui/button";
import { useDictionary } from "@/hooks/use-dictionary";

interface GuideErrorPageProps {
    pageNumber: number;
    totalPages: number;
    onBackToOverview: () => void;
}

export function GuideErrorPage({
    pageNumber,
    totalPages,
    onBackToOverview,
}: GuideErrorPageProps) {
    const dict = useDictionary();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
                <div>
                    <h2 className="text-2xl font-bold mb-2">
                        {dict?.errors?.notFound || "Page Not Found"}
                    </h2>
                    <p className="text-muted-foreground">
                        {dict?.errors?.pageNotFound
                            ?.replace("{pageNumber}", pageNumber.toString())
                            ?.replace("{totalPages}", totalPages.toString())
                            ?.replace(
                                "{pagesPlural}",
                                totalPages !== 1 ? "s" : "",
                            ) ||
                            `The page number ${pageNumber} does not exist in this guide. This guide has ${totalPages} page${
                                totalPages !== 1 ? "s" : ""
                            }.`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {dict?.guides?.guidePageCount
                            ?.replace("{count}", totalPages.toString())
                            ?.replace(
                                "{unit}",
                                totalPages !== 1
                                    ? dict?.guides?.viewer?.pagePlural ||
                                          "pages"
                                    : dict?.guides?.viewer?.pageSingular ||
                                          "page",
                            ) ||
                            `This guide has ${totalPages} page${
                                totalPages !== 1 ? "s" : ""
                            }.`}
                    </p>
                </div>
                <Button onClick={onBackToOverview}>
                    {dict?.guides?.viewer?.backToOverview || "Back to Overview"}
                </Button>
            </div>
        </div>
    );
}
