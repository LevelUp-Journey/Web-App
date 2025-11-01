"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    ShadcnTemplate,
    type ShadcnTemplateRef,
} from "@/components/challenges/editor/lexkitEditor";
import { CoverDropzone } from "@/components/learning/cover-dropzone";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { CreateGuideRequest } from "@/services/internal/learning/guides/controller/guide.response";
import { TopicController } from "@/services/internal/learning/topics/topic.controller";
import type { TopicResponse } from "@/services/internal/learning/topics/topic.response";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    cover: z.string().optional(),
    topicIds: z.array(z.string()).min(1, "At least one topic is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateGuidePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [topicSearchQuery, setTopicSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<TopicResponse[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState<TopicResponse[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showCreateTopicDialog, setShowCreateTopicDialog] = useState(false);
    const [creatingTopic, setCreatingTopic] = useState(false);
    const [newTopicName, setNewTopicName] = useState("");
    const editorRef = useRef<ShadcnTemplateRef>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const PATHS = useLocalizedPaths();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            cover: "",
            topicIds: [],
        },
    });

    const handleSearchTopics = async () => {
        if (!topicSearchQuery.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setSearching(true);
        try {
            const results = await TopicController.searchTopicsByName({
                name: topicSearchQuery,
            });

            console.log("RESUTLADOS DE TOPICS ", results);

            // Filter results case-insensitively
            const normalizedQuery = topicSearchQuery.toLowerCase();
            const filteredResults = results.filter((topic) =>
                topic.name.toLowerCase().includes(normalizedQuery),
            );

            setSearchResults(filteredResults);
            setShowSearchResults(true);
        } catch (error) {
            console.error("Error searching topics:", error);
            setSearchResults([]);
            setShowSearchResults(true);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectTopic = (topic: TopicResponse) => {
        // Check if topic is already selected
        if (!selectedTopics.find((t) => t.id === topic.id)) {
            const newSelectedTopics = [...selectedTopics, topic];
            setSelectedTopics(newSelectedTopics);
            form.setValue(
                "topicIds",
                newSelectedTopics.map((t) => t.id),
            );
        }
        // Clear search
        setTopicSearchQuery("");
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const handleRemoveTopic = (topicId: string) => {
        const newSelectedTopics = selectedTopics.filter(
            (t) => t.id !== topicId,
        );
        setSelectedTopics(newSelectedTopics);
        form.setValue(
            "topicIds",
            newSelectedTopics.map((t) => t.id),
        );
    };

    const handleTopicSearchKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearchTopics();
        }
    };

    const handleOpenCreateTopicDialog = () => {
        setNewTopicName(topicSearchQuery);
        setShowCreateTopicDialog(true);
        setShowSearchResults(false);
    };

    const handleCreateTopic = async () => {
        if (!newTopicName.trim()) return;

        setCreatingTopic(true);
        try {
            const newTopic = await TopicController.createTopic({
                name: newTopicName.trim(),
            });

            // Add the newly created topic to selected topics
            const newSelectedTopics = [...selectedTopics, newTopic];
            setSelectedTopics(newSelectedTopics);
            form.setValue(
                "topicIds",
                newSelectedTopics.map((t) => t.id),
            );

            // Clear states and close dialog
            setNewTopicName("");
            setTopicSearchQuery("");
            setShowCreateTopicDialog(false);
        } catch (error) {
            console.error("Error creating topic:", error);
        } finally {
            setCreatingTopic(false);
        }
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        try {
            const editor = editorRef.current;
            if (!editor) throw new Error("Editor not initialized");

            const markdownContent = editor.getMarkdown();
            if (!markdownContent || markdownContent.trim() === "") {
                throw new Error("Content cannot be empty");
            }

            const userId = await AuthController.getUserId();

            const request: CreateGuideRequest = {
                title: data.title,
                description: markdownContent,
                coverImage: data.cover || "",
                authorIds: [userId],
                topicIds: data.topicIds,
            };

            console.log("CREATING GUIDE REQUEST", request);
            const response = await GuideController.createGuide(request);

            console.log("GUIDE CREATED:", response);
            router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT);
        } catch (error) {
            console.error("Error creating guide:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <section className="flex flex-col h-full">
                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    <ResizablePanel defaultSize={40} minSize={30}>
                        <div className="h-full overflow-y-auto p-3">
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="title"
                                        className="text-sm font-medium"
                                    >
                                        Title *
                                    </Label>
                                    <Input
                                        id="title"
                                        {...form.register("title")}
                                        placeholder="Enter guide title"
                                        className="w-full"
                                    />
                                    {form.formState.errors.title && (
                                        <p className="text-sm text-red-500">
                                            {
                                                form.formState.errors.title
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Cover Image */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Cover Image
                                    </Label>
                                    <CoverDropzone
                                        onImageUrlChange={(url) =>
                                            form.setValue("cover", url)
                                        }
                                        currentImage={form.watch("cover")}
                                        disabled={saving}
                                        aspectRatio="wide"
                                    />
                                    {form.formState.errors.cover && (
                                        <p className="text-sm text-red-500">
                                            {
                                                form.formState.errors.cover
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Topics Search */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="topicSearch"
                                        className="text-sm font-medium"
                                    >
                                        Topics *
                                    </Label>
                                    <div
                                        className="relative"
                                        ref={searchContainerRef}
                                    >
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="topicSearch"
                                                    value={topicSearchQuery}
                                                    onChange={(e) =>
                                                        setTopicSearchQuery(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={
                                                        handleTopicSearchKeyDown
                                                    }
                                                    onFocus={() => {
                                                        if (
                                                            searchResults.length >
                                                            0
                                                        ) {
                                                            setShowSearchResults(
                                                                true,
                                                            );
                                                        }
                                                    }}
                                                    placeholder="Search topics by name..."
                                                    className="pl-9"
                                                    disabled={saving}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={handleSearchTopics}
                                                disabled={
                                                    !topicSearchQuery.trim() ||
                                                    searching ||
                                                    saving
                                                }
                                                variant="outline"
                                            >
                                                {searching ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    "Search"
                                                )}
                                            </Button>
                                        </div>

                                        {/* Search Results Dropdown */}
                                        {showSearchResults &&
                                            searchResults.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                    {searchResults.map(
                                                        (topic) => {
                                                            const isSelected =
                                                                selectedTopics.find(
                                                                    (t) =>
                                                                        t.id ===
                                                                        topic.id,
                                                                );
                                                            return (
                                                                <button
                                                                    key={
                                                                        topic.id
                                                                    }
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleSelectTopic(
                                                                            topic,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !!isSelected
                                                                    }
                                                                    className={`w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between ${
                                                                        isSelected
                                                                            ? "opacity-50 cursor-not-allowed"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium truncate">
                                                                            {
                                                                                topic.name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    {isSelected && (
                                                                        <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
                                                                    )}
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            )}

                                        {/* No Results - Create New Topic Option */}
                                        {showSearchResults &&
                                            searchResults.length === 0 &&
                                            !searching &&
                                            topicSearchQuery.trim() && (
                                                <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg p-4">
                                                    <p className="text-sm text-muted-foreground text-center mb-3">
                                                        No topics found for
                                                        &quot;
                                                        {topicSearchQuery}&quot;
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        onClick={
                                                            handleOpenCreateTopicDialog
                                                        }
                                                        variant="outline"
                                                        className="w-full"
                                                        size="sm"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Create new topic &quot;
                                                        {topicSearchQuery}&quot;
                                                    </Button>
                                                </div>
                                            )}
                                    </div>

                                    {/* Selected Topics */}
                                    {selectedTopics.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedTopics.map((topic) => (
                                                <div
                                                    key={topic.id}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm border border-primary/20"
                                                >
                                                    <span className="font-medium">
                                                        {topic.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveTopic(
                                                                topic.id,
                                                            )
                                                        }
                                                        className="hover:bg-primary/20 rounded-full p-1 transition-colors"
                                                        disabled={saving}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {form.formState.errors.topicIds && (
                                        <p className="text-sm text-red-500">
                                            {
                                                form.formState.errors.topicIds
                                                    .message
                                            }
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Search and select at least one topic for
                                        this guide
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.push(
                                                PATHS.DASHBOARD.ADMINISTRATION
                                                    .GUIDES.ROOT,
                                            )
                                        }
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Guide"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={60} maxSize={70} minSize={30}>
                        <div className="h-full overflow-y-auto border-l">
                            <ShadcnTemplate ref={editorRef} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </section>

            {/* Create Topic Dialog */}
            <Dialog
                open={showCreateTopicDialog}
                onOpenChange={setShowCreateTopicDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Topic</DialogTitle>
                        <DialogDescription>
                            Add a new topic to the system. The topic will be
                            automatically added to your guide after creation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newTopicName">Topic Name *</Label>
                            <Input
                                id="newTopicName"
                                value={newTopicName}
                                onChange={(e) =>
                                    setNewTopicName(e.target.value)
                                }
                                placeholder="Enter topic name (e.g., JavaScript, Python, React)"
                                disabled={creatingTopic}
                            />
                            <p className="text-xs text-muted-foreground">
                                The topic will be available for all guides in
                                the system.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCreateTopicDialog(false)}
                            disabled={creatingTopic}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreateTopic}
                            disabled={!newTopicName.trim() || creatingTopic}
                        >
                            {creatingTopic ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Topic
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
