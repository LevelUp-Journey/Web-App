"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import ImageUpload from "@/components/ui/image-upload";

export default function CreatePostForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [authorId, setAuthorId] = useState<string>("");

    useEffect(() => {
        AuthController.getUserId()
            .then(setAuthorId)
            .catch((error) => console.error("Error getting user ID:", error));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authorId) {
            console.error("No author ID available");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/community/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                    communityId: "default-community", // TODO: Make this configurable
                    authorId,
                    imageUrl,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create post");
            }

            // Redirect to community page after successful creation
            router.push("/dashboard/community");
        } catch (error) {
            console.error("Error creating post:", error);
            // TODO: Show error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Community Post</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter an engaging title..."
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts, questions, or insights..."
                            rows={8}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <ImageUpload
                        value={imageUrl}
                        onChange={setImageUrl}
                        disabled={isLoading}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={isLoading || !authorId}>
                            {isLoading ? "Creating..." : "Create Post"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}