"use client";

import Messenger from "@/components/ui/Messenger";
import AnimatedLayout from "@/animations/AnimatedLayout";
import GradualSpacing from "@/components/ui/gradual-spacing";
import { ConsolePage } from "@/components/ui/real-time/ConsolePage";
import TypeformCreator from "@/components/ui/typeform/TypeFormCreator";

export default function Dashboard() {
  return (
    <AnimatedLayout>
      <div className="container mx-auto p-4">
        <GradualSpacing
          className="text-2xl font-bold mb-4 text-center"
          text="Talk. Forms"
        />
        <TypeformCreator />
      </div>
    </AnimatedLayout>
  );
}
