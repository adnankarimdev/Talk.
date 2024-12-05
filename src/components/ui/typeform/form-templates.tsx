import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Template = {
  id: string
  name: string
  description: string
  questions: Question[]
}

type Question = {
  id: string
  type: string
  content: string
  options?: string[]
}

const templates: Template[] = [
  {
    id: 'lead-generation',
    name: 'Lead Generation Form',
    description: 'Collect contact information from potential clients or customers.',
    questions: [
      { id: 'name', type: 'text', content: "What's your full name?" },
      { id: 'email', type: 'text', content: "What's the best email address to reach you?" },
      { id: 'interest', type: 'multiple_choice', content: "What product/service are you interested in?", options: ['Product A', 'Service B', 'Consultation', 'Other'] },
      { id: 'budget', type: 'multiple_choice', content: "What's your budget for this project?", options: ['$0 - $1,000', '$1,001 - $5,000', '$5,001 - $10,000', '$10,000+'] },
    ]
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback Form',
    description: 'Gather feedback on products, services, or experiences.',
    questions: [
      { id: 'satisfaction', type: 'multiple_choice', content: "How satisfied are you with our service?", options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
      { id: 'improvement', type: 'text', content: "What could we improve?" },
      { id: 'nps', type: 'multiple_choice', content: "How likely are you to recommend us to a friend?", options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
    ]
  },
  {
    id: 'event-registration',
    name: 'Event Registration Form',
    description: 'Allow users to register for events or webinars.',
    questions: [
      { id: 'name', type: 'text', content: "What's your name?" },
      { id: 'email', type: 'text', content: "What's your email address?" },
      { id: 'sessions', type: 'checkbox', content: "Which session(s) would you like to attend?", options: ['Morning Keynote', 'Afternoon Workshop', 'Evening Networking'] },
      { id: 'dietary', type: 'text', content: "Do you have any dietary restrictions?" },
    ]
  },
  {
    id: 'job-application',
    name: 'Job Application Form',
    description: 'Streamline the hiring process by collecting applicant data.',
    questions: [
      { id: 'name', type: 'text', content: "What's your full name?" },
      { id: 'email', type: 'text', content: "What's your email address?" },
      { id: 'role', type: 'text', content: "What role are you applying for?" },
      { id: 'experience', type: 'text', content: "Tell us about your previous experience." },
      { id: 'start-date', type: 'date', content: "When are you available to start?" },
    ]
  },
  {
    id: 'quiz',
    name: 'Quiz or Assessment Form',
    description: 'Create engaging quizzes for learning, fun, or lead qualification.',
    questions: [
      { id: 'expertise', type: 'multiple_choice', content: "What's your level of expertise in [topic]?", options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
      { id: 'question1', type: 'multiple_choice', content: "Question 1: [Your question here]", options: ['Option A', 'Option B', 'Option C', 'Option D'] },
      { id: 'question2', type: 'multiple_choice', content: "Question 2: [Your question here]", options: ['Option A', 'Option B', 'Option C', 'Option D'] },
    ]
  },
  {
    id: 'contact',
    name: 'Contact Us Form',
    description: 'Provide a simple way for users to get in touch.',
    questions: [
      { id: 'name', type: 'text', content: "What's your name?" },
      { id: 'email', type: 'text', content: "What's your email address?" },
      { id: 'subject', type: 'text', content: "What's the subject of your inquiry?" },
      { id: 'message', type: 'text', content: "What's your question or concern?" },
    ]
  },
  {
    id: 'order-form',
    name: 'Order Form',
    description: 'Take orders for products or services.',
    questions: [
      { id: 'name', type: 'text', content: "What's your full name?" },
      { id: 'email', type: 'text', content: "What's your email address?" },
      { id: 'product', type: 'multiple_choice', content: "What product are you ordering?", options: ['Product A', 'Product B', 'Product C', 'Custom Order'] },
      { id: 'quantity', type: 'text', content: "How many units would you like to order?" },
      { id: 'shipping', type: 'text', content: "What's your shipping address?" },
      { id: 'payment', type: 'multiple_choice', content: "How would you like to pay?", options: ['Credit Card', 'PayPal', 'Bank Transfer'] },
    ]
  },
  {
    id: 'market-research',
    name: 'Market Research Survey',
    description: 'Gather insights about customers, industries, or competitors.',
    questions: [
      { id: 'age', type: 'multiple_choice', content: "What's your age group?", options: ['18-24', '25-34', '35-44', '45-54', '55+'] },
      { id: 'frequency', type: 'multiple_choice', content: "How often do you use [product/service]?", options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'] },
      { id: 'features', type: 'checkbox', content: "What features do you value most in [product/service]?", options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'] },
      { id: 'competitors', type: 'text', content: "What other [products/services] do you use?" },
      { id: 'improvements', type: 'text', content: "What's your biggest challenge in [area]?" },
    ]
  },
]

interface FormTemplatesProps {
  onSelectTemplate: (questions: Question[]) => void
}

export function FormTemplates({ onSelectTemplate }: FormTemplatesProps) {
  return (
    <ScrollArea className="h-[calc(100vh-2rem)] pr-4">
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onSelectTemplate(template.questions)}>
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

