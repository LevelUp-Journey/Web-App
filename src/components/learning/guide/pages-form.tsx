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
import {
	ArrowLeft,
	GripVertical,
	Loader2,
	Plus,
	Save,
	Trash2,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ShadcnTemplate,
	type ShadcnTemplateRef,
} from "@/components/challenges/editor/lexkitEditor";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

// ============================================================================
// TYPES
// ============================================================================

export interface Page {
	id: string;
	content: string;
	orderNumber: number;
}

interface PagesFormProps {
	guideId: string;
	initialPages?: Page[];
	onFinish: () => void;
}

// ============================================================================
// SORTABLE PAGE ITEM COMPONENT
// ============================================================================

function SortablePageItem({
	page,
	displayNumber,
	isActive,
	onSelect,
	onDelete,
	isDeleting,
}: {
	page: Page;
	displayNumber: number;
	isActive: boolean;
	onSelect: (pageId: string) => void;
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
			className={cn(
				"flex items-center gap-3 p-3 border rounded-lg transition-colors cursor-pointer",
				isActive
					? "bg-primary/10 border-primary"
					: "bg-card hover:bg-muted/50",
			)}
			onClick={() => onSelect(page.id)}
		>
			{/* Drag Handle */}
			<div
				{...attributes}
				{...listeners}
				className="cursor-grab active:cursor-grabbing"
				onClick={(e) => e.stopPropagation()}
			>
				<GripVertical className="h-4 w-4 text-muted-foreground" />
			</div>

			{/* Position Badge */}
			<div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
				{displayNumber}
			</div>

			{/* Page Info */}
			<div className="flex-1 min-w-0">
				<h4 className="font-medium text-sm truncate">Page {displayNumber}</h4>
				<p className="text-xs text-muted-foreground line-clamp-1">
					{page.content
						? page.content.substring(0, 50) +
							(page.content.length > 50 ? "..." : "")
						: "Empty page"}
				</p>
			</div>

			{/* Delete Button */}
			<Button
				size="sm"
				variant="ghost"
				onClick={(e) => {
					e.stopPropagation();
					onDelete(page.id);
				}}
				disabled={isDeleting}
				className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
			>
				{isDeleting ? (
					<Loader2 className="h-3 w-3 animate-spin" />
				) : (
					<Trash2 className="h-3 w-3" />
				)}
			</Button>
		</div>
	);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PagesForm({
	guideId,
	initialPages = [],
	onFinish,
}: PagesFormProps) {
	// Estado principal: solo páginas REALES guardadas
	const [pages, setPages] = useState<Page[]>(initialPages);

	// ID de la página actualmente seleccionada
	const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

	// Loading states
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
	const [reordering, setReordering] = useState(false);

	// Editor state
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [editorMethods, setEditorMethods] =
		useState<ShadcnTemplateRef | null>(null);
	const initialContentRef = useRef<string>("");

	// Drag and drop sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Get selected page object
	const selectedPage = pages.find((p) => p.id === selectedPageId) || null;

	// ========================================================================
	// EFFECTS
	// ========================================================================

	// Auto-select first page on mount
	useEffect(() => {
		if (pages.length > 0 && !selectedPageId) {
			setSelectedPageId(pages[0].id);
		}
	}, [pages, selectedPageId]);

	// Load content into editor when selection changes
	useEffect(() => {
		if (selectedPage && editorMethods) {
			initialContentRef.current = selectedPage.content;
			editorMethods.injectMarkdown(selectedPage.content || "");
			setHasUnsavedChanges(false);
		}
	}, [selectedPage, editorMethods]);

	// ========================================================================
	// HANDLERS
	// ========================================================================

	const handleEditorReady = useCallback((methods: ShadcnTemplateRef) => {
		setEditorMethods(methods);
	}, []);

	const handleContentChange = useCallback(() => {
		if (editorMethods && selectedPage) {
			const currentContent = editorMethods.getMarkdown();
			if (currentContent !== initialContentRef.current) {
				setHasUnsavedChanges(true);
			}
		}
	}, [editorMethods, selectedPage]);

	/**
	 * CREATE NEW PAGE
	 * Crea la página inmediatamente en el backend y la agrega al estado
	 */
	const handleCreateNewPage = async () => {
		if (hasUnsavedChanges) {
			if (
				!confirm(
					"You have unsaved changes. Do you want to discard them and create a new page?",
				)
			) {
				return;
			}
		}

		setSaving(true);
		try {
			// Calcular el siguiente orderNumber
			const nextOrderNumber = pages.length > 0 
				? Math.max(...pages.map((p) => p.orderNumber)) + 1 
				: 1;

			// Crear página en el backend
			const response = await GuideController.createPage(guideId, {
				content: "# New Page\n\nStart writing your content here...",
				orderNumber: nextOrderNumber,
			});

			console.log("Created page response:", response);

			// El backend puede devolver GuideResponse o PageResponse directamente
			// Manejar ambos casos
			let newPageData: Page | null = null;

			if ("pages" in response && Array.isArray(response.pages)) {
				// Es un GuideResponse con array de pages
				const newPage = response.pages.find(
					(p) => p.order === nextOrderNumber,
				);
				if (newPage) {
					newPageData = {
						id: newPage.id,
						content: newPage.content,
						orderNumber: newPage.order,
					};
				}
			} else if ("id" in response && "content" in response) {
				// Es un PageResponse directo
				const pageResponse = response as any;
				newPageData = {
					id: pageResponse.id,
					content: pageResponse.content,
					orderNumber: pageResponse.orderNumber || pageResponse.order || nextOrderNumber,
				};
			}

			if (newPageData) {
				// Agregar al estado (sin duplicados)
				setPages((prev) => {
					// Verificar que no exista ya
					if (prev.some((p) => p.id === newPageData.id)) {
						return prev;
					}
					return [...prev, newPageData].sort(
						(a, b) => a.orderNumber - b.orderNumber,
					);
				});

				// Seleccionar la nueva página
				setSelectedPageId(newPageData.id);
				setHasUnsavedChanges(false);
			} else {
				console.error("Could not extract page data from response:", response);
				alert("Page created but could not be loaded. Please refresh.");
			}
		} catch (error) {
			console.error("Error creating page:", error);
			alert("Error creating page. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	/**
	 * SAVE CURRENT PAGE
	 * Actualiza el contenido de la página seleccionada
	 */
	const handleSavePage = async () => {
		if (!selectedPage || !editorMethods) {
			return;
		}

		const markdownContent = editorMethods.getMarkdown();
		if (!markdownContent || markdownContent.trim() === "") {
			alert("Content cannot be empty");
			return;
		}

		setSaving(true);
		try {
			await GuideController.updatePage(guideId, selectedPage.id, {
				content: markdownContent,
				order: selectedPage.orderNumber,
			});

			// Actualizar en el estado local
			setPages((prev) =>
				prev.map((p) =>
					p.id === selectedPage.id ? { ...p, content: markdownContent } : p,
				),
			);

			setHasUnsavedChanges(false);
			initialContentRef.current = markdownContent;
		} catch (error) {
			console.error("Error saving page:", error);
			alert("Error saving page. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	/**
	 * SELECT PAGE
	 * Cambia la página seleccionada (con confirmación si hay cambios sin guardar)
	 */
	const handleSelectPage = (pageId: string) => {
		if (pageId === selectedPageId) return;

		if (hasUnsavedChanges) {
			if (
				!confirm("You have unsaved changes. Do you want to discard them?")
			) {
				return;
			}
		}

		setSelectedPageId(pageId);
		setHasUnsavedChanges(false);
	};

	/**
	 * DELETE PAGE
	 * Elimina la página y reordena las restantes
	 */
	const handleDeletePage = async (pageId: string) => {
		const page = pages.find((p) => p.id === pageId);
		if (!page) return;

		if (
			!confirm(
				`Are you sure you want to delete Page ${page.orderNumber}? This action cannot be undone.`,
			)
		) {
			return;
		}

		setDeletingPageId(pageId);
		setDeleting(true);

		try {
			// Eliminar del backend
			await GuideController.deletePage({
				pageId: pageId,
				guideId: guideId,
			});

			// Obtener páginas restantes y reordenar
			const remainingPages = pages
				.filter((p) => p.id !== pageId)
				.map((p, index) => ({
					...p,
					orderNumber: index + 1,
				}));

			// Actualizar orderNumber en el backend para todas las páginas restantes
			for (const p of remainingPages) {
				await GuideController.updatePage(guideId, p.id, {
					content: p.content,
					order: p.orderNumber,
				});
			}

			// Actualizar estado local
			setPages(remainingPages);

			// Si la página eliminada estaba seleccionada, seleccionar otra
			if (selectedPageId === pageId) {
				setSelectedPageId(
					remainingPages.length > 0 ? remainingPages[0].id : null,
				);
				setHasUnsavedChanges(false);
			}
		} catch (error) {
			console.error("Error deleting page:", error);
			alert("Error deleting page. Please try again.");
		} finally {
			setDeleting(false);
			setDeletingPageId(null);
		}
	};

	/**
	 * DRAG END (Reorder pages)
	 * Reordena las páginas mediante drag & drop
	 */
	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = pages.findIndex((p) => p.id === active.id);
		const newIndex = pages.findIndex((p) => p.id === over.id);

		if (oldIndex === -1 || newIndex === -1) {
			return;
		}

		// Reordenar localmente primero para UX instantánea
		const reorderedPages = arrayMove(pages, oldIndex, newIndex);

		// Actualizar orderNumber basado en nueva posición
		const updatedPages = reorderedPages.map((page, index) => ({
			...page,
			orderNumber: index + 1,
		}));

		setPages(updatedPages);
		setReordering(true);

		try {
			// Actualizar en el backend
			for (const page of updatedPages) {
				await GuideController.updatePage(guideId, page.id, {
					content: page.content,
					order: page.orderNumber,
				});
			}
		} catch (error) {
			console.error("Error reordering pages:", error);
			alert("Error reordering pages. Please refresh the page.");
			// Revertir el cambio local
			setPages(pages);
		} finally {
			setReordering(false);
		}
	};

	/**
	 * DISCARD CHANGES
	 * Descarta los cambios no guardados y recarga el contenido original
	 */
	const handleDiscardChanges = () => {
		if (
			hasUnsavedChanges &&
			confirm("Are you sure you want to discard your changes?")
		) {
			if (selectedPage && editorMethods) {
				editorMethods.injectMarkdown(initialContentRef.current);
				setHasUnsavedChanges(false);
			}
		}
	};

	// ========================================================================
	// RENDER
	// ========================================================================

	return (
		<div className="h-full flex">
			{/* Left Sidebar - Pages List */}
			<div className="w-80 border-r flex flex-col bg-muted/20">
				{/* Header */}
				<div className="p-4 border-b">
					<h3 className="font-semibold">Pages</h3>
					<p className="text-xs text-muted-foreground mt-1">
						{pages.length} page{pages.length !== 1 ? "s" : ""}
					</p>
				</div>

				{/* Add Page Button */}
				<div className="p-4">
					<Button
						onClick={handleCreateNewPage}
						disabled={saving || deleting || reordering}
						className="w-full"
						size="sm"
					>
						{saving ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Creating...
							</>
						) : (
							<>
								<Plus className="h-4 w-4 mr-2" />
								Add Page
							</>
						)}
					</Button>
				</div>

				{/* Pages List */}
				<ScrollArea className="flex-1 px-4">
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
								<div className="space-y-2 pb-4">
									{pages.map((page) => (
										<SortablePageItem
											key={page.id}
											page={page}
											displayNumber={page.orderNumber}
											isActive={selectedPageId === page.id}
											onSelect={handleSelectPage}
											onDelete={handleDeletePage}
											isDeleting={deleting && deletingPageId === page.id}
										/>
									))}
								</div>
							</SortableContext>
						</DndContext>
					) : (
						<div className="text-center py-12">
							<p className="text-sm text-muted-foreground">No pages yet</p>
							<p className="text-xs text-muted-foreground mt-1">
								Click "Add Page" to get started
							</p>
						</div>
					)}
				</ScrollArea>

				{/* Footer */}
				<div className="p-4 border-t">
					<Button
						onClick={onFinish}
						disabled={saving || deleting || hasUnsavedChanges || reordering}
						variant="outline"
						className="w-full"
						size="sm"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Done
					</Button>
					{hasUnsavedChanges && (
						<p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center">
							You have unsaved changes
						</p>
					)}
					{reordering && (
						<p className="text-xs text-blue-600 dark:text-blue-400 mt-2 text-center">
							Reordering pages...
						</p>
					)}
				</div>
			</div>

			{/* Right Content - Editor */}
			<div className="flex-1 flex flex-col">
				{selectedPage ? (
					<>
						{/* Editor Header */}
						<div className="p-4 border-b bg-background flex items-center justify-between">
							<div>
								<h3 className="font-semibold">
									Page {selectedPage.orderNumber}
								</h3>
								<p className="text-xs text-muted-foreground mt-0.5">
									Write your content in Markdown format
								</p>
							</div>

							<div className="flex items-center gap-2">
								{hasUnsavedChanges && (
									<Button
										variant="ghost"
										size="sm"
										onClick={handleDiscardChanges}
										disabled={saving}
									>
										<X className="h-4 w-4 mr-2" />
										Discard
									</Button>
								)}
								<Button
									onClick={handleSavePage}
									disabled={saving || !hasUnsavedChanges}
									size="sm"
								>
									{saving ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="h-4 w-4 mr-2" />
											Save Page
										</>
									)}
								</Button>
							</div>
						</div>

						{/* Editor */}
						<div
							className="flex-1 overflow-hidden"
							onClick={handleContentChange}
							onKeyDown={handleContentChange}
						>
							<ShadcnTemplate
								key={selectedPageId || "no-page"}
								onReady={handleEditorReady}
							/>
						</div>
					</>
				) : (
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center space-y-4">
							<div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
								<Plus className="h-8 w-8 text-muted-foreground" />
							</div>
							<div>
								<h3 className="font-semibold text-lg">No page selected</h3>
								<p className="text-sm text-muted-foreground mt-1">
									Select a page from the left or create a new one
								</p>
							</div>
							<Button onClick={handleCreateNewPage} size="sm" disabled={saving}>
								{saving ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									<>
										<Plus className="h-4 w-4 mr-2" />
										Add First Page
									</>
								)}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
