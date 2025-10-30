"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading?: boolean;
    emptyMessage?: string;
    // Server-side pagination props
    pageIndex?: number;
    pageCount?: number;
    onPreviousPage?: () => void;
    onNextPage?: () => void;
    onFirstPage?: () => void;
    onLastPage?: () => void;
    canPreviousPage?: boolean;
    canNextPage?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    loading = false,
    emptyMessage = "No results found.",
    pageIndex = 0,
    pageCount = 1,
    onPreviousPage,
    onNextPage,
    onFirstPage,
    onLastPage,
    canPreviousPage = false,
    canNextPage = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Determine if we're using server-side pagination
    const isServerPagination = onNextPage !== undefined || onPreviousPage !== undefined;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Only use client-side pagination if server-side is not provided
        ...(isServerPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        // For server-side pagination, we need to manage manually
        manualPagination: isServerPagination,
        pageCount: isServerPagination ? pageCount : undefined,
    });

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (data.length === 0) {
        return <div className="text-center py-8">{emptyMessage}</div>;
    }

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {/* Removed row selection text */}
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">

                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {isServerPagination ? pageIndex + 1 : table.getState().pagination.pageIndex + 1} of{" "}
                        {isServerPagination ? pageCount : table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => isServerPagination ? onFirstPage?.() : table.setPageIndex(0)}
                            disabled={isServerPagination ? !canPreviousPage : !table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            {"<<"}
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => isServerPagination ? onPreviousPage?.() : table.previousPage()}
                            disabled={isServerPagination ? !canPreviousPage : !table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            {"<"}
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => isServerPagination ? onNextPage?.() : table.nextPage()}
                            disabled={isServerPagination ? !canNextPage : !table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            {">"}
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => isServerPagination ? onLastPage?.() : table.setPageIndex(table.getPageCount() - 1)}
                            disabled={isServerPagination ? !canNextPage : !table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            {">>"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}