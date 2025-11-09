import { UserCircle2Icon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";
import { SearchInput } from "../searching/search-input";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { NavigationIndicator } from "./navigation-indicator";

export async function SidebarContentHeader() {
    const profile = await ProfileController.getCurrentUserProfile();

    // If profile service is down, we still show the header but without user info
    if (!profile) {
        return (
            <header className="w-full flex px-4 items-center justify-between border-b h-14 sticky top-0 bg-background z-10">
                <div className="flex items-center">
                    <SidebarTrigger />
                    <NavigationIndicator />
                </div>
                <div className="flex items-center gap-4 text-sm h-14">
                    <SearchInput />
                    <div className="h-8">
                        <Separator orientation="vertical" className="h-6" />
                    </div>
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                            <UserCircle2Icon className="h-5 w-5 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </header>
        );
    }

    return (
        <header className="w-full flex px-4 items-center justify-between border-b h-14 sticky top-0 bg-background z-10">
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
