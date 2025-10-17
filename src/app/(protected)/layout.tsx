import { AuthController } from "@/services/iam/controller/auth.controller";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await AuthController.validateToken();
    return children;
}
