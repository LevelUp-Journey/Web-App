import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import { SearchInput } from "../searching/search-input";
import { NavUser } from "./nav-user";
import { NavigationIndicator } from "./navigation-indicator";

export async function SidebarContentHeader() {
    const profile = await ProfileController.getCurrentUserProfile();

    return (
        <header className="w-full flex items-center justify-between px-4 py-2 border-b">
            <NavigationIndicator />
            <div className="flex items-center gap-2">
                <SearchInput />
                <NavUser profile={profile} />
            </div>
        </header>
    );
}
