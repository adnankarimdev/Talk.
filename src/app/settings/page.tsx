"use client";

import ClientSettings from "@/components/ui/ClientSettings";
import AnimatedLayout from "@/animations/AnimatedLayout";
import GradualSpacing from "@/components/ui/gradual-spacing";
export default function DashboardRoute() {
  return (
    <AnimatedLayout>
      <div className="container mx-auto p-4">
        <GradualSpacing
          className="text-2xl font-bold mb-4 text-center"
          text="Talk. Review Platform Settings"
        />
        <ClientSettings />
      </div>
    </AnimatedLayout>
  );
}
