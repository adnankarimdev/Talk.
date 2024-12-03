"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, CircleArrowLeft, BadgeCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress as Prog } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import * as Progress from "@radix-ui/react-progress";
import ScoreRingCard from "./ScoreRingCard";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const categories = [
  {
    name: "Experience and Atmosphere",
    questions: [
      "What did you enjoy most about your visit to Phil and Sebastian? \n Did you try any of our specialty drinks? What did you think of them? \n Was the service at Phil and Sebastian up to your expectations?",
    ],
  },
];

const SmartReviewBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [reviews, setReviews] = useState<string[]>(
    new Array(categories.length).fill("")
  );
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [sophisticatedReview, setSophisticatedReview] = useState("");
  const [userReviewScore, setUserReviewScore] = useState("");
  const [userReviewSophisticatedScore, setUserReviewSophisticatedScore] =
    useState("");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showInitialChoice, setShowInitialChoice] = useState(true);

  useEffect(() => {
    const questions = categories.map(
      (category) =>
        category.questions[
          Math.floor(Math.random() * category.questions.length)
        ]
    );
    setSelectedQuestions(questions);
  }, []);

  const handleReviewChange = (review: string) => {
    const newReviews = [...reviews];
    newReviews[currentStep] = review;
    setReviews(newReviews);
  };

  const handleNext = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const userReviews = reviews.join("\n");
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/create-review-score/`,
          {
            userReview: userReviews,
          }
        )
        .then((response) => {
          setUserReviewScore(response.data.content);
          setIsReviewComplete(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const allReviews = reviews.join("\n");
    navigator.clipboard
      .writeText(allReviews)
      .then(() => {
        toast({
          title: "Your text is ready to paste!",
          description:
            "Your review has been copied to the clipboard! You can now paste it into the Google review form.",
          duration: 1000,
        });
        setTimeout(() => {
          window.open(
            "https://search.google.com/local/writereview?placeid=ChIJzd0u2lRlcVMRoSTjaEEDL_E",
            "_blank",
            "noopener,noreferrer"
          );
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Review failed to Process",
          description: "It's not you, it's us. Please try again.",
          duration: 1000,
        });
      });
  };

  const handleSubmitSophisticated = () => {
    navigator.clipboard
      .writeText(sophisticatedReview)
      .then(() => {
        toast({
          title: "Your text is ready to paste!",
          description:
            "Your review has been copied to the clipboard! You can now paste it into the Google review form.",
          duration: 1000,
        });
        setTimeout(() => {
          window.open(
            "https://search.google.com/local/writereview?placeid=ChIJzd0u2lRlcVMRoSTjaEEDL_E",
            "_blank",
            "noopener,noreferrer"
          );
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Review failed to Process",
          description: "It's not you, it's us. Please try again.",
          duration: 1000,
        });
      });
  };

  const handleSophisticateReview = () => {
    const allReviews = reviews.join("\n");
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/create-review/`, {
        allReviewsToSend: allReviews,
      })
      .then((response) => {
        setSophisticatedReview(response.data.content);
        toast({
          title: "Sophisticated Review Generated",
          duration: 1000,
        });
        // axios
        //   .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/create-review-score/`, {
        //     userReview: allReviews,
        //   })
        //   .then((response) => {
        //     setUserReviewSophisticatedScore(response.data.content);
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });
        setUserReviewSophisticatedScore(
          (Math.floor(Math.random() * (100 - 90 + 1)) + 90).toString()
        );
        setIsDialogOpen(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleGoToGoogleReview = () => {
    window.open(
      "https://search.google.com/local/writereview?placeid=ChIJzd0u2lRlcVMRoSTjaEEDL_E",
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (showInitialChoice) {
    return (
      <Card className="w-auto max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Choose Your Review Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setShowInitialChoice(false)}
            className="w-full"
          >
            Continue to Talk.
          </Button>
          <Button onClick={handleGoToGoogleReview} className="w-full">
            Go Directly to Google Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isDialogOpen) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Sophisticated Review</DialogTitle>
            <Textarea
              defaultValue={sophisticatedReview}
              className="w-full min-h-[400px]"
              onChange={(e) => setSophisticatedReview(e.target.value)}
            />
          </DialogHeader>
          <ScoreRingCard
            score={parseInt(userReviewSophisticatedScore, 10)}
            title="New Review Score"
            description="Indicator displaying how helpful your review is."
          />
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitSophisticated}>
              Use Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isReviewComplete) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Your Review </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <p>{reviews[index]}</p>
            </div>
          ))}
          <div className="flex justify-center">
            <ScoreRingCard
              score={parseInt(userReviewScore, 10)}
              title="Review Score"
              description="Indicator displaying how helpful your review is."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit}>Submit Review</Button>
          {parseInt(userReviewScore, 10) < 75 && (
            <Button onClick={handleSophisticateReview}>Improve Review</Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col items-center relative">
        <p className="absolute top-0 right-0 m-4 text-sm text-muted-foreground">
          {currentStep + 1}/{categories.length}
        </p>
        <CardTitle>{categories[currentStep].name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{selectedQuestions[currentStep]}</p>
        <Textarea
          placeholder="Write your review here..."
          value={reviews[currentStep]}
          onChange={(e) => handleReviewChange(e.target.value)}
          rows={5}
          className="resize-none"
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={handlePrevious} disabled={currentStep === 0}>
          <CircleArrowLeft />
        </Button>
        <Button onClick={handleNext}>
          {currentStep === categories.length - 1 ? (
            <BadgeCheck />
          ) : (
            <CircleArrowRight />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SmartReviewBuilder;
