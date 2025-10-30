import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

export default async function DashboardCoursePage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const pageParams = await params;

    const courseId = pageParams.courseId;

    const course = await CourseController.getCourseById(courseId);

    if (!course) {
        return <div>Course not found</div>;
    }

    const profile = await ProfileController.getProfileByUserId(
        course?.teacherId,
    );

    return (
        <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <p>
                Teacher: {profile.firstName} {profile.lastName}
            </p>
        </div>
    );
}
