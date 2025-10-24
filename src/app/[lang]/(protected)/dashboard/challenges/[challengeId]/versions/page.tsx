import { redirect } from "next/navigation";
import CreateCodeVersionForm from "@/app/[lang]/(protected)/dashboard/challenges/[challengeId]/versions/create-form";
import { UserRole } from "@/lib/consts";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

interface PageProps {
    params: Promise<{ challengeId: string }>;
}

export default async function CreateCodeVersionPage({ params }: PageProps) {
    const { challengeId } = await params;

    // Check user roles
    const userRoles = await AuthController.getUserRoles();
    const isTeacherOrAdmin =
        userRoles.includes(UserRole.TEACHER) ||
        userRoles.includes(UserRole.ADMIN);

    if (!isTeacherOrAdmin) {
        // Redirect students back to the challenge page
        redirect(`/dashboard/challenges/${challengeId}`);
    }

    return <CreateCodeVersionForm challengeId={challengeId} />;
}
