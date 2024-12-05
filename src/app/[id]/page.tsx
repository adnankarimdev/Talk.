"use client";

import AutoRespond from "@/components/ui/AutoRespond";
import AnimatedLayout from "@/animations/AnimatedLayout";
import CustomerForms from "@/components/ui/customer-forms/CustomerForm";

export default function Dashboard() {
  return (
    <AnimatedLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Talk.</h1>
        <CustomerForms />
      </div>
    </AnimatedLayout>
  );
}
