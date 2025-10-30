"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CoverDropzone } from "@/components/learning/cover-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import {
    CourseDifficulty,
    type UpdateCourseRequest,
} from "@/services/internal/learning/courses/controller/course.response";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";

const formSchema = z.object({
    title: z.string().min(5, "Title is required"),
    description: z.string().optional(),
    difficulty: z.enum(CourseDifficulty),
    completionScore: z.number().min(0, "Completion score must be positive"),
    cover: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditCourseFormProps {
    course: Course;
}

export function EditCourseForm({ course }: EditCourseFormProps) {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    const [saving, setSaving] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: course.title,
            description: course.description,
            difficulty: course.difficulty,
            completionScore: course.completionScore,
            cover: course.cover,
        },
    });

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        try {
            await CourseController.updateCourse(
                course.id,
                data as UpdateCourseRequest,
            );
            router.push(PATHS.DASHBOARD.COURSES.VIEW(course.id));
        } catch (error) {
            console.error("Error updating course:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-2xl mx-auto"
        >
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mb-2"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Enter course title"
                />
                {form.formState.errors.title && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.title.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Enter course description"
                    className="min-h-[120px]"
                />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select
                    value={form.watch("difficulty")}
                    onValueChange={(value) =>
                        form.setValue("difficulty", value as CourseDifficulty)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                            Intermediate
                        </SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Completion Score */}
            <div className="space-y-2">
                <Label htmlFor="completionScore">Completion Score *</Label>
                <Input
                    id="completionScore"
                    type="number"
                    {...form.register("completionScore", {
                        valueAsNumber: true,
                    })}
                    placeholder="Enter completion score"
                />
            </div>

            {/* Cover */}
            <div className="space-y-2">
                <Label>Cover Image</Label>
                <CoverDropzone
                    onImageUrlChange={(url) => form.setValue("cover", url)}
                    currentImage={form.watch("cover")}
                    disabled={saving}
                    aspectRatio="wide"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={saving}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

export function EditCourseSkeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-32 ml-auto" />
        </div>
    );
}
