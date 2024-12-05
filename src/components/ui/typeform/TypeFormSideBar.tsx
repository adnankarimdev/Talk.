import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlignLeft, ListOrdered, CheckSquare, Calendar } from "lucide-react";

type SidebarProps = {
  onAddQuestion: (type: string) => void;
};

export function Sidebar({ onAddQuestion }: SidebarProps) {
  const questionTypes = [
    { type: "text", icon: AlignLeft, label: "Text" },
    { type: "multiple_choice", icon: ListOrdered, label: "Multiple Choice" },
    { type: "checkbox", icon: CheckSquare, label: "Checkbox" },
    { type: "date", icon: Calendar, label: "Date" },
  ];

  return (
    <aside className="w-64 bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Question Types</h2>
      <div className="space-y-2">
        {questionTypes.map((item) => (
          <Card key={item.type} className="cursor-move">
            <CardContent className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onAddQuestion(item.type)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </aside>
  );
}
