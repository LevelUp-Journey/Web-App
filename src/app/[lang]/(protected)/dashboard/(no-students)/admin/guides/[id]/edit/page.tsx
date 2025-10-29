"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    ShadcnTemplate,
    type ShadcnTemplateRef,
} from "@/components/challenges/editor/lexkitEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { GuideController } from "@/services/internal/learning/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/controller/guide.response";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    markdownContent: z.string().min(1, "Content is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function EditGuidePage({
    params,
}: {
    params: Promise<{ lang: string; id: string }>;
}) {
    const router = useRouter();
    const [guide, setGuide] = useState<GuideResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const editorRef = useRef<ShadcnTemplateRef>(null);
    const PATHS = useLocalizedPaths();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            markdownContent: "",
        },
    });

    useEffect(() => {
        const loadGuide = async () => {
            try {
                const { id } = await params;
                const guideData = await GuideController.getById(id);
                setGuide(guideData);
                form.reset({
                    title: guideData.title,
                    description: guideData.description || "",
                    markdownContent: guideData.markdownContent,
                });
                // Inject content into editor
                setTimeout(() => {
                    editorRef.current?.injectMarkdown(
                        guideData.markdownContent,
                    );
                }, 100);
            } catch (error) {
                console.error("Error loading guide:", error);
                router.back();
            } finally {
                setLoading(false);
            }
        };

        loadGuide();
    }, [params, form, router]);

    const onSubmit = async (data: FormData) => {
        if (!guide) return;

        setSaving(true);
        try {
            const markdownContent =
                editorRef.current?.getMarkdown() || data.markdownContent;
            await GuideController.update(guide.id, {
                title: data.title,
                description: data.description,
                markdownContent,
            });

            router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.VIEW(guide.id));
        } catch (error) {
            console.error("Error updating guide:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="space-y-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-64"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="container mx-auto p-4">
                <div className="space-y-6">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-semibold">
                            Guide Not Found
                        </h1>
                        <p className="text-muted-foreground">
                            The guide you're trying to edit doesn't exist.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            router.push(
                                PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT,
                            )
                        }
                    >
                        ← Back to Guides
                    </Button>
                </div>
                <div>
                    <h1 className="text-2xl font-semibold">Edit Guide</h1>
                    <p className="text-muted-foreground">
                        Update the guide details and content.
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
                                    {saving ? "Saving..." : "Save Changes"}
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
