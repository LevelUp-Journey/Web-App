"use client";

import {
    Bold,
    Code,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Send,
    Strikethrough,
} from "lucide-react";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostComposerProps {
    community: {
        id: string;
        name: string;
    };
    dict: Dictionary;
    onPostCreated: () => void;
}

const MESSAGE_LIMIT = 500;
const COMPOSER_MAX_HEIGHT = 240;

export function PostComposer({
    community,
    dict,
    onPostCreated,
}: PostComposerProps) {
    const [message, setMessage] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [composerError, setComposerError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const updateTextareaHeight = useCallback(() => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, COMPOSER_MAX_HEIGHT);
        textarea.style.height = `${newHeight}px`;
    }, []);

    useEffect(() => {
        updateTextareaHeight();
    }, [updateTextareaHeight]);

    const handleMessageChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            const nextValue = event.target.value.slice(0, MESSAGE_LIMIT);
            setMessage(nextValue);
            requestAnimationFrame(() => {
                updateTextareaHeight();
            });
        },
        [updateTextareaHeight],
    );

    const insertMarkdown = useCallback(
        (before: string, after = "", placeholder = "") => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = message.substring(start, end) || placeholder;
            const newText =
                message.substring(0, start) +
                before +
                selectedText +
                after +
                message.substring(end);

            setMessage(newText);

            // Set cursor position
            setTimeout(() => {
                textarea.focus();
                const newCursorPos =
                    start + before.length + selectedText.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
                updateTextareaHeight();
            }, 0);
        },
        [message, updateTextareaHeight],
    );

    const handleShareMessage = useCallback(async () => {
        if (!message.trim()) return;
        try {
            setIsPosting(true);
            setComposerError(null);

            const content = message.trim();

            const response = await fetch("/api/community/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    communityId: community.id,
                    content,
                }),
            });

            if (!response.ok) {
                let errorMessage =
                    dict?.communityFeed?.composerError ||
                    "We couldn't share your message. Please try again.";
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data?.error) {
                        errorMessage = data.error;
                    }
                } catch {
                    // ignore JSON parsing errors
                }
                throw new Error(errorMessage);
            }

            setMessage("");
            requestAnimationFrame(() => {
                updateTextareaHeight();
            });
            onPostCreated();
        } catch (err) {
            console.error("Error sharing message:", err);
            setComposerError(
                err instanceof Error
                    ? err.message
                    : dict?.communityFeed?.composerError ||
                          "We couldn't share your message. Please try again.",
            );
        } finally {
            setIsPosting(false);
        }
    }, [
        community,
        dict?.communityFeed?.composerError,
        message,
        onPostCreated,
        updateTextareaHeight,
    ]);

    const composerPlaceholder =
        dict?.communityFeed?.composerPlaceholder?.replace(
            "{community}",
            community.name,
        ) || `Message #${community.name}`;

    return (
        <div className="fixed bottom-0 right-0 left-0 md:left-[var(--sidebar-width,0px)] z-40 border-t bg-background px-4 py-3">
            <div className="space-y-2">
                {/* Markdown Toolbar */}
                <TooltipProvider>
                    <div className="flex items-center gap-1 px-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        insertMarkdown("**", "**", "bold text")
                                    }
                                    type="button"
                                >
                                    <Bold className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Bold</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        insertMarkdown("*", "*", "italic text")
                                    }
                                    type="button"
                                >
                                    <Italic className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Italic</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        insertMarkdown(
                                            "~~",
                                            "~~",
                                            "strikethrough",
                                        )
                                    }
                                    type="button"
                                >
                                    <Strikethrough className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Strikethrough</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        insertMarkdown("`", "`", "code")
                                    }
                                    type="button"
                                >
                                    <Code className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Inline code</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        insertMarkdown(
                                            "[",
                                            "](url)",
                                            "link text",
                                        )
                                    }
                                    type="button"
                                >
                                    <LinkIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Link</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        insertMarkdown("- ", "", "list item")
                                    }
                                    type="button"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Bullet list</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                        insertMarkdown("1. ", "", "list item")
                                    }
                                    type="button"
                                >
                                    <ListOrdered className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Numbered list</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>

                {/* Message Input */}
                <div className="flex items-center gap-2 w-full rounded-lg border px-3 py-2">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleMessageChange}
                        placeholder={composerPlaceholder}
                        maxLength={MESSAGE_LIMIT}
                        className="flex-1 min-h-[40px] max-h-[200px] resize-none border-0 bg-transparent dark:bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        rows={1}
                    />
                    <Button
                        size="icon"
                        onClick={handleShareMessage}
                        disabled={isPosting || !message.trim()}
                        className="shrink-0 h-9 w-9"
                    >
                        {isPosting ? (
                            <Spinner className="size-4" />
                        ) : (
                            <Send className="size-4" />
                        )}
                    </Button>
                </div>
                {composerError && (
                    <p className="mt-1 text-xs text-destructive px-3">
                        {composerError}
                    </p>
                )}
            </div>
        </div>
    );
}
