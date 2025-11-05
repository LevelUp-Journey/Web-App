import ChallengeCard from "@/components/cards/challenge-card";
import CourseCard from "@/components/cards/course-card";
import GuideCard from "@/components/cards/guide-card";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";

export default async function AdminPage() {
    const userId = await AuthController.getUserId();

    const [challenges, guides, courses] = await Promise.all([
        ChallengeController.getChallengesByTeacherId(userId),
        GuideController.getAllGuides(),
        CourseController.getCourses(),
    ]);

    // Ordenar cada tipo por fecha de actualización (más reciente primero)
    const sortByUpdated = (arr: any[]) =>
        arr.sort(
            (a, b) =>
                new Date(b.updatedAt ?? 0).getTime() -
                new Date(a.updatedAt ?? 0).getTime(),
        );
    console.log("CHALLENGES", challenges);
    console.log("GUIDES", guides);
    console.log("COURSES", courses);

    const sortedChallenges = sortByUpdated(challenges);
    const sortedGuides = sortByUpdated(guides);
    const sortedCourses = sortByUpdated(courses);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold tracking-tight">
                Admin Dashboard — Recent Activity
            </h2>

            {/* Challenges Row */}
            <section className="space-y-3">
                <h3 className="text-lg font-semibold">Challenges</h3>
                {sortedChallenges.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No challenges found.
                    </p>
                ) : (
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                        {sortedChallenges.map((challenge: any) => (
                            <div
                                key={challenge.id}
                                className="min-w-[340px] flex-shrink-0"
                            >
                                <ChallengeCard
                                    challenge={challenge}
                                    codeVersions={challenge.codeVersions ?? []}
                                    adminMode={true}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Guides Row */}
            <section className="space-y-3">
                <h3 className="text-lg font-semibold">Guides</h3>
                {sortedGuides.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No guides found.
                    </p>
                ) : (
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                        {sortedGuides.map((guide: any) => (
                            <div
                                key={guide.id}
                                className="min-w-[340px] flex-shrink-0"
                            >
                                <GuideCard guide={guide} adminMode={true} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Courses Row */}
            <section className="space-y-3">
                <h3 className="text-lg font-semibold">Courses</h3>
                {sortedCourses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No courses found.
                    </p>
                ) : (
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                        {sortedCourses.map((course: any) => (
                            <div
                                key={course.id}
                                className="min-w-[340px] flex-shrink-0"
                            >
                                <CourseCard course={course} adminMode={true} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
