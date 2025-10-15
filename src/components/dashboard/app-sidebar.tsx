import { Code2, Home, Users } from "lucide-react";
import Image from "next/image";
import { PATHS } from "@/lib/paths";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { NavUser } from "./nav-user";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: PATHS.DASHBOARD.ROOT,
    icon: Home,
  },
  {
    title: "Challenges",
    url: PATHS.DASHBOARD.CHALLENGES,
    icon: Code2,
  },
  {
    title: "Community",
    url: PATHS.DASHBOARD.COMMUNITY,
    icon: Users,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <Image
                src="/pet_smile.png"
                width={36}
                height={36}
                alt="Level Up Journey Pet Smiling"
                className="rounded-md"
              />
              <span className="font-semibold text-lg tracking-tight">
                Level Up Journey
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: "",
            name: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
