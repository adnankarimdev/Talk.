"use client"

import React, { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "../use-toast"
import axios from "axios"
import useSessionId from "@/hooks/useSessionId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RealTimeTypeForm } from "./RealTimeForm"
import { AlignLeft, ListOrdered, CheckSquare, Calendar, Trash2, GripVertical, Loader2 } from 'lucide-react'
import ShinyButton from "../shiny-button"
import AnimatedSaveIcon from "../AnimatedIcons/AnimatedSaveIcon"
import { FormTemplates } from "./form-templates"

type Question = {
  id: string;
  type: string;
  content: string;
  options?: string[];
};

export default function TypeformCreator() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openRealTime, setOpenRealTime] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false)
  const { toast } = useToast();
  const { sessionId } = useSessionId();
  const [formId, setFormId] = useState("")

  const questionTypes = [
    { type: "text", icon: AlignLeft, label: "Text" },
    { type: "multiple_choice", icon: ListOrdered, label: "Multiple Choice" },
    { type: "checkbox", icon: CheckSquare, label: "Checkbox" },
    { type: "date", icon: Calendar, label: "Date" },
  ];

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newQuestions = Array.from(questions);
    const [reorderedItem] = newQuestions.splice(result.source.index, 1);
    newQuestions.splice(result.destination.index, 0, reorderedItem);

    setQuestions(newQuestions);
  };

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: uuidv4().toString(),
      type,
      content: `New ${type} question`,
      options:
        type === "multiple_choice" || type === "checkbox"
          ? ["Option 1", "Option 2"]
          : undefined,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log(questions);
    //axios call to backend here to save form data.
    let localFormId = ""
    try {
      if (formId === "")
      {
        localFormId = uuidv4().toString()
        setFormId(localFormId)
      }
      else
      {
        localFormId = formId
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/save-form-data/`,
        { data: questions, userId: sessionId, formId:localFormId }
      );
      console.log(response.data.content);
      toast({
        title: "Form Saved",
      });
    // Add a delay of 2 seconds (2000 milliseconds) before reloading
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestionContent = (question: Question) => {
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
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={`option${index + 1}`}
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
                  <Checkbox id={`${question.id}-checkbox${index + 1}`} />
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
            <Input id={question.id} type="date" />
          </div>
        );
      default:
        return null;
    }
  };


  const handleSelectTemplate = (templateQuestions: Question[]) => {
    setQuestions(templateQuestions)
    setShowTemplates(false)
  }

  return (
    <div className="flex h-screen ">
      <aside className="w-64 bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Question Types</h2>
        <div className="space-y-2">
          {questionTypes.map((item) => (
            <Card key={item.type} className="cursor-move">
              <CardContent className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => addQuestion(item.type)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          className="w-full mt-4"
          onClick={() => setShowTemplates(true)}
        >
          Use Template
        </Button>
      </aside>
      <main className="flex-1 p-6 overflow-auto">

      {showTemplates ? (
          <FormTemplates onSelectTemplate={handleSelectTemplate} />
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {questions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="mb-4"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move"
                          >
                            <GripVertical className="h-5 w-5 text-gray-500" />
                          </div>
                          <CardTitle className="text-sm font-medium">
                            {
                              questionTypes.find(
                                (t) => t.type === question.type
                              )?.label
                            }
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            aria-label="Remove question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor={`${question.id}-content`}>
                                Question
                              </Label>
                              <Input
                                id={`${question.id}-content`}
                                value={question.content}
                                onChange={(e) =>
                                  updateQuestion(question.id, {
                                    content: e.target.value,
                                  })
                                }
                              />
                            </div>
                            {(question.type === "multiple_choice" ||
                              question.type === "checkbox") && (
                              <div>
                                <Label htmlFor={`${question.id}-options`}>
                                  Options
                                </Label>
                                <Textarea
                                  id={`${question.id}-options`}
                                  value={question.options?.join("\n")}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      options: e.target.value.split("\n"),
                                    })
                                  }
                                  placeholder="Enter each option on a new line"
                                />
                              </div>
                            )}
                            <div className="border-t pt-4">
                              <h4 className="text-sm font-medium mb-2">
                                Preview:
                              </h4>
                              {renderQuestionContent(question)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        )}


      </main>
      <div>

        {isLoading ? (
          <Button variant="outline" className="absolute bottom-4 right-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            variant="outline"
            className="absolute bottom-4 right-4"
          >
            <AnimatedSaveIcon />
          </Button>
        )}
      </div>
    </div>
  );
}
