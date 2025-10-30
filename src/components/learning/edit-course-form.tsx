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
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CoverDropzone } from "@/components/learning/cover-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import {
    CourseDifficulty,
    type CourseGuideFullResponse,
    type UpdateCourseRequest,
} from "@/services/internal/learning/courses/controller/course.response";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";

const formSchema = z.object({
    title: z.string().min(5, "Title is required"),
    description: z.string().optional(),
    difficulty: z.enum(CourseDifficulty),
    completionScore: z.number().min(0, "Completion score must be positive"),
    cover: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditCourseFormProps {
    course: Course;
}

// Sortable Guide Item Component
function SortableGuideItem({
    guide,
    index,
    onRemove,
}: {
    guide: CourseGuideFullResponse;
    index: number;
    onRemove: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: guide.id });

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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                {index + 1}
            </div>

            {/* Guide Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{guide.title}</h4>
                <p className="text-xs text-muted-foreground">
                    {guide.totalLikes} likes • Position: {guide.position}
                </p>
            </div>

            {/* Actions */}
            <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemove(guide.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

export function EditCourseForm({ course }: EditCourseFormProps) {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    const [saving, setSaving] = useState(false);
    const [guideSearchQuery, setGuideSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<GuideResponse[]>([]);
    const [searching, setSearching] = useState(false);
    const [currentGuides, setCurrentGuides] = useState<
        CourseGuideFullResponse[]
    >([]);
    const [loadingGuides, setLoadingGuides] = useState(true);
    const debouncedSearchQuery = useDebounce(guideSearchQuery, 500);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: course.title,
            description: course.description,
            difficulty: course.difficulty,
            completionScore: course.completionScore,
            cover: course.cover,
        },
    });

    // Load current guides
    useEffect(() => {
        const loadGuides = async () => {
            try {
                const guides =
                    await CourseController.getCourseGuidesFullByCourseId(
                        course.id,
                    );
                setCurrentGuides(guides);
            } catch (error) {
                console.error("Error loading guides:", error);
            } finally {
                setLoadingGuides(false);
            }
        };
        loadGuides();
    }, [course.id]);

    // Search guides with debounce
    useEffect(() => {
        const searchGuides = async () => {
            if (!debouncedSearchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setSearching(true);
            try {
                const allGuides = await GuideController.getAllGuides();
                // Filter guides by name
                const filtered = allGuides.filter((guide) =>
                    guide.title
                        .toLowerCase()
                        .includes(debouncedSearchQuery.toLowerCase()),
                );
                setSearchResults(filtered);
            } catch (error) {
                console.error("Error searching guides:", error);
            } finally {
                setSearching(false);
            }
        };

        searchGuides();
    }, [debouncedSearchQuery]);

    const handleAddGuide = async (guide: GuideResponse) => {
        try {
            // Calculate next position
            const nextPosition =
                currentGuides.length > 0
                    ? Math.max(...currentGuides.map((g) => g.position)) + 1
                    : 0;

            await CourseController.addGuideToCourse(course.id, {
                guideId: guide.id,
                position: nextPosition,
            });

            // Reload guides
            const updatedGuides =
                await CourseController.getCourseGuidesFullByCourseId(course.id);
            setCurrentGuides(updatedGuides);
            setGuideSearchQuery("");
            setSearchResults([]);
        } catch (error) {
            console.error("Error adding guide:", error);
        }
    };

    const handleRemoveGuide = async (guideId: string) => {
        // TODO: Implement remove guide endpoint
        console.log("Remove guide:", guideId);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = currentGuides.findIndex((g) => g.id === active.id);
            const newIndex = currentGuides.findIndex((g) => g.id === over.id);

            const reorderedGuides = arrayMove(
                currentGuides,
                oldIndex,
                newIndex,
            );

            // Update positions
            const updatedGuides = reorderedGuides.map((guide, index) => ({
                ...guide,
                position: index,
            }));

            setCurrentGuides(updatedGuides);

            // Persist the new position in the backend
            try {
                await CourseController.reorderCourseGuide(course.id, {
                    guideId: active.id as string,
                    newPosition: newIndex,
                });
                console.log("Guide reordered successfully");
            } catch (error) {
                console.error("Error updating guide order:", error);
                // Revert on error
                setCurrentGuides(currentGuides);
            }
        }
    };

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        try {
            await CourseController.updateCourse(
                course.id,
                data as UpdateCourseRequest,
            );
            router.push(PATHS.DASHBOARD.COURSES.VIEW(course.id));
        } catch (error) {
            console.error("Error updating course:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Save Button Fixed at Top */}
            <div className="flex justify-end sticky top-0 bg-background z-10 pb-4">
                <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="details">Course Details</TabsTrigger>
                    <TabsTrigger value="guides">Manage Guides</TabsTrigger>
                </TabsList>

                {/* Tab 1: Course Details */}
                <TabsContent value="details" className="space-y-6 mt-6">
                    <form className="space-y-8">
                        {/* Cover Image */}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-base font-semibold">
                                    Cover Image
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Upload a cover image for your course
                                    (recommended: 1280x720px)
                                </p>
                            </div>
                            <CoverDropzone
                                onImageUrlChange={(url) =>
                                    form.setValue("cover", url)
                                }
                                currentImage={form.watch("cover")}
                                disabled={saving}
                                aspectRatio="wide"
                            />
                        </div>

                        <Separator />

                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-4">
                                    Basic Information
                                </h2>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Course Title *</Label>
                                <Input
                                    id="title"
                                    {...form.register("title")}
                                    placeholder="e.g., Introduction to React"
                                />
                                {form.formState.errors.title && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    {...form.register("description")}
                                    placeholder="Describe what students will learn in this course..."
                                    className="min-h-[120px] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">
                                        Difficulty Level *
                                    </Label>
                                    <Select
                                        value={form.watch("difficulty")}
                                        onValueChange={(value) =>
                                            form.setValue(
                                                "difficulty",
                                                value as CourseDifficulty,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BEGINNER">
                                                Beginner
                                            </SelectItem>
                                            <SelectItem value="INTERMEDIATE">
                                                Intermediate
                                            </SelectItem>
                                            <SelectItem value="ADVANCED">
                                                Advanced
                                            </SelectItem>
                                            <SelectItem value="EXPERT">
                                                Expert
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="completionScore">
                                        Completion Score *
                                    </Label>
                                    <Input
                                        id="completionScore"
                                        type="number"
                                        {...form.register("completionScore", {
                                            valueAsNumber: true,
                                        })}
                                        placeholder="100"
                                    />
                                    {form.formState.errors.completionScore && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors
                                                    .completionScore.message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </TabsContent>

                {/* Tab 2: Manage Guides */}
                <TabsContent value="guides" className="space-y-6 mt-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Course Guides
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Add and manage guides for this course
                                </p>
                            </div>
                        </div>

                        {/* Guide Search */}
                        <div className="border rounded-lg p-6 bg-muted/50">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-muted-foreground" />
                                    <h3 className="font-medium">
                                        Add Guide to Course
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guide-search">
                                        Search for guides
                                    </Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="guide-search"
                                            type="search"
                                            placeholder="Search guides by name..."
                                            className="pl-9"
                                            value={guideSearchQuery}
                                            onChange={(e) =>
                                                setGuideSearchQuery(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {searching && (
                                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Type to search for existing guides to
                                        add to this course
                                    </p>
                                </div>

                                {/* Search Results */}
                                {guideSearchQuery && (
                                    <div className="border rounded-md bg-background max-h-[300px] overflow-y-auto">
                                        {searching ? (
                                            <div className="p-4 text-center">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="divide-y">
                                                {searchResults.map((guide) => {
                                                    const isAlreadyAdded =
                                                        currentGuides.some(
                                                            (g) =>
                                                                g.id ===
                                                                guide.id,
                                                        );
                                                    return (
                                                        <div
                                                            key={guide.id}
                                                            className="p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-sm truncate">
                                                                    {
                                                                        guide.title
                                                                    }
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        guide.totalLikes
                                                                    }{" "}
                                                                    likes
                                                                </p>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                variant={
                                                                    isAlreadyAdded
                                                                        ? "ghost"
                                                                        : "default"
                                                                }
                                                                onClick={() =>
                                                                    handleAddGuide(
                                                                        guide,
                                                                    )
                                                                }
                                                                disabled={
                                                                    isAlreadyAdded
                                                                }
                                                            >
                                                                {isAlreadyAdded ? (
                                                                    "Added"
                                                                ) : (
                                                                    <>
                                                                        <Plus className="h-3 w-3 mr-1" />
                                                                        Add
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    No guides found
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Current Guides List */}
                        <div className="space-y-4">
                            <Separator />
                            <div>
                                <h3 className="font-medium mb-2">
                                    Current Guides ({currentGuides.length})
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Drag to reorder • Guides are shown in order
                                </p>
                            </div>

                            {loadingGuides ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-16 w-full"
                                        />
                                    ))}
                                </div>
                            ) : currentGuides.length === 0 ? (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No guides added yet. Use the search
                                        above to add guides.
                                    </p>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={currentGuides.map((g) => g.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-2">
                                            {currentGuides
                                                .sort(
                                                    (a, b) =>
                                                        a.position - b.position,
                                                )
                                                .map((guide, index) => (
                                                    <SortableGuideItem
                                                        key={guide.id}
                                                        guide={guide}
                                                        index={index}
                                                        onRemove={
                                                            handleRemoveGuide
                                                        }
                                                    />
                                                ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export function EditCourseSkeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-32 ml-auto" />
        </div>
    );
}
