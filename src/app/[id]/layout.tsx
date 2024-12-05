import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function AutoRespondLayout({ children }: LayoutProps) {
  return (
    <div className="flex">
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
