"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Question } from "@/components/Types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "../sheet";
import ShinyButton from "../shiny-button";
import { RealTimeTypeForm } from "../typeform/RealTimeForm";

interface SurveyQuestionsProps {}

export default function CustomerForms() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openRealTime, setOpenRealTime] = useState(false);
  const pathname = usePathname();
  console.log(window.location.href);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-form-by-url/${pathname.slice(1)}/`
        );

        setQuestions(response.data.content);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    fetchData();
  }, []); // Add dependencies if needed
  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (
    questionId: string,
    option: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const currentAnswers = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, option] };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((item) => item !== option),
        };
      }
    });
  };

  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id}>{question.content}</Label>
            <Input
              id={question.id}
              placeholder="Type your answer here..."
              value={(answers[question.id] as string) || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </div>
        );
      case "multiple_choice":
        return (
          <div className="space-y-2">
            <Label>{question.content}</Label>
            <RadioGroup
              onValueChange={(value) => handleInputChange(question.id, value)}
              value={answers[question.id] as string}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`${question.id}-option${index + 1}`}
                  />
                  <Label htmlFor={`${question.id}-option${index + 1}`}>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            <Label>{question.content}</Label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-checkbox${index + 1}`}
                    checked={(
                      (answers[question.id] as string[]) || []
                    ).includes(option)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        question.id,
                        option,
                        checked as boolean
                      )
                    }
                  />
                  <Label htmlFor={`${question.id}-checkbox${index + 1}`}>
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id}>{question.content}</Label>
            <Input
              id={question.id}
              type="date"
              value={(answers[question.id] as string) || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(answers)
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
            {renderQuestionContent(question)}
          </div>
        ))}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
      <Sheet open={openRealTime} onOpenChange={setOpenRealTime}>
        <SheetTrigger>
          <ShinyButton className="absolute top-4 right-4 px-4 py-2 rounded">
            Answer with Voice
          </ShinyButton>
        </SheetTrigger>
        <SheetContent>
          <RealTimeTypeForm
            questions={questions}
            setQuestions={setQuestions}
            answers={answers}
            setAnswers={setAnswers}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
