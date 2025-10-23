import { redirect } from "next/navigation";
import { UserRole } from "@/lib/consts";
import { PATHS } from "@/lib/paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default async function NoStudentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userRoles = await AuthController.getUserRoles();
    const isUserStudent = userRoles.includes(UserRole.STUDENT);
    if (isUserStudent) {
        redirect(PATHS.UNAUTHORIZED);
    }
    const userId = await AuthController.getUserId();
    console.log("USER ID:", userId);

    return children;
}
