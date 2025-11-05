"use client";

import { Check, Loader2, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { TopicController } from "@/services/internal/learning/topics/topic.controller";
import type { TopicResponse } from "@/services/internal/learning/topics/topic.response";

export interface BasicInfoFormData {
    title: string;
    description: string;
    cover?: string;
    topicIds: string[];
}

interface BasicInfoFormProps {
    form: UseFormReturn<BasicInfoFormData>;
    onSubmit: (data: BasicInfoFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    submitButtonText?: string;
    submitButtonLoadingText?: string;
}

export function BasicInfoForm({
    form,
    onSubmit,
    onCancel,
    isSubmitting,
    submitButtonText = "Create Guide",
    submitButtonLoadingText = "Creating Guide...",
}: BasicInfoFormProps) {
    const [topicSearchQuery, setTopicSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<TopicResponse[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState<TopicResponse[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showCreateTopicDialog, setShowCreateTopicDialog] = useState(false);
    const [creatingTopic, setCreatingTopic] = useState(false);
    const [newTopicName, setNewTopicName] = useState("");
    const searchContainerRef = useRef<HTMLDivElement>(null);

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

    const descriptionLength = form.watch("description")?.length || 0;
    const maxDescriptionLength = 1000;

    return (
        <>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 h-full flex flex-col"
            >
                <div className="flex-1 overflow-y-auto space-y-6 px-1">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Title *
                        </Label>
                        <Input
                            id="title"
                            {...form.register("title")}
                            placeholder="Enter guide title"
                            className="w-full"
                            disabled={isSubmitting}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                        >
                            Description *
                        </Label>
                        <Textarea
                            id="description"
                            {...form.register("description")}
                            placeholder="Enter a brief description of your guide (max 1000 characters)"
                            rows={5}
                            maxLength={maxDescriptionLength}
                            className="w-full resize-none"
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center">
                            <div>
                                {form.formState.errors.description && (
                                    <p className="text-sm text-red-500">
                                        {
                                            form.formState.errors.description
                                                .message
                                        }
                                    </p>
                                )}
                            </div>
                            <p
                                className={`text-xs ${
                                    descriptionLength >= maxDescriptionLength
                                        ? "text-red-500 font-medium"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {descriptionLength} / {maxDescriptionLength}
                            </p>
                        </div>
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
                            disabled={isSubmitting}
                            aspectRatio="wide"
                        />
                        {form.formState.errors.cover && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.cover.message}
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
                        <div className="relative" ref={searchContainerRef}>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="topicSearch"
                                        value={topicSearchQuery}
                                        onChange={(e) =>
                                            setTopicSearchQuery(e.target.value)
                                        }
                                        onKeyDown={handleTopicSearchKeyDown}
                                        onFocus={() => {
                                            if (searchResults.length > 0) {
                                                setShowSearchResults(true);
                                            }
                                        }}
                                        placeholder="Search topics by name..."
                                        className="pl-9"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleSearchTopics}
                                    disabled={
                                        !topicSearchQuery.trim() ||
                                        searching ||
                                        isSubmitting
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
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {searchResults.map((topic) => {
                                        const isSelected = selectedTopics.find(
                                            (t) => t.id === topic.id,
                                        );
                                        return (
                                            <button
                                                key={topic.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectTopic(topic)
                                                }
                                                disabled={!!isSelected}
                                                className={`w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between ${
                                                    isSelected
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">
                                                        {topic.name}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* No Results - Create New Topic Option */}
                            {showSearchResults &&
                                searchResults.length === 0 &&
                                !searching &&
                                topicSearchQuery.trim() && (
                                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg p-4">
                                        <p className="text-sm text-muted-foreground text-center mb-3">
                                            No topics found for &quot;
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
                                                handleRemoveTopic(topic.id)
                                            }
                                            className="hover:bg-primary/20 rounded-full p-1 transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {form.formState.errors.topicIds && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.topicIds.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Search and select at least one topic for this guide
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {submitButtonLoadingText}
                            </>
                        ) : (
                            submitButtonText
                        )}
                    </Button>
                </div>
            </form>

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
