import React from 'react'
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid';
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
      { id: uuidv4().toString(), type: 'text', content: "What's your full name?" },
      { id: uuidv4().toString(), type: 'text', content: "What's the best email address to reach you?" },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "What product/service are you interested in?", options: ['Product A', 'Service B', 'Consultation', 'Other'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "What's your budget for this project?", options: ['$0 - $1,000', '$1,001 - $5,000', '$5,001 - $10,000', '$10,000+'] },
    ]
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback Form',
    description: 'Gather feedback on products, services, or experiences.',
    questions: [
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How satisfied are you with our service?", options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
      { id: uuidv4().toString(), type: 'text', content: "What could we improve?" },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How likely are you to recommend us to a friend?", options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
    ]
  },
  {
    id: 'event-registration',
    name: 'Event Registration Form',
    description: 'Allow users to register for events or webinars.',
    questions: [
      { id: uuidv4().toString(), type: 'text', content: "What's your name?" },
      { id: uuidv4().toString(), type: 'text', content: "What's your email address?" },
      { id: uuidv4().toString(), type: 'checkbox', content: "Which session(s) would you like to attend?", options: ['Morning Keynote', 'Afternoon Workshop', 'Evening Networking'] },
      { id: uuidv4().toString(), type: 'text', content: "Do you have any dietary restrictions?" },
    ]
  },
  {
    id: 'job-application',
    name: 'Job Application Form',
    description: 'Streamline the hiring process by collecting applicant data.',
    questions: [
      { id: uuidv4().toString(), type: 'text', content: "What's your full name?" },
      { id: uuidv4().toString(), type: 'text', content: "What's your email address?" },
      { id: uuidv4().toString(), type: 'text', content: "What role are you applying for?" },
      { id: uuidv4().toString(), type: 'text', content: "Tell us about your previous experience." },
      { id: uuidv4().toString(), type: 'date', content: "When are you available to start?" },
    ]
  },
  {
    id: 'quiz',
    name: 'Quiz or Assessment Form',
    description: 'Create engaging quizzes for learning, fun, or lead qualification.',
    questions: [
      { id: uuidv4().toString(), type: 'multiple_choice', content: "What's your level of expertise in [topic]?", options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "Question 1: [Your question here]", options: ['Option A', 'Option B', 'Option C', 'Option D'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "Question 2: [Your question here]", options: ['Option A', 'Option B', 'Option C', 'Option D'] },
    ]
  },
  {
    id: 'contact',
    name: 'Contact Us Form',
    description: 'Provide a simple way for users to get in touch.',
    questions: [
      { id: uuidv4().toString(), type: 'text', content: "What's your name?" },
      { id: uuidv4().toString(), type: 'text', content: "What's your email address?" },
      { id: uuidv4().toString(), type: 'text', content: "What's the subject of your inquiry?" },
      { id: uuidv4().toString(), type: 'text', content: "What's your question or concern?" },
    ]
  },
  {
    id: 'order-form',
    name: 'Order Form',
    description: 'Take orders for products or services.',
    questions: [
      { id: uuidv4().toString(), type: 'text', content: "What's your full name?" },
      { id: uuidv4().toString(), type: 'text', content: "What's your email address?" },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "What product are you ordering?", options: ['Product A', 'Product B', 'Product C', 'Custom Order'] },
      { id: uuidv4().toString(), type: 'text', content: "How many units would you like to order?" },
      { id: uuidv4().toString(), type: 'text', content: "What's your shipping address?" },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you like to pay?", options: ['Credit Card', 'PayPal', 'Bank Transfer'] },
    ]
  },
  {
    id: 'market-research',
    name: 'Market Research Survey',
    description: 'Gather insights about customers, industries, or competitors.',
    questions: [
      { id: uuidv4().toString(), type: 'multiple_choice', content: "What's your age group?", options: ['18-24', '25-34', '35-44', '45-54', '55+'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How often do you use [product/service]?", options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'] },
      { id: uuidv4().toString(), type: 'checkbox', content: "What features do you value most in [product/service]?", options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'] },
      { id: uuidv4().toString(), type: 'text', content: "What other [products/services] do you use?" },
      { id: uuidv4().toString(), type: 'text', content: "What's your biggest challenge in [area]?" },
    ]
  },
  {
    id: 'product-feedback',
    name: 'Product Feedback Survey',
    description: 'Collect detailed feedback on specific products or features.',
    questions: [
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How long have you been using our product?", options: ['Less than a month', '1-6 months', '6-12 months', 'More than a year'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you rate the new feature?", options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'] },
      { id: uuidv4().toString(), type: 'text', content: "What do you like most about this feature?" },
      { id: uuidv4().toString(), type: 'text', content: "What improvements would you suggest for this feature?" },
      { id: uuidv4().toString(), type: 'text', content: "Are there any additional features you'd like to see?" },
    ]
  },
  {
    id: 'employee-satisfaction',
    name: 'Employee Satisfaction Survey',
    description: 'Measure employee satisfaction and gather feedback on workplace conditions.',
    questions: [
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How satisfied are you with your current job?", options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you rate your work-life balance?", options: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "Do you see opportunities for career growth within the company?", options: ['Definitely', 'Somewhat', 'Not Sure', 'Not Really', 'Definitely Not'] },
      { id: uuidv4().toString(), type: 'text', content: "What feedback do you have for your direct manager?" },
      { id: uuidv4().toString(), type: 'text', content: "What suggestions do you have to improve the workplace?" },
    ]
  },
  {
    id: 'event-feedback',
    name: 'Event Feedback Form',
    description: 'Gather feedback from attendees after an event or conference.',
    questions: [
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you rate the overall event?", options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'] },
      { id: uuidv4().toString(), type: 'text', content: "What was your favorite session or aspect of the event?" },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you rate the quality of speakers?", options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you rate the venue and facilities?", options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "Would you attend this event again in the future?", options: ['Definitely', 'Probably', 'Not Sure', 'Probably Not', 'Definitely Not'] },
      { id: uuidv4().toString(), type: 'text', content: "Do you have any suggestions for improving future events?" },
    ]
  },
  {
    id: 'website-usability',
    name: 'Website Usability Survey',
    description: 'Evaluate the user experience and usability of a website.',
    questions: [
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How easy is it to navigate our website?", options: ['Very Easy', 'Easy', 'Neutral', 'Difficult', 'Very Difficult'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How quickly can you find the information you need?", options: ['Very Quickly', 'Quickly', 'Average', 'Slowly', 'Very Slowly'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you rate the visual appeal of our website?", options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you rate the mobile experience of our website?", options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'] },
      { id: uuidv4().toString(), type: 'checkbox', content: "Which areas of our website need improvement?", options: ['Navigation', 'Design', 'Content', 'Speed', 'Mobile Responsiveness', 'Search Functionality'] },
      { id: uuidv4().toString(), type: 'text', content: "Are there any features you'd like to see added to our website?" },
    ]
  },
  {
    id: 'course-evaluation',
    name: 'Course Evaluation Form',
    description: 'Gather feedback from students about a course or training program.',
    questions: [
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you rate the course content?", options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How effective was the instructor in delivering the course material?", options: ['Extremely Effective', 'Very Effective', 'Moderately Effective', 'Slightly Effective', 'Not Effective at All'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you describe the pace of the course?", options: ['Too Fast', 'Somewhat Fast', 'Just Right', 'Somewhat Slow', 'Too Slow'] },
      { id: uuidv4().toString(), type: 'multiple_choice', content: "How would you rate the quality of course materials?", options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'] },
      { id: uuidv4().toString(), type: 'text', content: "What was the most valuable thing you learned from this course?" },
      { id: uuidv4().toString(), type: 'text', content: "Do you have any suggestions for improving this course?" },
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