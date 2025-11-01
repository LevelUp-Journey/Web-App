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
import { GripVertical, Loader2, Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import {
    ShadcnTemplate,
    type ShadcnTemplateRef,
} from "@/components/challenges/editor/lexkitEditor";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

export interface PageData {
    id: string;
    content: string;
    order: number;
    isNew?: boolean;
}

interface PagesFormProps {
    guideId: string;
    initialPages?: PageData[];
    onFinish: () => void;
    onBack: () => void;
}

function SortablePageItem({
    page,
    index,
    onEdit,
    onDelete,
    isDeleting,
}: {
    page: PageData;
    index: number;
    onEdit: (page: PageData) => void;
    onDelete: (pageId: string) => void;
    isDeleting: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: page.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Position Badge */}
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                {index + 1}
            </div>

            {/* Page Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">Page {index + 1}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {page.content
                        ? page.content.substring(0, 100) +
                          (page.content.length > 100 ? "..." : "")
                        : "No content"}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(page)}
                    disabled={isDeleting}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(page.id)}
                    disabled={isDeleting}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}

export function PagesForm({
    guideId,
    initialPages = [],
    onFinish,
    onBack,
}: PagesFormProps) {
    const [pages, setPages] = useState<PageData[]>(initialPages);
    const [showEditor, setShowEditor] = useState(false);
    const [editingPage, setEditingPage] = useState<PageData | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
    const editorRef = useRef<ShadcnTemplateRef>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = pages.findIndex((p) => p.id === active.id);
            const newIndex = pages.findIndex((p) => p.id === over.id);

            const reorderedPages = arrayMove(pages, oldIndex, newIndex);

            // Update order numbers
            const updatedPages = reorderedPages.map((page, index) => ({
                ...page,
                order: index,
            }));

            setPages(updatedPages);

            // Update order in backend for existing pages
            try {
                for (const page of updatedPages) {
                    if (!page.isNew) {
                        await GuideController.updatePage(guideId, page.id, {
                            content: page.content,
                            order: page.order,
                        });
                    }
                }
            } catch (error) {
                console.error("Error updating page order:", error);
            }
        }
    };

    const handleAddPage = () => {
        setEditingPage({
            id: `temp-${Date.now()}`,
            content: "",
            order: pages.length,
            isNew: true,
        });
        setShowEditor(true);
    };

    const handleEditPage = (page: PageData) => {
        setEditingPage(page);
        setShowEditor(true);
        // Note: Editor will need to be initialized with the content
        // The ShadcnTemplate component doesn't expose setMarkdown
        // Content should be set via component props or initial state
    };

    const handleSavePage = async () => {
        if (!editingPage) return;

        const editor = editorRef.current;
        if (!editor) {
            console.error("Editor not initialized");
            return;
        }

        const markdownContent = editor.getMarkdown();
        if (!markdownContent || markdownContent.trim() === "") {
            alert("Content cannot be empty");
            return;
        }

        setSaving(true);
        try {
            if (editingPage.isNew) {
                // Create new page
                const response = await GuideController.createPage(guideId, {
                    content: markdownContent,
                    order: editingPage.order,
                });

                // Update pages list with the new page from response
                const newPage =
                    response.pages.find((p) => p.order === editingPage.order) ||
                    response.pages[response.pages.length - 1];

                if (newPage) {
                    setPages((prev) =>
                        prev
                            .filter((p) => p.id !== editingPage.id)
                            .concat({
                                id: newPage.id,
                                content: newPage.content,
                                order: newPage.order,
                                isNew: false,
                            })
                            .sort((a, b) => a.order - b.order),
                    );
                }
            } else {
                // Update existing page
                await GuideController.updatePage(guideId, editingPage.id, {
                    content: markdownContent,
                    order: editingPage.order,
                });

                setPages((prev) =>
                    prev.map((p) =>
                        p.id === editingPage.id
                            ? { ...p, content: markdownContent }
                            : p,
                    ),
                );
            }

            setShowEditor(false);
            setEditingPage(null);
        } catch (error) {
            console.error("Error saving page:", error);
            alert("Error saving page. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePage = async (pageId: string) => {
        const page = pages.find((p) => p.id === pageId);
        if (!page) return;

        if (!confirm(`Are you sure you want to delete Page ${page.order + 1}?`))
            return;

        setDeletingPageId(pageId);
        setDeleting(true);
        try {
            if (!page.isNew) {
                await GuideController.deletePage({
                    pageId: pageId,
                    guideId: guideId,
                });
            }

            // Remove from list and reorder
            const updatedPages = pages
                .filter((p) => p.id !== pageId)
                .map((p, index) => ({
                    ...p,
                    order: index,
                }));

            setPages(updatedPages);

            // Update order in backend for remaining pages
            for (const p of updatedPages) {
                if (!p.isNew) {
                    await GuideController.updatePage(guideId, p.id, {
                        content: p.content,
                        order: p.order,
                    });
                }
            }
        } catch (error) {
            console.error("Error deleting page:", error);
            alert("Error deleting page. Please try again.");
        } finally {
            setDeleting(false);
            setDeletingPageId(null);
        }
    };

    const handleCloseEditor = () => {
        if (
            editingPage?.isNew ||
            confirm(
                "Are you sure you want to close? Any unsaved changes will be lost.",
            )
        ) {
            setShowEditor(false);
            setEditingPage(null);
        }
    };

    return (
        <>
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Guide Pages</h2>
                        <p className="text-muted-foreground">
                            Add and organize pages for your guide. You can
                            reorder them by dragging.
                        </p>
                    </div>

                    {/* Add Page Button */}
                    <Button
                        onClick={handleAddPage}
                        disabled={saving || deleting}
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Page
                    </Button>

                    {/* Pages List */}
                    {pages.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={pages.map((p) => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {pages.map((page, index) => (
                                        <SortablePageItem
                                            key={page.id}
                                            page={page}
                                            index={index}
                                            onEdit={handleEditPage}
                                            onDelete={handleDeletePage}
                                            isDeleting={
                                                deleting &&
                                                deletingPageId === page.id
                                            }
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground mb-4">
                                No pages yet. Add your first page to get
                                started.
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between p-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        disabled={saving || deleting}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onFinish}
                        disabled={pages.length === 0 || saving || deleting}
                    >
                        Finish & Publish
                    </Button>
                </div>
            </div>

            {/* Page Editor Dialog */}
            <Dialog open={showEditor} onOpenChange={handleCloseEditor}>
                <DialogContent className="max-w-6xl h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPage?.isNew
                                ? "Create New Page"
                                : "Edit Page"}
                        </DialogTitle>
                        <DialogDescription>
                            Write your content in Markdown format. Use the
                            editor below to create rich content.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">
                        <ShadcnTemplate ref={editorRef} />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseEditor}
                            disabled={saving}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onClick={handleSavePage} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Page"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
