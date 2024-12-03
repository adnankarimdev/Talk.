"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/Sidebar";
import {
  LayoutDashboard,
  ListStart,
  Infinity,
  FilePenLine,
  LogOut,
  MonitorCheck,
  Star,
  MessageCircle,
  Reply,
  Route,
  MonitorCog,
  BadgePlus,
  Logs,
  Speaker,
  LetterText
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GiSpiderWeb } from "react-icons/gi";
import Logo from "./Logo";
import LogoSvg from "../../app/logo.svg";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    show: true,
  },
  {
    icon: MonitorCog,
    label: "Platform Settings",
    href: "/settings",
    show: true,
  },
  { icon: Logs, label: "Tasks List", href: "/tasks", show: false },
  { icon: LetterText, label: "Forms", href: "/typeform", show: true },
  {
    icon: Route,
    label: "Customer Journey",
    href: "/customer-journies",
    show: true,
  },
  //Hiding Messenger for now, won't release to public just yet.
  { icon: MessageCircle, label: "Messenger", href: "/messenger", show: false },
  { icon: Star, label: "Customer Feedback", href: "/reviews", show: true },
  {
    icon: GiSpiderWeb,
    label: "Website Creator",
    href: "/website-creator",
    show: false,
  },
  { icon: Reply, label: "Respond", href: "/respond", show: true },
  { icon: LogOut, label: "Logout", href: "/", show: true },
];

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("authToken")
    router.push("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="mb-2">
            <Logo size={24}/>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(
                (item) =>
                  item.show && (
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-2",
                        "hover:bg-accent hover:text-accent-foreground"
                      )}
                      asChild
                    >
                      {item.label === "Logout" ? (
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="ml-2 hidden group-hover:inline-block">
                            {item.label}
                          </span>
                        </button>
                      ) : (
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span className="ml-2 hidden group-hover:inline-block">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </Button>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
