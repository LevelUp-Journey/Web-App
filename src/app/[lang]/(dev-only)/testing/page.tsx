"use client";

import { useState } from "react";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import {
    CourseStatus,
    type CreateCourseRequest,
    type UpdateCourseRequest,
    type AddGuideToCourseRequest,
    type DeleteGuideFromCourseRequest,
    type UpdateCourseAuthorsRequest,
    type UpdateCourseStatusRequest,
} from "@/services/internal/learning/courses/controller/course.response";
import {
    GuideStatus,
    type CreateGuideRequest,
    type UpdateGuideRequest,
    type CreatePageRequest,
    type UpdatePageRequest,
} from "@/services/internal/learning/guides/controller/guide.response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function TestingPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTest = async (testFn: () => Promise<any>, testName: string) => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await testFn();
            setResult({ success: true, data: response, testName });
            console.log(`✅ ${testName}:`, response);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message;
            setError(errorMsg);
            setResult({ success: false, error: errorMsg, testName });
            console.error(`❌ ${testName}:`, err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-2">
                API Testing - Controllers Validation
            </h1>
            <p className="text-muted-foreground mb-8">
                Test all Course and Guide controller methods
            </p>

            {/* Result Display */}
            {(result || error) && (
                <div
                    className={`mb-8 p-4 rounded-lg border ${
                        error
                            ? "bg-destructive/10 border-destructive"
                            : "bg-green-50 border-green-500"
                    }`}
                >
                    <h3 className="font-semibold mb-2">
                        {result?.testName || "Error"}
                    </h3>
                    {error ? (
                        <p className="text-destructive text-sm">{error}</p>
                    ) : (
                        <pre className="text-xs overflow-auto max-h-96 bg-background p-4 rounded">
                            {JSON.stringify(result?.data, null, 2)}
                        </pre>
                    )}
                </div>
            )}

            <Accordion type="multiple" className="space-y-4">
                {/* COURSE CONTROLLERS */}
                <AccordionItem value="courses" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-xl font-bold">
                        📚 Course Controllers
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        {/* Get All Courses */}
                        <div className="space-y-2">
                            <h3 className="font-semibold">1. Get All Courses</h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.getCourses()
                            </p>
                            <Button
                                onClick={() =>
                                    handleTest(
                                        () => CourseController.getCourses(),
                                        "Get All Courses",
                                    )
                                }
                                disabled={loading}
                            >
                                Test Get Courses
                            </Button>
                        </div>

                        <Separator />

                        {/* Create Course */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">2. Create Course</h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.createCourse(request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const request: CreateCourseRequest = {
                                        title: formData.get("title") as string,
                                        description: formData.get(
                                            "description",
                                        ) as string,
                                        coverImage: formData.get(
                                            "coverImage",
                                        ) as string,
                                        authorIds: (
                                            formData.get("authorIds") as string
                                        ).split(","),
                                        topicIds: (
                                            formData.get("topicIds") as string
                                        ).split(","),
                                    };
                                    handleTest(
                                        () =>
                                            CourseController.createCourse(
                                                request,
                                            ),
                                        "Create Course",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Title *</Label>
                                    <Input
                                        name="title"
                                        placeholder="Test Course Title"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Description *</Label>
                                    <Textarea
                                        name="description"
                                        placeholder="Course description"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Cover Image URL *</Label>
                                    <Input
                                        name="coverImage"
                                        placeholder="https://example.com/image.jpg"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Author IDs (comma-separated) *</Label>
                                    <Input
                                        name="authorIds"
                                        placeholder="author-1,author-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Topic IDs (comma-separated) *</Label>
                                    <Input
                                        name="topicIds"
                                        placeholder="topic-1,topic-2"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Create Course
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Get Course By ID */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">3. Get Course By ID</h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.getCourseById({"{courseId}"})
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const courseId = formData.get(
                                        "courseId",
                                    ) as string;
                                    handleTest(
                                        () =>
                                            CourseController.getCourseById({
                                                courseId,
                                            }),
                                        "Get Course By ID",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Course ID *</Label>
                                    <Input
                                        name="courseId"
                                        placeholder="course-uuid"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Get Course
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Update Course */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">4. Update Course</h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.updateCourse(courseId, request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const courseId = formData.get(
                                        "courseId",
                                    ) as string;
                                    const request: UpdateCourseRequest = {
                                        title: formData.get("title") as string,
                                        description: formData.get(
                                            "description",
                                        ) as string,
                                        coverImage: formData.get(
                                            "coverImage",
                                        ) as string,
                                        topicIds: (
                                            formData.get("topicIds") as string
                                        ).split(","),
                                    };
                                    handleTest(
                                        () =>
                                            CourseController.updateCourse(
                                                courseId,
                                                request,
                                            ),
                                        "Update Course",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Course ID *</Label>
                                    <Input
                                        name="courseId"
                                        placeholder="course-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Title *</Label>
                                    <Input
                                        name="title"
                                        placeholder="Updated Title"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Description *</Label>
                                    <Textarea
                                        name="description"
                                        placeholder="Updated description"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Cover Image URL *</Label>
                                    <Input
                                        name="coverImage"
                                        placeholder="https://example.com/image.jpg"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Topic IDs (comma-separated) *</Label>
                                    <Input
                                        name="topicIds"
                                        placeholder="topic-1,topic-2"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Update Course
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Delete Course */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-destructive">
                                5. Delete Course
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.deleteCourse({"{courseId}"})
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const courseId = formData.get(
                                        "courseId",
                                    ) as string;
                                    handleTest(
                                        () =>
                                            CourseController.deleteCourse({
                                                courseId,
                                            }),
                                        "Delete Course",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Course ID *</Label>
                                    <Input
                                        name="courseId"
                                        placeholder="course-uuid"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="destructive"
                                >
                                    Test Delete Course
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Add Guide to Course */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">6. Add Guide to Course</h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.addGuideToCourse(request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const request: AddGuideToCourseRequest = {
                                        courseId: formData.get(
                                            "courseId",
                                        ) as string,
                                        guideId: formData.get("guideId") as string,
                                    };
                                    handleTest(
                                        () =>
                                            CourseController.addGuideToCourse(
                                                request,
                                            ),
                                        "Add Guide to Course",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Course ID *</Label>
                                    <Input
                                        name="courseId"
                                        placeholder="course-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Add Guide
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Delete Guide from Course */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-destructive">
                                7. Delete Guide from Course
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.deleteGuideFromCourse(request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const request: DeleteGuideFromCourseRequest = {
                                        courseId: formData.get(
                                            "courseId",
                                        ) as string,
                                        guideId: formData.get("guideId") as string,
                                    };
                                    handleTest(
                                        () =>
                                            CourseController.deleteGuideFromCourse(
                                                request,
                                            ),
                                        "Delete Guide from Course",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Course ID *</Label>
                                    <Input
                                        name="courseId"
                                        placeholder="course-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="destructive"
                                >
                                    Test Delete Guide
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Reorder Course Guide */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">8. Reorder Course Guide</h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.reorderCourseGuide(courseId,
                                guideId, newPosition)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const courseId = formData.get(
                                        "courseId",
                                    ) as string;
                                    const guideId = formData.get(
                                        "guideId",
                                    ) as string;
                                    const newPosition = Number.parseInt(
                                        formData.get("newPosition") as string,
                                    );
                                    handleTest(
                                        () =>
                                            CourseController.reorderCourseGuide(
                                                courseId,
                                                guideId,
                                                newPosition,
                                            ),
                                        "Reorder Course Guide",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Course ID *</Label>
                                    <Input
                                        name="courseId"
                                        placeholder="course-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>New Position *</Label>
                                    <Input
                                        name="newPosition"
                                        type="number"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Reorder Guide
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Update Course Authors */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">
                                9. Update Course Authors
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.updateCourseAuthors(courseId,
                                request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const courseId = formData.get(
                                        "courseId",
                                    ) as string;
                                    const request: UpdateCourseAuthorsRequest = {
                                        authorIds: (
                                            formData.get("authorIds") as string
                                        ).split(","),
                                    };
                                    handleTest(
                                        () =>
                                            CourseController.updateCourseAuthors(
                                                courseId,
                                                request,
                                            ),
                                        "Update Course Authors",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Course ID *</Label>
                                    <Input
                                        name="courseId"
                                        placeholder="course-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Author IDs (comma-separated) *</Label>
                                    <Input
                                        name="authorIds"
                                        placeholder="author-1,author-2"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Update Authors
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Update Course Status */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">
                                10. Update Course Status
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                CourseController.updateCourseStatus(courseId,
                                request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const courseId = formData.get(
                                        "courseId",
                                    ) as string;
                                    const request: UpdateCourseStatusRequest = {
                                        status: formData.get(
                                            "status",
                                        ) as CourseStatus,
                                    };
                                    handleTest(
                                        () =>
                                            CourseController.updateCourseStatus(
                                                courseId,
                                                request,
                                            ),
                                        "Update Course Status",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Course ID *</Label>
                                    <Input
                                        name="courseId"
                                        placeholder="course-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Status *</Label>
                                    <Select name="status" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={CourseStatus.DRAFT}>
                                                Draft
                                            </SelectItem>
                                            <SelectItem
                                                value={CourseStatus.PUBLISHED}
                                            >
                                                Published
                                            </SelectItem>
                                            <SelectItem
                                                value={CourseStatus.ARCHIVED}
                                            >
                                                Archived
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Update Status
                                </Button>
                            </form>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* GUIDE CONTROLLERS */}
                <AccordionItem value="guides" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-xl font-bold">
                        📖 Guide Controllers
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        {/* Get All Guides */}
                        <div className="space-y-2">
                            <h3 className="font-semibold">1. Get All Guides</h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.getAllGuides()
                            </p>
                            <Button
                                onClick={() =>
                                    handleTest(
                                        () => GuideController.getAllGuides(),
                                        "Get All Guides",
                                    )
                                }
                                disabled={loading}
                            >
                                Test Get Guides
                            </Button>
                        </div>

                        <Separator />

                        {/* Create Guide */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">2. Create Guide</h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.createGuide(request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const request: CreateGuideRequest = {
                                        title: formData.get("title") as string,
                                        description: formData.get(
                                            "description",
                                        ) as string,
                                        coverImage: formData.get(
                                            "coverImage",
                                        ) as string,
                                        authorIds: (
                                            formData.get("authorIds") as string
                                        ).split(","),
                                        topicIds: (
                                            formData.get("topicIds") as string
                                        ).split(","),
                                    };
                                    handleTest(
                                        () => GuideController.createGuide(request),
                                        "Create Guide",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Title *</Label>
                                    <Input
                                        name="title"
                                        placeholder="Test Guide Title"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Description *</Label>
                                    <Textarea
                                        name="description"
                                        placeholder="Guide description"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Cover Image URL *</Label>
                                    <Input
                                        name="coverImage"
                                        placeholder="https://example.com/image.jpg"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Author IDs (comma-separated) *</Label>
                                    <Input
                                        name="authorIds"
                                        placeholder="author-1,author-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Topic IDs (comma-separated) *</Label>
                                    <Input
                                        name="topicIds"
                                        placeholder="topic-1,topic-2"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Create Guide
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Get Guide By ID */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">3. Get Guide By ID</h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.getGuideById(guideId)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const guideId = formData.get(
                                        "guideId",
                                    ) as string;
                                    handleTest(
                                        () => GuideController.getGuideById(guideId),
                                        "Get Guide By ID",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Get Guide
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Update Guide */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">4. Update Guide</h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.updateGuide(guideId, request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const guideId = formData.get(
                                        "guideId",
                                    ) as string;
                                    const request: UpdateGuideRequest = {
                                        title: formData.get("title") as string,
                                        description: formData.get(
                                            "description",
                                        ) as string,
                                        coverImage: formData.get(
                                            "coverImage",
                                        ) as string,
                                        topicIds: (
                                            formData.get("topicIds") as string
                                        ).split(","),
                                    };
                                    handleTest(
                                        () =>
                                            GuideController.updateGuide(
                                                guideId,
                                                request,
                                            ),
                                        "Update Guide",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Title *</Label>
                                    <Input
                                        name="title"
                                        placeholder="Updated Title"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Description *</Label>
                                    <Textarea
                                        name="description"
                                        placeholder="Updated description"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Cover Image URL *</Label>
                                    <Input
                                        name="coverImage"
                                        placeholder="https://example.com/image.jpg"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Topic IDs (comma-separated) *</Label>
                                    <Input
                                        name="topicIds"
                                        placeholder="topic-1,topic-2"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Update Guide
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Delete Guide */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-destructive">
                                5. Delete Guide
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.deleteGuide({"{id}"})
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const id = formData.get("guideId") as string;
                                    handleTest(
                                        () => GuideController.deleteGuide({ id }),
                                        "Delete Guide",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="destructive"
                                >
                                    Test Delete Guide
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Update Guide Status */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">6. Update Guide Status</h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.updateGuideStatus(guideId, request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const guideId = formData.get(
                                        "guideId",
                                    ) as string;
                                    const request = {
                                        status: formData.get(
                                            "status",
                                        ) as GuideStatus,
                                    };
                                    handleTest(
                                        () =>
                                            GuideController.updateGuideStatus(
                                                guideId,
                                                request,
                                            ),
                                        "Update Guide Status",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Status *</Label>
                                    <Select name="status" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={GuideStatus.DRAFT}>
                                                Draft
                                            </SelectItem>
                                            <SelectItem value={GuideStatus.PUBLISHED}>
                                                Published
                                            </SelectItem>
                                            <SelectItem value={GuideStatus.ARCHIVED}>
                                                Archived
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    GuideStatus.ASSOCIATED_WITH_COURSE
                                                }
                                            >
                                                Associated with Course
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Update Status
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Create Page */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">7. Create Page</h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.createPage(guideId, request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const guideId = formData.get(
                                        "guideId",
                                    ) as string;
                                    const request: CreatePageRequest = {
                                        content: formData.get("content") as string,
                                        order: Number.parseInt(
                                            formData.get("order") as string,
                                        ),
                                    };
                                    handleTest(
                                        () =>
                                            GuideController.createPage(
                                                guideId,
                                                request,
                                            ),
                                        "Create Page",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Content *</Label>
                                    <Textarea
                                        name="content"
                                        placeholder="Page content (markdown)"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Order *</Label>
                                    <Input
                                        name="order"
                                        type="number"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Create Page
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Get Page By ID */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">8. Get Page By ID</h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.getPageById({"{pageId, guideId}"})
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const request = {
                                        pageId: formData.get("pageId") as string,
                                        guideId: formData.get("guideId") as string,
                                    };
                                    handleTest(
                                        () => GuideController.getPageById(request),
                                        "Get Page By ID",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Page ID *</Label>
                                    <Input
                                        name="pageId"
                                        placeholder="page-uuid"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Get Page
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Update Page */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">9. Update Page</h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.updatePage(guideId, pageId, request)
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const guideId = formData.get(
                                        "guideId",
                                    ) as string;
                                    const pageId = formData.get("pageId") as string;
                                    const request: UpdatePageRequest = {
                                        content: formData.get("content") as string,
                                        order: Number.parseInt(
                                            formData.get("order") as string,
                                        ),
                                    };
                                    handleTest(
                                        () =>
                                            GuideController.updatePage(
                                                guideId,
                                                pageId,
                                                request,
                                            ),
                                        "Update Page",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Page ID *</Label>
                                    <Input
                                        name="pageId"
                                        placeholder="page-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Content *</Label>
                                    <Textarea
                                        name="content"
                                        placeholder="Updated content (markdown)"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Order *</Label>
                                    <Input
                                        name="order"
                                        type="number"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Test Update Page
                                </Button>
                            </form>
                        </div>

                        <Separator />

                        {/* Delete Page */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-destructive">
                                10. Delete Page
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                GuideController.deletePage({"{pageId, guideId}"})
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const request = {
                                        pageId: formData.get("pageId") as string,
                                        guideId: formData.get("guideId") as string,
                                    };
                                    handleTest(
                                        () => GuideController.deletePage(request),
                                        "Delete Page",
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Guide ID *</Label>
                                    <Input
                                        name="guideId"
                                        placeholder="guide-uuid"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Page ID *</Label>
                                    <Input
                                        name="pageId"
                                        placeholder="page-uuid"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="destructive"
                                >
                                    Test Delete Page
                                </Button>
                            </form>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}