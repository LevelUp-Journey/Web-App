import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await AuthController.refreshToken();
    return children;
}
