import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

type FormPreviewProps = {
  question: {
    id: string;
    type: string;
    content: string;
  };
};

export function FormPreview({ question }: FormPreviewProps) {
  const renderQuestionContent = () => {
    switch (question.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id}>{question.content}</Label>
            <Input id={question.id} placeholder="Type your answer here..." />
          </div>
        );
      case "multiple_choice":
        return (
          <div className="space-y-2">
            <Label>{question.content}</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id={`${question.id}-option1`} />
                <Label htmlFor={`${question.id}-option1`}>Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id={`${question.id}-option2`} />
                <Label htmlFor={`${question.id}-option2`}>Option 2</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            <Label>{question.content}</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id={`${question.id}-checkbox1`} />
                <Label htmlFor={`${question.id}-checkbox1`}>Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id={`${question.id}-checkbox2`} />
                <Label htmlFor={`${question.id}-checkbox2`}>Option 2</Label>
              </div>
            </div>
          </div>
        );
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id}>{question.content}</Label>
            <Input id={question.id} type="date" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.content}</CardTitle>
      </CardHeader>
      <CardContent>{renderQuestionContent()}</CardContent>
    </Card>
  );
}
