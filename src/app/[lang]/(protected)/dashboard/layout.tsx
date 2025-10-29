import AppSidebar from "@/components/dashboard/app-sidebar";
import { SidebarContentHeader } from "@/components/dashboard/sidebar-content-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-screen">
                <SidebarContentHeader />
                {children}
            </main>
        </SidebarProvider>
    );
}
