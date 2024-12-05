"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation"
import { Question } from "@/components/Types/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "../sheet"
import ShinyButton from "../shiny-button"
import { RealTimeTypeForm } from "../typeform/RealTimeForm"
import { motion } from "framer-motion"

export default function CustomerForms() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [questions, setQuestions] = useState<Question[]>([])
  const [openRealTime, setOpenRealTime] = useState(false)
  const [formId, setFormId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-form-by-url/${pathname.slice(1)}/`
        )
        setQuestions(response.data.content)
        setFormId(response.data.form_id)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [pathname])

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleCheckboxChange = (
    questionId: string,
    option: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const currentAnswers = (prev[questionId] as string[]) || []
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, option] }
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((item) => item !== option),
        }
      }
    })
  }

  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium text-gray-700">
              {question.content}
            </Label>
            <Input
              id={question.id}
              placeholder="Type your answer here..."
              value={(answers[question.id] as string) || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )
      case "multiple_choice":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{question.content}</Label>
            <RadioGroup
              onValueChange={(value) => handleInputChange(question.id, value)}
              value={answers[question.id] as string}
              className="space-y-2"
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`${question.id}-option${index + 1}`}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor={`${question.id}-option${index + 1}`} className="text-sm text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{question.content}</Label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-checkbox${index + 1}`}
                    checked={((answers[question.id] as string[]) || []).includes(option)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(question.id, option, checked as boolean)
                    }
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor={`${question.id}-checkbox${index + 1}`} className="text-sm text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium text-gray-700">
              {question.content}
            </Label>
            <Input
              id={question.id}
              type="date"
              value={(answers[question.id] as string) || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )
      default:
        return null
    }
  }

  const handleSubmit = async (realTimeAnswers: any) => {
    const isAnswersEmpty = Object.keys(answers).length === 0
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/save-form-response/`,
        { data: isAnswersEmpty ? realTimeAnswers : answers, formId: formId }
      )
      console.log(response.data.message)
        toast({
          title: "Respone Saved",
        });
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Failed to save Response",
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customer Form</h2>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm"
                >
                  {renderQuestionContent(question)}
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8"
            >
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out"
                onClick={() => handleSubmit(answers)}
              >
                Submit
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Sheet open={openRealTime} onOpenChange={setOpenRealTime}>
        <SheetTrigger>
          <ShinyButton className="fixed top-4 right-4 px-4 py-2 rounded">
            Answer with Voice
          </ShinyButton>
        </SheetTrigger>
        <SheetContent>
          <RealTimeTypeForm
            questions={questions}
            setQuestions={setQuestions}
            answers={answers}
            setAnswers={setAnswers}
            handleSubmit={handleSubmit}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
