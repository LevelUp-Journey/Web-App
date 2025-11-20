import {
  Code2,
  HelpCircle,
  LayoutDashboard,
  Library,
  Settings,
  ShieldUser,
  Trophy,
} from "lucide-react";
import Image from "next/image";
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
} from "@/components/ui/sidebar";
import { UserRole } from "@/lib/consts";
import { getDictionary } from "@/lib/i18n";
import { getLocalizedPaths } from "@/lib/paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default async function AppSidebar({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "es");
  const PATHS = getLocalizedPaths(lang);
  const roles = await AuthController.getUserRoles();

  const isTeacher =
    roles.includes(UserRole.TEACHER) || roles.includes(UserRole.ADMIN);

  // Menu items with translations
  const topItems = [
    {
      title: dict.navigation.dashboard,
      url: PATHS.DASHBOARD.ROOT,
      icon: LayoutDashboard,
    },
    {
      title: dict.navigation.challenges,
      url: PATHS.DASHBOARD.CHALLENGES.ROOT,
      icon: Code2,
    },
    {
      title: dict.navigation.leaderboard,
      url: PATHS.DASHBOARD.LEADERBOARD,
      icon: Trophy,
    },
    {
      title: dict.navigation.guides,
      url: PATHS.DASHBOARD.GUIDES.ROOT,
      icon: Library,
    },
  ];

  const administrativeItems = [
    {
      title: dict.navigation.adminDashboard,
      url: PATHS.DASHBOARD.ADMINISTRATION.ROOT,
      icon: ShieldUser,
    },
  ];

  const bottomItems = [
    {
      title: dict.navigation.help,
      url: PATHS.DASHBOARD.HELP,
      icon: HelpCircle,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <Image
                src="/cat-smiling.svg"
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
          <SidebarGroupLabel>{dict.sidebar.groups.home}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topItems.map((item) => (
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
        {isTeacher && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {dict.sidebar.groups.administrative}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {administrativeItems.map((item) => (
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
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
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
      </SidebarFooter>
    </Sidebar>
  );
}
