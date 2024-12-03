"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Check, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Place } from "../Types/types";
import { useRouter } from "next/navigation";
import axios from "axios";

const steps = [
  {
    title: "Welcome to ClientSettings",
    content:
      "This onboarding will guide you through setting up your customer feedback system. We'll cover questions, email settings, ratings, and locations. You can try out the settings as we go!",
  },
  {
    title: "Setting Up Questions",
    content:
      "Let's set up questions for each rating level. You can add, edit, or remove questions as needed.",
  },
  {
    title: "Configuring Email Settings",
    content:
      "Now, let's set up your email configuration. Enter your client email, app password, and customize the email content.",
  },
  {
    title: "Adjusting Rating Settings",
    content:
      "Here, you can set the worry rating threshold and configure the worry dialog that appears for low ratings.",
  },
  {
    title: "Managing Locations",
    content:
      "Let's review your registered places and set up a complimentary item offer if you'd like.",
  },
  {
    title: "Saving Your Settings",
    content:
      "Great job! You've configured your settings. Click 'Save Settings' to apply your changes and start using your customer feedback system.",
  },
];

export default function Onboarding() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [placesInfo, setPlacesInfo] = useState<Place[]>([]);
  const [websiteURLS, setWebsiteURLS] = useState([]);
  const [placeIds, setPlaceIds] = useState([]);
  const router = useRouter();
  const [settings, setSettings] = useState({
    questions: Array(4)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        questions: [""],
      })),
    emailIntro: "",
    emailSignature: "",
    emailBody: "",
    emailAppPassword: "",
    clientEmail: "",
    worryRating: 4,
    showWorryDialog: true,
    placeIds: [],
    showComplimentaryItem: false,
    complimentaryItem: "",
    dialogBody: "",
    dialogTitle: "",
    websiteUrls: [],
    userEmail: "",
    places: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = sessionStorage.getItem("authToken");
        if (!email) {
          toast({
            title: "Please sign in.",
            duration: 3000,
          });
          router.push("/login");
          console.error("Email not found in localStorage");
          return;
        }

        // First, fetch the placeId
        const placeIdResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-place-id-by-email/`,
          {
            headers: {
              Authorization: `Bearer ${email}`,
            },
          }
        );
        handleSettingChange("placeIds", placeIdResponse.data.placeIds);
        handleSettingChange("userEmail", email as string);
        setPlaceIds(placeIdResponse.data.placeIds);
        setPlacesInfo(placeIdResponse.data.places);
        setWebsiteURLS(placeIdResponse.data.websiteUrls);

        const placeIdsAsArray = placeIdResponse.data.places.map(
          (place: any) => place.place_id
        );
        const placeIdsQuery = placeIdsAsArray.join(",");

        // Then, use the fetched placeId to get the review settings
        const reviewSettingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-review-settings/${placeIdsQuery}/`
        );

        // Update the settings state
        setSettings(reviewSettingsResponse.data);

        if (reviewSettingsResponse.data.questions.length == 0) {
          handleSettingChange(
            "questions",
            Array(5)
              .fill(null)
              .map((_, i) => ({
                id: i + 1,
                questions: [""],
              }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionChange = (
    ratingId: number,
    questionIndex: number,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === ratingId
          ? {
              ...q,
              questions: q.questions.map((oldQ, i) =>
                i === questionIndex ? value : oldQ
              ),
            }
          : q
      ),
    }));
  };

  const addQuestion = (ratingId: number) => {
    setSettings((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === ratingId ? { ...q, questions: [...q.questions, ""] } : q
      ),
    }));
  };

  const removeQuestion = (ratingId: number, questionIndex: number) => {
    setSettings((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === ratingId
          ? {
              ...q,
              questions: q.questions.filter((_, i) => i !== questionIndex),
            }
          : q
      ),
    }));
  };

  const handleSave = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/save-review-settings/`,
        settings
      )
      .then((response) => {
        toast({
          title: "Success",
          description: "Settings Updated. Welcome to Talk.",
          duration: 1000,
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      })
      .catch((error) => {
        toast({
          title: "Failed to update",
          description: error.response.data.error,
          duration: 1000,
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Start Onboarding</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {steps.length}
          </DialogDescription>
        </DialogHeader>
        <Card className="mt-4">
          <CardContent className="pt-4">
            <p className="mb-4">{steps[currentStep].content}</p>
            <Tabs
              value={
                currentStep === 0
                  ? "welcome"
                  : ["questions", "email", "ratings", "locations", "save"][
                      currentStep - 1
                    ]
              }
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="questions" disabled={currentStep < 1}>
                  Questions
                </TabsTrigger>
                <TabsTrigger value="email" disabled={currentStep < 2}>
                  Email
                </TabsTrigger>
                <TabsTrigger value="ratings" disabled={currentStep < 3}>
                  Ratings
                </TabsTrigger>
                <TabsTrigger value="locations" disabled={currentStep < 4}>
                  Locations
                </TabsTrigger>
                <TabsTrigger value="save" disabled={currentStep < 5}>
                  Save
                </TabsTrigger>
              </TabsList>
              <TabsContent value="questions">
                {settings.questions.map((rating) => (
                  <div key={rating.id} className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Rating {rating.id}
                    </h3>
                    {rating.questions.map((question, index) => (
                      <div
                        key={index}
                        className="flex items-center mb-2 space-x-2"
                      >
                        <Input
                          placeholder={`Question ${index + 1} for rating ${rating.id}`}
                          value={question}
                          onChange={(e) =>
                            handleQuestionChange(
                              rating.id,
                              index,
                              e.target.value
                            )
                          }
                          className="w-3/4"
                        />
                        {index === 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => addQuestion(rating.id)}
                            aria-label={`Add question for rating ${rating.id}`}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {rating.questions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(rating.id, index)}
                            aria-label={`Remove question ${index + 1} for rating ${rating.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="email">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={settings.clientEmail}
                      onChange={(e) =>
                        handleSettingChange("clientEmail", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailAppPassword">App Password</Label>
                    <Input
                      id="emailAppPassword"
                      type="password"
                      value={settings.emailAppPassword}
                      onChange={(e) =>
                        handleSettingChange("emailAppPassword", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailIntro">Email Introduction</Label>
                    <Textarea
                      id="emailIntro"
                      value={settings.emailIntro}
                      onChange={(e) =>
                        handleSettingChange("emailIntro", e.target.value)
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="ratings">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="worryRating">Worry Rating Threshold</Label>
                    <Input
                      id="worryRating"
                      type="number"
                      min="1"
                      max="5"
                      value={settings.worryRating}
                      onChange={(e) =>
                        handleSettingChange(
                          "worryRating",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showWorryDialog"
                      checked={settings.showWorryDialog}
                      onCheckedChange={(checked) =>
                        handleSettingChange("showWorryDialog", checked)
                      }
                    />
                    <Label htmlFor="showWorryDialog">Show Worry Dialog</Label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="locations">
                <div className="space-y-4">
                  <Label htmlFor="placeIds">Registered Places</Label>
                  {websiteURLS.map((website, index) => (
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      <div className="text-lg font-medium">
                        <Badge className="text-white">
                          {" " + placesInfo[index].name}
                        </Badge>
                      </div>
                    </a>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showComplimentaryItem"
                      checked={settings.showComplimentaryItem}
                      onCheckedChange={(checked) =>
                        handleSettingChange("showComplimentaryItem", checked)
                      }
                    />
                    <Label htmlFor="showComplimentaryItem">
                      Offer Complimentary Item
                    </Label>
                  </div>
                  {settings.showComplimentaryItem && (
                    <div>
                      <Label htmlFor="complimentaryItem">
                        Complimentary Item
                      </Label>
                      <Input
                        id="complimentaryItem"
                        value={settings.complimentaryItem}
                        onChange={(e) =>
                          handleSettingChange(
                            "complimentaryItem",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="save">
                <p>
                  Review your settings and click 'Save Settings' to apply your
                  changes.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <DialogFooter className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          ) : (
            <Button onClick={handleNext}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Next
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
