"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    ShadcnTemplate,
    type ShadcnTemplateRef,
} from "@/components/challenges/editor/lexkitEditor";
import { CoverDropzone } from "@/components/learning/cover-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { CreateGuideRequest } from "@/services/internal/learning/guides/controller/guide.response";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    cover: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateGuidePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const editorRef = useRef<ShadcnTemplateRef>(null);
    const PATHS = useLocalizedPaths();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            cover: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        try {
            const editor = editorRef.current;
            if (!editor) throw new Error("Editor not initialized");

            const markdownContent = editor.getMarkdown();
            if (!markdownContent || markdownContent.trim() === "") {
                throw new Error("Content cannot be empty");
            }

            const request: CreateGuideRequest = {
                title: data.title,
                description: data.description || "",
                markdownContent,
                cover: data.cover || "",
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
        <section className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b">
                <div>
                    <h1 className="text-2xl font-semibold">Create Guide</h1>
                    <p className="text-muted-foreground">
                        Create a new guide for your course.
                    </p>
                </div>
            </header>

            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={40} minSize={30}>
                    <div className="h-full overflow-y-auto p-6">
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
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    {...form.register("description")}
                                    placeholder="Enter guide description"
                                    className="w-full"
                                />
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
                                        {form.formState.errors.cover.message}
                                    </p>
                                )}
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
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving ? "Creating..." : "Create Guide"}
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
    );
}
