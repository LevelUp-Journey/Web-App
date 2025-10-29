import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeaderboardPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalUsers: number;
    currentCount: number;
    itemsPerPage: number;
}

export function LeaderboardPagination({
    page,
    totalPages,
    onPageChange,
    totalUsers,
    currentCount,
    itemsPerPage,
}: LeaderboardPaginationProps) {
    if (totalPages <= 1) return null;

    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = (page - 1) * itemsPerPage + currentCount;

    return (
        <div className="border-t flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-2">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{startIndex}</span> to{" "}
                    <span className="font-medium">{endIndex}</span> of{" "}
                    <span className="font-medium">{totalUsers}</span> users
                </p>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 border-t">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = page <= 3 ? i + 1 : page - 2 + i;
                if (pageNum > totalPages) return null;
                return (
                    <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        className="w-10"
                    >
                        {pageNum}
                    </Button>
                );
            })}
            {page < totalPages - 2 && <span>...</span>}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}