import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import { SearchInput } from "../searching/search-input";
import { Separator } from "../ui/separator";
import { NavUser } from "./nav-user";
import { NavigationIndicator } from "./navigation-indicator";

export async function SidebarContentHeader() {
    const profile = await ProfileController.getCurrentUserProfile();

    return (
        <header className="w-full flex px-4 items-center justify-between border-b h-14">
            <NavigationIndicator />
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
