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
    content: z.string().min(1, "Content is required"),
    order: z.number().min(0),
    isProtected: z.boolean(),
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
            content: "",
            order: 0,
            isProtected: false,
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
                    content: guideData.content,
                    order: guideData.order,
                    isProtected: guideData.isProtected,
                });
                // Inject content into editor
                setTimeout(() => {
                    editorRef.current?.injectMarkdown(guideData.content);
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
            const content = editorRef.current?.getMarkdown() || data.content;
            await GuideController.update(guide.id, {
                title: data.title,
                content,
                order: data.order,
                isProtected: data.isProtected,
            });

            router.push(PATHS.DASHBOARD.ADMINISTRATION.GUIDES.VIEW(guide.id));
        } catch (error) {
            console.error("Error updating guide:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!guide) {
        return <div>Guide not found</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Guide</h2>
                <Button asChild variant="outline">
                    <Link href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT}>
                        Cancel
                    </Link>
                </Button>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        {...form.register("title")}
                        placeholder="Guide title"
                    />
                    {form.formState.errors.title && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.title.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="order">Order</Label>
                    <Input
                        id="order"
                        type="number"
                        {...form.register("order", { valueAsNumber: true })}
                        placeholder="Order"
                    />
                </div>

                <div>
                    <Label htmlFor="isProtected">Protected</Label>
                    <input
                        id="isProtected"
                        type="checkbox"
                        {...form.register("isProtected")}
                    />
                </div>

                <div>
                    <Label>Content</Label>
                    <div className="h-96 border rounded">
                        <ShadcnTemplate ref={editorRef} />
                    </div>
                </div>

                <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </form>
        </div>
    );
}
