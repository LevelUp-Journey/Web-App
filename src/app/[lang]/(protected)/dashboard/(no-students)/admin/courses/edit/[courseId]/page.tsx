"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditCourseForm } from "@/components/learning/edit-course-form";
import { Button } from "@/components/ui/button";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { UserRole } from "@/lib/consts";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import type { Course } from "@/services/internal/learning/courses/domain/course.entity";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{
    courseId: string;
  }>;
}) {
  const router = useRouter();
  const PATHS = useLocalizedPaths();
  const [courseId, setCourseId] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check permissions
        const roles = await AuthController.getUserRoles();
        const role = roles.find(
          (r) => r === UserRole.TEACHER || r === UserRole.ADMIN,
        );
        setUserRole(role || null);

        if (!role) {
          router.push(PATHS.UNAUTHORIZED);
          return;
        }

        // Get course ID from params
        const variables = await params;
        setCourseId(variables.courseId);

        // Fetch course data
        const courseData = (await CourseController.getCourseById({
          courseId: variables.courseId,
        })) as Course;

        if (!courseData) {
          setError("Course not found");
          return;
        }

        setCourse(courseData);
      } catch (err) {
        console.error("Error loading course:", err);
        setError("Error loading course data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params, router, PATHS.UNAUTHORIZED]);

  if (loading) {
    return (
      <section className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Edit Course</h1>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </header>

        <div className="h-full overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!userRole) {
    return (
      <section className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Access Denied</h1>
            </div>
          </div>
        </header>

        <div className="h-full overflow-y-auto p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to edit courses.
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Error</h1>
            </div>
          </div>
        </header>

        <div className="h-full overflow-y-auto p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">Course Not Found</h1>
            <p className="text-muted-foreground">
              {error || "The course you're looking for doesn't exist."}
            </p>
            <Button
              onClick={() =>
                router.push(PATHS.DASHBOARD.ADMINISTRATION.COURSES.ROOT)
              }
            >
              Back to Courses
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(PATHS.DASHBOARD.ADMINISTRATION.COURSES.VIEW(courseId))
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Course</h1>
            <p className="text-muted-foreground">
              Update course information and settings.
            </p>
          </div>
        </div>
      </header>

      <div className="h-full overflow-y-auto p-6">
        <EditCourseForm course={course} />
      </div>
    </section>
  );
}
