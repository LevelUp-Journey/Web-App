"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CloudinaryController } from "@/services/external/cloudinary/cloudinary.controller";

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
        <div className="bg-card border border-border/40 rounded-2xl p-5 w-full shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* User Avatar + Content Flow - Twitter Style */}
                <div className="flex gap-4">
                    <Avatar className="h-14 w-14 flex-shrink-0">
                        <AvatarImage src={authorProfile?.profileUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                            {authorProfile?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 space-y-3">
                        {/* Title Input */}
                        <input
                            type="text"
                            value={content.split("\n")[0] || ""}
                            onChange={(e) => {
                                const lines = content.split("\n");
                                lines[0] = e.target.value;
                                setContent(lines.join("\n"));
                            }}
                            placeholder="What's the title?"
                            className="w-full bg-transparent border-0 focus-visible:ring-0 text-2xl font-bold placeholder:text-muted-foreground/60 outline-none resize-none"
                            disabled={isSubmitting}
                        />

                        {/* Content Textarea */}
                        <Textarea
                            value={content.split("\n").slice(1).join("\n")}
                            onChange={(e) => {
                                const title = content.split("\n")[0] || "";
                                setContent(title + "\n" + e.target.value);
                            }}
                            placeholder="What's happening?"
                            className="w-full min-h-[100px] resize-none border-0 focus-visible:ring-0 bg-transparent text-xl leading-relaxed placeholder:text-muted-foreground/60 outline-none"
                            disabled={isSubmitting}
                        />

                        {/* Image Preview - Twitter Style */}
                        {imageUrl && (
                            <div className="border border-border/30 rounded-2xl overflow-hidden max-w-md">
                                <div className="relative">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-full h-auto max-h-96 object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/70 hover:bg-black/80 border-0 shadow-lg"
                                        onClick={() => setImageUrl("")}
                                    >
                                        <X className="h-4 w-4 text-white" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Media Upload & Character Count */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/20">
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="default"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                    disabled={isSubmitting}
                                    className="text-primary hover:bg-primary/10 rounded-full p-3"
                                >
                                    <ImagePlus className="h-6 w-6" />
                                </Button>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        try {
                                            const imageUrl = await CloudinaryController.uploadImage(file, "uploads");
                                            setImageUrl(imageUrl);
                                        } catch (error) {
                                            console.error("Error uploading image:", error);
                                            toast.error("Failed to upload image");
                                        }
                                    }}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-base text-muted-foreground">
                                    {content.length}/280
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !content.trim() || !authorId}
                                    size="default"
                                    className="rounded-full px-8 bg-primary hover:bg-primary/90 font-semibold"
                                >
                                    {isSubmitting ? "Posting..." : "Post"}
                                </Button>
                            </div>
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
