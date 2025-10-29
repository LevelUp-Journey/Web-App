import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import { SearchInput } from "../searching/search-input";
import { NavUser } from "./nav-user";

export async function SidebarContentHeader() {
    const profile = await ProfileController.getCurrentUserProfile();

    return (
        <header className="w-full flex items-center justify-between px-4 py-2 border-b">
            <SearchInput />
            <NavUser profile={profile} />
        </header>
    );
}
