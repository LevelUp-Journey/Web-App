"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GuideCard from "@/components/cards/guide-card";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";

export default function GuidesPage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [guides, setGuides] = useState<GuideResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(9);
    const PATHS = useLocalizedPaths();

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const roles = await AuthController.getUserRoles();
                const role = roles.find(
                    (r) => r === "ROLE_TEACHER" || r === "ROLE_ADMIN",
                );
                setUserRole(role || null);
            } catch (err) {
                console.error("Error checking permissions:", err);
                setError("Error checking permissions");
            }
        };

        checkPermissions();
    }, []);

    useEffect(() => {
        if (!userRole) return;

        const loadGuides = async () => {
            setLoading(true);
            try {
                const response = await GuideController.getGuidesPaginated({
                    page: currentPage,
                    size: pageSize,
                    sort: "createdAt,desc",
                });

                if (response) {
                    setGuides(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                } else {
                    setError("Error loading guides");
                }
            } catch (err) {
                console.error("Error loading guides:", err);
                setError("Error loading guides");
            } finally {
                setLoading(false);
            }
        };

        loadGuides();
    }, [userRole, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number(value));
        setCurrentPage(0);
    };

    // Generate pagination items
    const getPaginationItems = () => {
        const items = [];
        const showEllipsisStart = currentPage > 2;
        const showEllipsisEnd = currentPage < totalPages - 3;

        if (totalPages <= 7) {
            // Show all pages
            for (let i = 0; i < totalPages; i++) {
                items.push(i);
            }
        } else {
            // Show first page
            items.push(0);

            if (showEllipsisStart) {
                items.push(-1); // Ellipsis
            }

            // Show pages around current
            const start = Math.max(1, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);

            for (let i = start; i <= end; i++) {
                items.push(i);
            }

            if (showEllipsisEnd) {
                items.push(-2); // Ellipsis
            }

            // Show last page
            items.push(totalPages - 1);
        }

        return items;
    };

    // Loading state
    if (loading && !userRole) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-8 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    // No permissions
    if (!userRole) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Guides</h2>
                </div>
                <div className="text-center space-y-4 py-12">
                    <h1 className="text-2xl font-semibold">Access Denied</h1>
                    <p className="text-muted-foreground">
                        You don't have permission to view guides.
                    </p>
                </div>
            </div>
        );
    }

    // Main content
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Guides</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and create learning guides
                    </p>
                </div>
                <Button asChild>
                    <Link href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.CREATE}>
                        Create Guide
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            {!loading && totalElements > 0 && (
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium text-foreground">
                            {currentPage * pageSize + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-foreground">
                            {Math.min(
                                (currentPage + 1) * pageSize,
                                totalElements,
                            )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-foreground">
                            {totalElements}
                        </span>{" "}
                        guides
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Per page:
                        </span>
                        <Select
                            value={String(pageSize)}
                            onValueChange={handlePageSizeChange}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="9">9</SelectItem>
                                <SelectItem value="12">12</SelectItem>
                                <SelectItem value="18">18</SelectItem>
                                <SelectItem value="24">24</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: pageSize }).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                </div>
            ) : error ? (
                <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                    <div className="text-center">
                        <p className="text-lg font-medium">{error}</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            ) : guides.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg">
                    <div className="text-center space-y-3">
                        <p className="text-lg font-medium text-muted-foreground">
                            No guides created yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Create your first guide to get started
                        </p>
                        <Button asChild className="mt-4">
                            <Link
                                href={
                                    PATHS.DASHBOARD.ADMINISTRATION.GUIDES.CREATE
                                }
                            >
                                Create Guide
                            </Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {guides.map((guide) => (
                            <GuideCard key={guide.id} guide={guide} adminMode />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        className={
                                            currentPage === 0
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>

                                {getPaginationItems().map((pageNum, idx) => {
                                    if (pageNum === -1 || pageNum === -2) {
                                        return (
                                            <PaginationItem
                                                key={`ellipsis-${idx}`}
                                            >
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }

                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                onClick={() =>
                                                    handlePageChange(pageNum)
                                                }
                                                isActive={
                                                    currentPage === pageNum
                                                }
                                                className="cursor-pointer"
                                            >
                                                {pageNum + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        className={
                                            currentPage === totalPages - 1
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </div>
    );
}
