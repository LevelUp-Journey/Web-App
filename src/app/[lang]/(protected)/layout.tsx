import { redirect } from "next/navigation";
import { PATHS } from "@/lib/paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isValid = await AuthController.validateToken();
    if (!isValid) {
        redirect(PATHS.AUTH.SIGN_IN);
    }

    return <>{children}</>;
}
