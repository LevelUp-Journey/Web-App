import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import { SearchInput } from "../searching/search-input";
import { Separator } from "../ui/separator";
import { NavUser } from "./nav-user";
import { NavigationIndicator } from "./navigation-indicator";
import { SidebarTrigger } from "../ui/sidebar";

export async function SidebarContentHeader() {
    const profile = await ProfileController.getCurrentUserProfile();

    // If profile service is down, we still show the header but without user info
    if (!profile) {
        return (
            <header className="w-full flex px-4 items-center justify-between border-b h-14">
                <div className="flex items-center">
                    <SidebarTrigger />
                    <NavigationIndicator />
                </div>
                <div className="flex items-center gap-4 text-sm h-14">
                    <SearchInput />
                    <div className="h-8">
                        <Separator orientation="vertical" className="h-6" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Profile unavailable
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="w-full flex px-4 items-center justify-between border-b h-14">
            <div className="flex items-center">
                <SidebarTrigger />
                <NavigationIndicator />
            </div>
            <div className="flex items-center gap-4 text-sm h-14">
                <SearchInput />
                <div className="h-8">
                    <Separator orientation="vertical" className="h-6" />
                </div>
                <NavUser profile={profile} />
            </div>
        </header>
    );
}
