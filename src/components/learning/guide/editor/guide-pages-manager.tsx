"use client";

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
    ShadcnTemplate,
    type ShadcnTemplateRef,
} from "@/components/challenges/editor/lexkitEditor";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDictionary } from "@/hooks/use-dictionary";
import { cn } from "@/lib/utils";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { PageResponse } from "@/services/internal/learning/guides/controller/guide.response";
import { useGuideEditorStore } from "@/stores/guide-editor-store";

interface GuidePagesManagerProps {
    guideId: string;
}

interface SortablePageItemProps {
    page: PageResponse;
    index: number;
    isActive: boolean;
    isDisabled: boolean;
    onSelect: (pageId: string) => void;
    onDelete: (pageId: string) => void;
}

const SortablePageItem = memo(
    ({
        page,
        index,
        isActive,
        isDisabled,
        onSelect,
        onDelete,
    }: SortablePageItemProps) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: page.id });

        const style = {
            transform: CSS.Translate.toString(transform),
            transition,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg transition-colors",
                    isActive
                        ? "border-primary bg-primary/10"
                        : "bg-card hover:bg-muted/60",
                    isDragging && "opacity-50",
                )}
            >
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1"
                    aria-label="Drag page"
                    disabled={isDisabled}
                >
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </button>

                <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onSelect(page.id)}
                    className="flex-1 text-left"
                >
                    <div className="font-medium">Page {index + 1}</div>
                    <p className="text-xs text-muted-foreground truncate">
                        {page.content
                            ? page.content.replace(/[#*`_>-]/g, "").slice(0, 80)
                            : "Empty page"}
                    </p>
                </button>

                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(page.id)}
                    disabled={isDisabled}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        );
    },
);
SortablePageItem.displayName = "SortablePageItem";

const DEFAULT_PAGE_CONTENT = "# New page\n\nStart writing your content here...";

