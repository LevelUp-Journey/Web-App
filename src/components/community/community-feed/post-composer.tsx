"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/app/[lang]/dictionaries";

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

    const handleShareMessage = useCallback(async () => {
        if (!message.trim()) return;
        try {
            setIsPosting(true);
            setComposerError(null);

            const content = message.trim();
            const title = content.slice(0, 60) || `Message #${community.name}`;

            const response = await fetch("/api/community/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    communityId: community.id,
                    title,
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
    }, [community, dict?.communityFeed?.composerError, message, onPostCreated, updateTextareaHeight]);

    const composerPlaceholder =
        dict?.communityFeed?.composerPlaceholder?.replace(
            "{community}",
            community.name,
        ) || `Message #${community.name}`;

    return (
        <div className="fixed bottom-0 right-0 left-0 md:left-[var(--sidebar-width,0px)] z-40 border-t bg-background/95 px-3 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                <div className="flex-1 space-y-2">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {dict?.communityFeed?.composerTitle ||
                                "Share an update"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {dict?.communityFeed?.composerDescription ||
                                "Messages appear in the community feed for everyone to see."}
                        </p>
                    </div>
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleMessageChange}
                        placeholder={composerPlaceholder}
                        maxLength={MESSAGE_LIMIT}
                        className="min-h-[72px] max-h-[240px] resize-none overflow-auto"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {message.length}/{MESSAGE_LIMIT}
                        </span>
                        {composerError && (
                            <span className="text-destructive">
                                {composerError}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex w-full flex-col items-end gap-2 sm:w-auto">
                    <Button
                        className="w-full sm:w-auto"
                        onClick={handleShareMessage}
                        disabled={isPosting || !message.trim()}
                    >
                        {isPosting && (
                            <Spinner className="mr-2 size-4 text-background" />
                        )}
                        {dict?.communityFeed?.composerButton ||
                            "Send message"}
                    </Button>
                </div>
            </div>
        </div>
    );
}