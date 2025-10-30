"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { UserRole } from "@/lib/consts";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import { CourseDifficulty } from "@/services/internal/learning/courses/controller/course.response";

const formSchema = z.object({
    title: z.string().min(5, "Title is required"),
    description: z.string(),
    difficulty: z.enum(CourseDifficulty),
    completionScore: z.number().min(0, "Completion score must be positive"),
    cover: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateCoursePage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const PATHS = useLocalizedPaths();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: CourseDifficulty.BEGINNER,
            completionScore: 100,
            cover: "",
        },
    });

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const roles = await AuthController.getUserRoles();
                const role = roles.find(
                    (r) => r === UserRole.TEACHER || r === UserRole.ADMIN,
                );
                setUserRole(role || null);
            } catch (error) {
                console.error("Error checking permissions:", error);
            } finally {
                setLoading(false);
            }
        };

        checkPermissions();
    }, []);

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        try {
            const course = await CourseController.createCourse({
                title: data.title,
                description: data.description || "",
                difficulty: data.difficulty,
                completionScore: data.completionScore,
                cover: data.cover || "",
            });

            router.push(PATHS.DASHBOARD.COURSES.VIEW(course.id));
        } catch (error) {
            console.error("Error creating course:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-64"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userRole) {
        return (
            <div className="container mx-auto p-4">
                <div className="space-y-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-semibold">
                            Access Denied
                        </h1>
                        <p className="text-muted-foreground">
                            You don't have permission to create courses.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b">
                <div>
                    <h1 className="text-2xl font-semibold">Create Course</h1>
                    <p className="text-muted-foreground">
                        Create a new course for your students.
                    </p>
                </div>
            </header>

            <div className="h-full overflow-y-auto p-6">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 max-w-2xl mx-auto"
                >
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                            Title *
                        </Label>
                        <Input
                            id="title"
                            {...form.register("title")}
                            placeholder="Enter course title"
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
                        <Textarea
                            id="description"
                            {...form.register("description")}
                            placeholder="Enter course description"
                            className="w-full min-h-[120px]"
                        />
                        {form.formState.errors.description && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="difficulty"
                            className="text-sm font-medium"
                        >
                            Difficulty *
                        </Label>
                        <Select
                            value={form.watch("difficulty")}
                            onValueChange={(value) =>
                                form.setValue(
                                    "difficulty",
                                    value as CourseDifficulty,
                                )
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BEGINNER">
                                    Beginner
                                </SelectItem>
                                <SelectItem value="INTERMEDIATE">
                                    Intermediate
                                </SelectItem>
                                <SelectItem value="ADVANCED">
                                    Advanced
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {form.formState.errors.difficulty && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.difficulty.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="completionScore"
                            className="text-sm font-medium"
                        >
                            Completion Score *
                        </Label>
                        <Input
                            id="completionScore"
                            type="number"
                            {...form.register("completionScore", {
                                valueAsNumber: true,
                            })}
                            placeholder="Enter completion score"
                            className="w-full"
                        />
                        {form.formState.errors.completionScore && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.completionScore.message}
                            </p>
                        )}
                    </div>

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

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.push(
                                    PATHS.DASHBOARD.ADMINISTRATION.COURSES.ROOT,
                                )
                            }
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Creating..." : "Create Course"}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
