"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
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
import { Spinner } from "@/components/ui/spinner";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";

export default function GuidesPage() {
    const dict = useDictionary();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [permissionsChecked, setPermissionsChecked] = useState(false);
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
                setError(
                    dict?.admin.guides.permissionsError ||
                        "We couldn't verify your permissions.",
                );
            } finally {
                setPermissionsChecked(true);
            }
        };

        checkPermissions();
    }, []);

    useEffect(() => {
        if (!permissionsChecked) return;
        if (!userRole) {
            setLoading(false);
            return;
        }

        const loadGuides = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GuideController.getGuidesPaginated(
                    {
                        page: currentPage,
                        size: pageSize,
                        sort: "createdAt,desc",
                    },
                    "dashboard",
                );

                if (response) {
                    setGuides(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                } else {
                    setError(
                        dict?.admin.guides.error ||
                            "We couldn't load the guides.",
                    );
                }
            } catch (err) {
                console.error("Error loading guides:", err);
                setError(
                    dict?.admin.guides.errorDescription ||
                        "We couldn't load the guides. Please try again.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadGuides();
    }, [permissionsChecked, userRole, currentPage, pageSize]);

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

    if (!permissionsChecked || loading) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Spinner className="size-6 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>{dict?.admin.guides.loading}</EmptyTitle>
                    <EmptyDescription>
                        {dict?.admin.guides.loadingDescription}
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    if (!userRole) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>
                        {error
                            ? dict?.admin.guides.permissionsError
                            : dict?.admin.guides.accessDenied}
                    </EmptyTitle>
                    <EmptyDescription>
                        {error || dict?.admin.guides.accessDeniedDescription}
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    // Main content
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">
                        {dict?.admin.guides.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {dict?.admin.guides.subtitle}
                    </p>
                </div>
                <Button asChild>
                    <Link href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.CREATE}>
                        {dict?.admin.guides.create}
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            {!loading && totalElements > 0 && (
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="text-sm text-muted-foreground">
                        {dict?.admin.guides.showing}{" "}
                        <span className="font-medium text-foreground">
                            {currentPage * pageSize + 1}
                        </span>{" "}
                        {dict?.admin.guides.to}{" "}
                        <span className="font-medium text-foreground">
                            {Math.min(
                                (currentPage + 1) * pageSize,
                                totalElements,
                            )}
                        </span>{" "}
                        {dict?.admin.guides.of}{" "}
                        <span className="font-medium text-foreground">
                            {totalElements}
                        </span>{" "}
                        {dict?.admin.guides.guides}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {dict?.admin.guides.perPage}
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
            {error ? (
                <Empty className="min-h-[300px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>{dict?.admin.guides.error}</EmptyTitle>
                        <EmptyDescription>{error}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button onClick={() => window.location.reload()}>
                            {dict?.admin.guides.retry}
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : guides.length === 0 ? (
                <Empty className="min-h-[300px]">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>{dict?.admin.guides.noGuides}</EmptyTitle>
                        <EmptyDescription>
                            {dict?.admin.guides.noGuidesDescription}
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button asChild>
                            <Link
                                href={
                                    PATHS.DASHBOARD.ADMINISTRATION.GUIDES.CREATE
                                }
                            >
                                {dict?.admin.guides.create}
                            </Link>
                        </Button>
                    </EmptyContent>
                </Empty>
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
