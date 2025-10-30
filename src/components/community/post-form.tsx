"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageUpload from "@/components/ui/image-upload";

interface PostFormProps {
    communityId: string;
    authorId: string;
    authorProfile?: {
        username: string;
        profileUrl?: string;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function PostForm({
    communityId,
    authorId,
    authorProfile,
    onSuccess,
    onCancel,
}: PostFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Please write something");
            return;
        }

        setIsSubmitting(true);

        try {
            const lines = content.split("\n");
            const title = lines[0]?.trim();
            const postContent = lines.slice(1).join("\n").trim();

            if (!title) {
                toast.error("Please add a title");
                return;
            }

            const response = await fetch("/api/community/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    content: postContent || title,
                    communityId,
                    authorId,
                    imageUrl: imageUrl || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => ({ error: "Unknown error" }));
                throw new Error(
                    errorData.error ||
                        `Failed to create post (${response.status})`,
                );
            }

            setContent("");
            setImageUrl("");
            toast.success("Post created successfully!");
            onSuccess?.();
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create post",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-card rounded-xl p-4 w-full shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* User Avatar + Content Flow */}
                <div className="flex gap-3 items-start">
                    <Avatar className="h-10 w-10 flex-shrink-0 mt-1">
                        <AvatarImage src={authorProfile?.profileUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {authorProfile?.username?.charAt(0).toUpperCase() ||
                                "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <input
                            type="text"
                            value={content.split("\n")[0] || ""}
                            onChange={(e) => {
                                const lines = content.split("\n");
                                lines[0] = e.target.value;
                                setContent(lines.join("\n"));
                            }}
                            placeholder="What's the title?"
                            className="w-full px-0 py-2 bg-transparent border-0 focus-visible:ring-0 text-lg font-semibold placeholder:text-muted-foreground/60 resize-none outline-none"
                            disabled={isSubmitting}
                        />

                        <Textarea
                            value={content.split("\n").slice(1).join("\n")}
                            onChange={(e) => {
                                const title = content.split("\n")[0] || "";
                                setContent(title + "\n" + e.target.value);
                            }}
                            placeholder="Share your thoughts..."
                            className="w-full min-h-[100px] resize-none border-0 focus-visible:ring-0 bg-transparent text-base leading-relaxed placeholder:text-muted-foreground/60 outline-none"
                            disabled={isSubmitting}
                        />

                        {/* Options Row - Facebook-style */}
                        <div className="flex items-center gap-2 pt-3 border-t border-border/30">
                            <ImageUpload
                                value={imageUrl}
                                onChange={(url) => setImageUrl(url || "")}
                                disabled={isSubmitting}
                                label="Photo"
                            />
                        </div>
                    </div>
                </div>

                {/* Image Preview */}
                {imageUrl && (
                    <div className="ml-12">
                        <div className="relative inline-block">
                            <img
                                src={imageUrl}
                                alt="Preview"
                                className="max-h-80 max-w-full rounded-xl object-cover shadow-sm"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="absolute bottom-3 right-3 h-8 w-8 rounded-full shadow-lg hover:bg-secondary/80"
                                onClick={() => setImageUrl("")}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end pt-3">
                    <div className="flex gap-2">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                size="sm"
                                className="rounded-full px-4"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting || !content.trim() || !authorId
                            }
                            size="sm"
                            className="rounded-full px-4 bg-primary hover:bg-primary/90"
                        >
                            {isSubmitting ? "Posting..." : "Post"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
