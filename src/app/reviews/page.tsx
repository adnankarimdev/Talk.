"use client";

import Reviews from "@/components/ui/Reviews";
import AnimatedLayout from "@/animations/AnimatedLayout";
import GradualSpacing from "@/components/ui/gradual-spacing";
export default function Dashboard() {
  return (
    <AnimatedLayout>
      <div className="container mx-auto p-4">
        <GradualSpacing
          className="text-2xl font-bold mb-4 text-center"
          text="Talk. Feedback"
        />
        <Reviews />
      </div>
    </AnimatedLayout>
  );
}
