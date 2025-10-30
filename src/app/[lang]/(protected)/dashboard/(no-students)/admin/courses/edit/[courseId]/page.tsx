// app/(dashboard)/courses/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation";
import { EditCourseForm } from "@/components/learning/edit-course-form";
import { UserRole } from "@/lib/consts";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";

export default async function EditCoursePage({
    params,
}: {
    params: Promise<{
        courseId: string;
    }>;
}) {
    // Fetch roles and verify permissions
    const roles = await AuthController.getUserRoles();
    const hasAccess = roles.some(
        (r) => r === UserRole.TEACHER || r === UserRole.ADMIN,
    );

    if (!hasAccess) {
        redirect("/unauthorized");
    }

    const variables = await params;
    const courseId = variables.courseId;

    // Fetch course data
    const course = (await CourseController.getCourseById(courseId)) as Course;

    if (!course) {
        notFound();
    }

    return (
        <section className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b">
                <div>
                    <h1 className="text-2xl font-semibold">Edit Course</h1>
                    <p className="text-muted-foreground">
                        Update course information and settings.
                    </p>
                </div>
            </header>

            <div className="h-full overflow-y-auto p-6">
                <EditCourseForm course={course} />
            </div>
        </section>
    );
}