export function GuidePagesManager({ guideId }: GuidePagesManagerProps) {
    const dict = useDictionary();
    const {
        guide,
        pages,
        activePageId,
        isReordering,
        isPageOperationPending,
        applyGuideResponse,
        setPages,
        setActivePageId,
        setReordering,
        setPageOperationPending,
    } = useGuideEditorStore(
        useShallow((state) => ({
            guide: state.guide,
            pages: state.pages,
            activePageId: state.activePageId,
            isReordering: state.isReordering,
            isPageOperationPending: state.isPageOperationPending,
            applyGuideResponse: state.applyGuideResponse,
            setPages: state.setPages,
            setActivePageId: state.setActivePageId,
            setReordering: state.setReordering,
            setPageOperationPending: state.setPageOperationPending,
        })),
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const editorRef = useRef<ShadcnTemplateRef | null>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const draftContentRef = useRef<string>("");
    const [initialContent, setInitialContent] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
    const [editorReady, setEditorReady] = useState(false);

    const activePage = useMemo(
        () => pages.find((page) => page.id === activePageId) ?? null,
        [pages, activePageId],
    );

    const ensureEditorBlur = useCallback(() => {
        const editable = editorContainerRef.current?.querySelector(
            "[contenteditable='true']",
        ) as HTMLElement | null;
        editable?.blur();
    }, []);

    const handleEditorReady = useCallback((methods: ShadcnTemplateRef) => {
        editorRef.current = methods;
        setEditorReady(true);
    }, []);

    // Load content when page changes
    useEffect(() => {
        if (!activePage || !editorRef.current) {
            return;
        }

        const content = activePage.content || "";
        editorRef.current.injectMarkdown(content);
        draftContentRef.current = content;
        setInitialContent(content);
        setHasUnsavedChanges(false);
        ensureEditorBlur();
    }, [activePage, ensureEditorBlur]);

    // Poll editor to detect content changes without relying on focus events
    useEffect(() => {
        if (!editorReady) return;

        const interval = window.setInterval(() => {
            const current = editorRef.current?.getMarkdown() ?? "";
            if (current !== draftContentRef.current) {
                draftContentRef.current = current;
                setHasUnsavedChanges(current !== initialContent);
            }
        }, 800);

        return () => window.clearInterval(interval);
    }, [editorReady, initialContent]);

    const handleSelectPage = useCallback(
        (pageId: string) => {
            if (hasUnsavedChanges) {
                const shouldContinue = confirm(
                    dict?.admin?.guides?.editGuide?.pages?.discardChanges ||
                        "You have unsaved changes. Continue without saving?",
                );
                if (!shouldContinue) {
                    return;
                }
            }
            setActivePageId(pageId);
        },
        [dict, hasUnsavedChanges, setActivePageId],
    );

    const handleCreatePage = useCallback(async () => {
        if (!guide) return;

        if (hasUnsavedChanges) {
            const continueCreation = confirm(
                dict?.admin?.guides?.editGuide?.pages?.discardChanges ||
                    "You have unsaved changes. Continue without saving?",
            );
            if (!continueCreation) {
                return;
            }
        }

        setPageOperationPending(true);
        try {
            const highestOrder = pages.reduce(
                (acc, page) => Math.max(acc, page.orderNumber || 0),
                0,
            );
            const nextOrder = highestOrder + 1;

            const response = await GuideController.createPage(guide.id, {
                content:
                    dict?.admin?.guides?.editGuide?.pages?.defaultContent ||
                    DEFAULT_PAGE_CONTENT,
                orderNumber: nextOrder,
            });

            applyGuideResponse(response);
            const newPage = response.pages.find(
                (page) => page.orderNumber === nextOrder,
            );
            if (newPage) {
                setActivePageId(newPage.id);
            }
        } catch (error) {
            console.error("Error creating page:", error);
            alert(
                dict?.admin?.guides?.editGuide?.pages?.createError ||
                    "There was an error creating the page. Please try again.",
            );
        } finally {
            setPageOperationPending(false);
        }
    }, [
        applyGuideResponse,
        dict,
        guide,
        hasUnsavedChanges,
        pages,
        setActivePageId,
        setPageOperationPending,
    ]);

    const handleSavePage = useCallback(async () => {
        if (!guide || !activePage) return;
        if (!hasUnsavedChanges) return;

        setIsSaving(true);
        try {
            const content = editorRef.current?.getMarkdown() ?? "";
            const response = await GuideController.updatePage(
                guide.id,
                activePage.id,
                {
                    content,
                    orderNumber: activePage.orderNumber,
                },
            );
            applyGuideResponse(response);
            setInitialContent(content);
            draftContentRef.current = content;
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error updating page:", error);
            alert(
                dict?.admin?.guides?.editGuide?.pages?.updateError ||
                    "There was an error saving the page. Please try again.",
            );
        } finally {
            setIsSaving(false);
        }
    }, [activePage, applyGuideResponse, dict, guide, hasUnsavedChanges]);

    const handleDeletePage = useCallback(
        async (pageId: string) => {
            if (!guide) return;

            const confirmed = confirm(
                dict?.admin?.guides?.editGuide?.pages?.deleteConfirm ||
                    "Are you sure you want to delete this page?",
            );
            if (!confirmed) return;

            setPageOperationPending(true);
            setIsDeleting(true);
            setDeletingPageId(pageId);
            try {
                const response = await GuideController.deletePage({
                    guideId,
                    pageId,
                });

                applyGuideResponse(response);

                if (pageId === activePageId) {
                    const [firstPage] = response.pages;
                    setActivePageId(firstPage?.id ?? null);
                }
            } catch (error) {
                console.error("Error deleting page:", error);
                alert(
                    dict?.admin?.guides?.editGuide?.pages?.deleteError ||
                        "There was an error deleting the page. Please try again.",
                );
            } finally {
                setIsDeleting(false);
                setDeletingPageId(null);
                setPageOperationPending(false);
            }
        },
        [
            activePageId,
            applyGuideResponse,
            dict,
            guide,
            guideId,
            setActivePageId,
            setPageOperationPending,
        ],
    );

    const handleReorder = useCallback(
        async (event: DragEndEvent) => {
            const { active, over } = event;
            if (!active || !over || active.id === over.id) return;

            const oldIndex = pages.findIndex((page) => page.id === active.id);
            const newIndex = pages.findIndex((page) => page.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return;

            const reordered = arrayMove(pages, oldIndex, newIndex).map(
                (page, index) => ({
                    ...page,
                    orderNumber: index + 1,
                }),
            );

            const previousPages = pages;
            setPages(reordered);
            setReordering(true);

            try {
                await Promise.all(
                    reordered.map((page) =>
                        GuideController.updatePage(guideId, page.id, {
                            content: page.content,
                            orderNumber: page.orderNumber,
                        }),
                    ),
                );

                const refreshedGuide =
                    await GuideController.getGuideById(guideId);
                if (refreshedGuide) {
                    applyGuideResponse(refreshedGuide);
                }
            } catch (error) {
                console.error("Error reordering pages:", error);
                setPages(previousPages);
                alert(
                    dict?.admin?.guides?.editGuide?.pages?.reorderError ||
                        "There was an error reordering the pages. Changes were reverted.",
                );
            } finally {
                setReordering(false);
            }
        },
        [applyGuideResponse, dict, guideId, pages, setPages, setReordering],
    );

    if (!guide) {
        return null;
    }

    return (
        <div className="flex h-full gap-4 p-4">
            <aside className="w-80 flex flex-col gap-4">
                <Button
                    type="button"
                    onClick={handleCreatePage}
                    disabled={isPageOperationPending || isReordering}
                    className="w-full"
                >
                    {isPageOperationPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {dict?.admin?.guides?.editGuide?.pages?.creating ||
                                "Creating page"}
                        </>
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            {dict?.admin?.guides?.editGuide?.pages?.add ||
                                "Add page"}
                        </>
                    )}
                </Button>

                <ScrollArea className="flex-1 rounded-md border bg-card">
                    <div className="p-2 space-y-2">
                        {pages.length === 0 ? (
                            <div className="text-sm text-muted-foreground p-4 text-center">
                                {dict?.admin?.guides?.editGuide?.pages?.empty ||
                                    "No pages yet. Create one to start."}
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleReorder}
                            >
                                <SortableContext
                                    items={pages.map((page) => page.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {pages.map((page, index) => (
                                        <SortablePageItem
                                            key={page.id}
                                            page={page}
                                            index={index}
                                            isActive={page.id === activePageId}
                                            isDisabled={
                                                isPageOperationPending ||
                                                isReordering ||
                                                isSaving ||
                                                (isDeleting &&
                                                    deletingPageId === page.id)
                                            }
                                            onSelect={handleSelectPage}
                                            onDelete={handleDeletePage}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </ScrollArea>
            </aside>

            <section className="flex-1 flex flex-col border rounded-lg">
                {activePage ? (
                    <>
                        <header className="flex items-center justify-between border-b px-4 py-3">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {dict?.admin?.guides?.editGuide?.pages?.title?.replace(
                                        "{number}",
                                        (
                                            pages.findIndex(
                                                (p) => p.id === activePageId,
                                            ) + 1
                                        ).toString(),
                                    ) ||
                                        `Page ${pages.findIndex((p) => p.id === activePageId) + 1}`}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {hasUnsavedChanges ? (
                                        <span className="flex items-center gap-1 text-amber-600">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            {dict?.admin?.guides?.editGuide
                                                ?.pages?.unsaved ||
                                                "Unsaved changes"}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-emerald-600">
                                            <Check className="h-3 w-3" />
                                            {dict?.admin?.guides?.editGuide
                                                ?.pages?.saved ||
                                                "All changes saved"}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isSaving || !hasUnsavedChanges}
                                    onClick={() => {
                                        if (!editorRef.current) return;
                                        editorRef.current.injectMarkdown(
                                            initialContent,
                                        );
                                        draftContentRef.current =
                                            initialContent;
                                        setHasUnsavedChanges(false);
                                    }}
                                >
                                    {dict?.admin?.guides?.editGuide?.pages
                                        ?.discard || "Discard"}
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={isSaving || !hasUnsavedChanges}
                                    onClick={handleSavePage}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {dict?.admin?.guides?.editGuide
                                                ?.pages?.saving || "Saving"}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {dict?.admin?.guides?.editGuide
                                                ?.pages?.save || "Save"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </header>

                        <div
                            ref={editorContainerRef}
                            className="flex-1 overflow-hidden"
                        >
                            <ShadcnTemplate onReady={handleEditorReady} />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                        <Plus className="h-10 w-10" />
                        <div className="space-y-1">
                            <h3 className="text-base font-medium text-foreground">
                                {dict?.admin?.guides?.editGuide?.pages
                                    ?.noSelectionTitle || "No page selected"}
                            </h3>
                            <p className="text-sm">
                                {dict?.admin?.guides?.editGuide?.pages
                                    ?.noSelectionDescription ||
                                    "Select a page from the list or create a new one to start editing."}
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={handleCreatePage}
                            disabled={isPageOperationPending}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {dict?.admin?.guides?.editGuide?.pages?.add ||
                                "Add page"}
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}
