import AppSidebar from "@/components/dashboard/app-sidebar";
import { SidebarContentHeader } from "@/components/dashboard/sidebar-content-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function ProtectedLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    return (
        <SidebarProvider>
            <AppSidebar params={params} />
            <main className="w-full min-h-screen flex flex-col">
                <SidebarContentHeader />
                <div className="flex-1">{children}</div>
            </main>
        </SidebarProvider>
    );
}
