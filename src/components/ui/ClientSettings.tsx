"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiAiGenerate, RiTwitterXLine } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toPng } from "html-to-image";
import { Place } from "../Types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  PlusCircle,
  Trash2,
  MapPin,
  Mail,
  NfcIcon,
  PlusIcon,
  XIcon,
  ArrowDownToLine,
  ImageUp,
  Tablet,
  ScanQrCode,
  Wand,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { MdOutlineFormatListNumbered, MdLockOutline } from "react-icons/md";
import { PlaceType } from "../Types/types";
import TabsSkeletonLoader from "./Skeletons/TabsSkeletonLoader";
import Logo from "../../app/favicon.ico";
import RatingBubbleCardClient from "./RatingBubbleCardClient";
import LocationLinkQR from "./LocationQRCodes";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { FaTiktok, FaYoutube } from "react-icons/fa";
import AnimatedLayout from "@/animations/AnimatedLayout";
import AnimatedWandIcon from "./AnimatedIcons/AnimatedWandIcon";
import AnimatedSaveIcon from "./AnimatedIcons/AnimatedSaveIcon";

interface Category {
  name: string;
  badges: { rating: number; badges: string[] }[];
}

export default function ClientSettings() {
  const { toast } = useToast();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedRadioValue, setSelectedRadioValue] = useState("overall");
  const [openQrLinkDialog, setOpenQrLinkDialog] = useState(false);
  const [openQrLinkInStoreDialog, setOpenQrLinkInStoreDialog] = useState(false);
  const [qrLink, setQrLink] = useState("");
  const [qrName, setQrName] = useState("");
  const [qrLinkInStore, setQrLinkInStore] = useState("");
  const [qrNameInStore, setQrNameInStore] = useState("");
  const [userCardDescription, setUserCardDescription] = useState("");
  const [isOnlineBusiness, setIsOnlineBusiness] = useState(false);
  const [accountType, setAccountType] = useState("");
  const qrCodeInStoreRef = useRef<HTMLDivElement>(null);
  const [customerInternalWebsite, setCustomerInternalWebsite] = useState("");
  const [settings, setSettings] = useState({
    questions: [{ id: "", questions: [""] }],
    categories: [],
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
    inStoreUrls: [],
    userEmail: "",
    places: [],
    useBubblePlatform: false,
    emailDelay: 60,
    keywords: [],
    cardDescription: "",
    chosenIcon: "Star",
  });
  const [chosenIcon, setChosenIcon] = useState("Star");
  const [placeIds, setPlaceIds] = useState([]);
  const [placesInfo, setPlacesInfo] = useState<Place[]>([]);
  const [websiteURLS, setWebsiteURLS] = useState([]);
  const [locationURLS, setLocationURLS] = useState([]);
  const [areasToFocusOn, setAreasToFocusOn] = useState("");
  const [websiteAndLocation, setWebsiteAndLocation] = useState([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isTabsLoading, setIsTabsLoading] = useState(true);
  const [companyWebsites, setCompanyWebsites] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<Number>(-1);

  const handleBadgeClick = (index: number, website: string) => {
    if (clickedIndex === index) {
      // If the same index is clicked again, reset the clicked index
      setClickedIndex(-1);
    } else {
      setClickedIndex(index); // Set the clicked index to the new index
      navigator.clipboard
        .writeText(website) // Copy the website to clipboard
        .then(() => {
          toast({
            title: "Link copied to clipboard.",
            duration: 3000,
          });
        })
        .catch((err) => {
          console.error("Failed to copy URL: ", err);
        });
    }
  };

  // const handleQuestionChange = (
  //   ratingId: number,
  //   questionIndex: number,
  //   value: string
  // ) => {
  //   setSettings((prev) => ({
  //     ...prev,
  //     questions: prev.questions.map((q) =>
  //       q.id === ratingId
  //         ? {
  //             ...q,
  //             questions: q.questions.map((oldQ, i) =>
  //               i === questionIndex ? value : oldQ
  //             ),
  //           }
  //         : q
  //     ),
  //   }));
  // };

  // const addQuestion = (ratingId: number) => {
  //   setSettings((prev) => ({
  //     ...prev,
  //     questions: prev.questions.map((q) =>
  //       q.id === ratingId ? { ...q, questions: [...q.questions, ""] } : q
  //     ),
  //   }));
  // };

  // const removeQuestion = (ratingId: number, questionIndex: number) => {
  //   setSettings((prev) => ({
  //     ...prev,
  //     questions: prev.questions.map((q) =>
  //       q.id === ratingId
  //         ? {
  //             ...q,
  //             questions: q.questions.filter((_, i) => i !== questionIndex),
  //           }
  //         : q
  //     ),
  //   }));
  // };

  const handleSettingChange = (
    key: string,
    value:
      | string
      | number
      | boolean
      | { id: number; questions: string[] }[]
      | any
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const validateSettings = () => {
    const errors = [];

    if (!settings.categories || settings.categories.length === 0) {
      errors.push("There must be at least one category.");
    } else {
      settings.categories.forEach((category: Category) => {
        const expectedRatings = [1, 2, 3, 4, 5];
        const actualRatings = category.badges.map((badge) => badge.rating);

        expectedRatings.forEach((rating) => {
          if (!actualRatings.includes(rating)) {
            errors.push(
              `Category "${category.name}" is missing badges for rating ${rating}.`
            );
          } else {
            const badgeForRating = category.badges.find(
              (badge) => badge.rating === rating
            );
            if (badgeForRating && badgeForRating.badges.length === 0) {
              errors.push(
                `Category "${category.name}" must have at least one badge for rating ${rating}.`
              );
            }
          }
        });
      });
    }

    if (
      settings.worryRating < 1 ||
      isNaN(settings.worryRating) ||
      settings.worryRating > 4
    ) {
      errors.push("Worry rating must be a value between 1 and 4");
    }

    if (isNaN(settings.emailDelay) || settings.emailDelay < 1) {
      errors.push(
        "Email Delay must be a positive whole number greater than 0."
      );
    }

    if (!settings.clientEmail) {
      errors.push("Client email is required");
    }

    return errors;
  };

  const handleSave = () => {
    const errors = validateSettings();

    if (errors.length > 0) {
      errors.forEach((error) => {
        toast({
          variant: "destructive",
          title: "Could not Save Settings",
          description: error,
          duration: 3000,
        });
      });
    } else {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/save-review-settings/`,
          settings
        )
        .then((response) => {
          toast({
            title: "Success",
            description: "Settings Saved.",
            duration: 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Failed to update",
            description: error.response.data.error,
            duration: 1000,
          });
        });
    }
  };

  const handleGenerateReviewQuestions = () => {
    setIsTabsLoading(true);

    var fullContext =
      "Badge Categories should focus on these topics: " +
      areasToFocusOn +
      "\n" +
      "Business name \n" +
      placesInfo[0].name;

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/generate-categories/`,
        {
          context: fullContext,
          type: selectedRadioValue,
          accountType: accountType,
        }
      )
      .then((response) => {
        const generatedQuestions = response.data["content"]
          .replace(/```json/g, "")
          .replace(/```/g, "");
        const generatedQuestionsAsJson = JSON.parse(generatedQuestions);
        setCategories(generatedQuestionsAsJson["categories"]);
        handleSettingChange(
          "categories",
          generatedQuestionsAsJson["categories"]
        );
        setIsTabsLoading(false);
        toast({
          title: "Success",
          description: "Badges generated.",
          duration: 1000,
        });
      })
      .catch((error) => {
        setIsTabsLoading(false);
        toast({
          title: "Failed to generate",
          description: "try again",
          duration: 1000,
        });
      });
  };

  const openQrCode = (placeName: string, locationUrl: string) => {
    setOpenQrLinkDialog(true);
    setQrLink(locationUrl);
    setQrName(placeName);
  };

  const openQrCodeInStore = (placeName: string, inStoreLocationUrl: string) => {
    setOpenQrLinkInStoreDialog(true);
    setQrLinkInStore(inStoreLocationUrl);
    setQrNameInStore(placeName);
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() !== "") {
      const updatedKeywords = [...keywords, newKeyword.trim()];
      setKeywords(updatedKeywords);
      setNewKeyword("");
      setIsAddingKeyword(false);
      handleSettingChange("keywords", updatedKeywords);
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    const updatedKeywords = keywords.filter(
      (keyword) => keyword !== keywordToRemove
    );
    setKeywords(updatedKeywords);
    handleSettingChange("keywords", updatedKeywords);
  };

  const handleDownload = async () => {
    if (qrCodeInStoreRef.current) {
      try {
        const dataUrl = await toPng(qrCodeInStoreRef.current, {
          quality: 0.95,
        });
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Error generating image:", err);
      }
    }
  };

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

        const userData = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-user-data/`,
          {
            headers: {
              Authorization: `Bearer ${email}`,
            },
          }
        );
        setAccountType(userData.data.account_type);
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
        setIsOnlineBusiness(
          userData.data.account_type === "influencer" ||
            userData.data.account_type === "online-business"
            ? true
            : false
        );
        setWebsiteURLS(placeIdResponse.data.websiteUrls);
        setLocationURLS(placeIdResponse.data.locationUrls);

        const placeIdsAsArray = placeIdResponse.data.places.map(
          (place: any) => place.place_id
        );
        const placeIdsQuery = placeIdsAsArray.join(",");

        const reviewSettingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-review-settings/${placeIdsQuery}/`
        );

        setSettings(reviewSettingsResponse.data);
        setKeywords(reviewSettingsResponse.data.keywords || []);
        setCategories(reviewSettingsResponse.data.categories);
        setUserCardDescription(reviewSettingsResponse.data.card_description);
        setCompanyWebsites(reviewSettingsResponse.data.companyUrls);
        setChosenIcon(reviewSettingsResponse.data.chosen_icon);
        setCustomerInternalWebsite(
          reviewSettingsResponse.data.internal_website
        );
        console.log("internal ", reviewSettingsResponse.data.internal_website);
        setIsTabsLoading(false);
        if (reviewSettingsResponse.data.questions.length == 0) {
          handleSettingChange(
            "questions",
            Array(4)
              .fill(null)
              .map((_, i) => ({
                id: i + 1,
                questions: [""],
              }))
          );
        }
      } catch (err) {
        console.error(err);
        setIsTabsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent>
        {isTabsLoading && <TabsSkeletonLoader />}
        {!isTabsLoading && (
          <Tabs defaultValue="badges" className="w-full border-transparent">
            <TabsList
              className={`flex w-full border-b border-gray-200 bg-transparent ${
                !isOnlineBusiness ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              <TabsTrigger
                value="badges"
                className="flex-1 px-10 py-2 text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none group relative"
              >
                Badges
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 transition-transform group-data-[state=active]:scale-x-100" />
              </TabsTrigger>
              {!isOnlineBusiness && (
                <TabsTrigger
                  value="email"
                  className="flex-1 px-10 py-2 text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none group relative"
                >
                  Email
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 transition-transform group-data-[state=active]:scale-x-100" />
                </TabsTrigger>
              )}
              <TabsTrigger
                value="locations"
                className="flex-1 px-10 py-2 text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none group relative"
              >
                {isOnlineBusiness ? "Social Media" : "Locations"}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 transition-transform group-data-[state=active]:scale-x-100" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="badges">
              <AnimatedLayout>
                <Sheet>
                  <div className="flex justify-end items-center">
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="mb-2">
                        <AnimatedWandIcon />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>
                          {selectedRadioValue === "overall"
                            ? "Generate Badges"
                            : "Generate Badges & Categories"}
                        </SheetTitle>
                        <SheetDescription>
                          {"This will generate badges using"}{" "}
                          <span className="text-emerald-500">AI.</span> <br />
                          <br />{" "}
                          {
                            "You can input which areas you'd like the Badges to be focused on. Otherwise, the Badges will be generated more generically."
                          }
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                        <Separator className="mb-4" />
                        <RadioGroup
                          defaultValue="overall"
                          value={selectedRadioValue}
                          onValueChange={(value) =>
                            setSelectedRadioValue(value)
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="overall" id="r1" />
                            <Label htmlFor="r1">Overall Rating</Label>
                          </div>
                          {/* Uncomment if you want to include the "Separate Categories" option
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="separate" id="r2" />
              <Label htmlFor="r2">Separate Categories</Label>
            </div> */}
                        </RadioGroup>
                        <Textarea
                          id="areaFocus"
                          className="mt-4"
                          value={areasToFocusOn}
                          onChange={(e) => setAreasToFocusOn(e.target.value)}
                          placeholder="Get creative!"
                        />
                      </div>
                      <SheetFooter>
                        <Button
                          onClick={handleGenerateReviewQuestions}
                          variant="outline"
                        >
                          Generate
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </div>
                </Sheet>

                <div className="flex items-center justify-center space-x-2 mb-5">
                  <RatingBubbleCardClient
                    categories={categories}
                    setCategories={setCategories}
                    businessName={placesInfo[0]?.name || ""}
                    handleSettingChange={handleSettingChange}
                    userCardDescription={userCardDescription}
                    chosenIcon={chosenIcon}
                    setChosenIcon={setChosenIcon}
                  />
                </div>
              </AnimatedLayout>
              {!settings.useBubblePlatform &&
                settings.questions.map((rating) => (
                  <></>
                  // <div key={rating.id} className="mb-6">
                  //   <div className="flex items-center justify-between mb-2">
                  //     <h3 className="text-lg font-semibold">
                  //       Rating {rating.id}
                  //     </h3>
                  //   </div>
                  //   {rating.questions.map((question, index) => (
                  //     <div
                  //       key={index}
                  //       className="flex items-center mb-2 space-x-2"
                  //     >
                  //       <Textarea
                  //         placeholder={`Question ${index + 1} for rating ${rating.id}`}
                  //         value={question}
                  //         onChange={(e) =>
                  //           handleQuestionChange(
                  //             rating.id,
                  //             index,
                  //             e.target.value
                  //           )
                  //         }
                  //         className="w-3/4"
                  //       />
                  //       {index === 0 && (
                  //         <Button
                  //           variant="ghost"
                  //           size="icon"
                  //           onClick={() => addQuestion(rating.id)}
                  //           aria-label={`Add question for rating ${rating.id}`}
                  //         >
                  //           <PlusCircle className="h-4 w-4" />
                  //         </Button>
                  //       )}
                  //       {rating.questions.length > 1 && (
                  //         <Button
                  //           variant="ghost"
                  //           size="icon"
                  //           onClick={() => removeQuestion(rating.id, index)}
                  //           aria-label={`Remove question ${index + 1} for rating ${rating.id}`}
                  //         >
                  //           <Trash2 className="h-4 w-4" />
                  //         </Button>
                  //       )}
                  //     </div>
                  //   ))}
                  // </div>
                ))}
            </TabsContent>
            <TabsContent value="email">
              <AnimatedLayout>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientEmail">
                      Client Email <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-gray-500 text-xs">
                      {settings.worryRating
                        ? `The email address to receive all customer concerns when their rating is between 1 to ${settings.worryRating}.`
                        : "The email address to receive all customer concerns."}
                    </p>
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
                    <Label htmlFor="emailDelay">
                      Email Delay <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-gray-500 text-xs">
                      The time to wait, <strong>in minutes</strong>, before
                      sending the email addressing customer concerns.
                    </p>
                    <Input
                      id="emailDelay"
                      type="number"
                      value={settings.emailDelay}
                      onChange={(e) =>
                        handleSettingChange(
                          "emailDelay",
                          parseInt(e.target.value)
                        )
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="worryRating">
                      Worry Rating Threshold{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-gray-500 text-xs">
                      {settings.worryRating
                        ? `Sets the rating limit to not allow customers from being prompted to post reviews on Google. (Ratings 1 to ${settings.worryRating} are considered negative.)`
                        : "Sets the rating limit to not allow customers from being prompted to post reviews on Google."}
                    </p>
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
                  <div>
                    <div className="flex items-center space-x-2 mt-4">
                      <Switch
                        id="showWorryDialog"
                        checked={settings.showWorryDialog}
                        onCheckedChange={(checked) =>
                          handleSettingChange("showWorryDialog", checked)
                        }
                      />
                      <Label htmlFor="showWorryDialog">Show Worry Dialog</Label>
                    </div>
                    {settings.showWorryDialog && (
                      <div>
                        <div className="mt-2">
                          <Label htmlFor="dialogTitle">Dialog Title</Label>
                          <p className="text-gray-500 text-xs">
                            This is the worry dialog title that will be shown to
                            customers whose overall rating is less than the
                            worry rating threshold.
                          </p>
                          <Input
                            id="dialogTitle"
                            type="text"
                            value={settings.dialogTitle}
                            onChange={(e) =>
                              handleSettingChange("dialogTitle", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="mt-2">
                          <Label htmlFor="dialogBody">Dialog Body</Label>
                          <p className="text-gray-500 text-xs">
                            This is the worry dialog body that will be shown to
                            customers whose overall rating is less than the
                            worry rating threshold.
                          </p>
                          <Textarea
                            id="dialogBody"
                            value={settings.dialogBody}
                            rows={5}
                            onChange={(e) =>
                              handleSettingChange("dialogBody", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedLayout>
            </TabsContent>
            <TabsContent value="locations">
              <AnimatedLayout>
                <div className="space-y-4">
                  <div>
                    <div className="mb-4">
                      {customerInternalWebsite && (
                        <>
                          <Label htmlFor="showComplimentaryItem">
                            Personalized Website
                          </Label>
                          <p className="text-gray-500 text-xs">
                            Powered by Talk.
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              className="p-0 inline-flex items-center justify-center hover:bg-transparent hover:text-current focus:ring-0 active:bg-transparent"
                              onClick={() =>
                                window.open(customerInternalWebsite, "_blank")
                              }
                            >
                              <div className="text-lg font-medium">
                                <Badge
                                  className={cn(
                                    "bg-rose-400  text-white text-xs font-medium mt-2 ml-2 "
                                  )}
                                >
                                  {customerInternalWebsite}
                                </Badge>
                              </div>
                            </Button>
                          </div>
                        </>
                      )}

                      <Separator className="mt-5 mb-5" />
                      <div hidden={isOnlineBusiness}>
                        <Label htmlFor="placeIds">In Store Kiosk Links</Label>
                        <p className="text-gray-500 text-xs">
                          The links that is used for in store reviews, for
                          example, in an in store iPad, to leave feedback.
                        </p>
                        {locationURLS.map((website, index) => (
                          <div key={index}>
                            <Button
                              variant="ghost"
                              disabled={categories.length == 0}
                              className="p-0 inline-flex items-center justify-center hover:bg-transparent hover:text-current focus:ring-0 active:bg-transparent"
                              onClick={() =>
                                openQrCode(placesInfo[index].name, website)
                              }
                            >
                              <div className="text-lg font-medium">
                                <Badge className="text-white">
                                  {" " + placesInfo[index].name}{" "}
                                  <Tablet size={12} className="ml-2" />
                                </Badge>
                              </div>
                            </Button>
                          </div>
                        ))}
                        {openQrLinkDialog && (
                          <div className="flex justify-center p-4">
                            <Dialog
                              open={openQrLinkDialog}
                              onOpenChange={setOpenQrLinkDialog}
                            >
                              <DialogContent className="w-half max-w-2xl">
                                <DialogHeader className="justify-center items-center">
                                  <DialogTitle>Kiosk QR Code</DialogTitle>
                                  <DialogDescription>
                                    Scan this QR code with your iPad or any
                                    device to open the link for{" "}
                                    <a
                                      href={qrLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <strong>{qrName}</strong>
                                    </a>
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-center p-6 bg-background rounded-lg">
                                  <QRCodeSVG value={qrLink} size={200} />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                        <Separator className="mt-5 mb-5" />
                      </div>
                      <Label htmlFor="placeIds">
                        {isOnlineBusiness
                          ? "Social Links"
                          : "Customer Device Links"}
                      </Label>
                      <p className="text-gray-500 text-xs">
                        {isOnlineBusiness
                          ? "The link to use with your Social Media accounts so your followers can engage quickly."
                          : "The links that customers will tap/scan with their own personal devices to leave feedback."}
                      </p>
                      {websiteURLS.map((website, index) => (
                        <div key={index}>
                          <Button
                            variant="ghost"
                            disabled={categories.length == 0}
                            className="p-0 inline-flex items-center justify-center hover:bg-transparent hover:text-current focus:ring-0 active:bg-transparent"
                            onClick={() =>
                              openQrCodeInStore(placesInfo[index].name, website)
                            }
                          >
                            <div className="text-lg font-medium">
                              <div className="flex flex-row">
                                {isOnlineBusiness && (
                                  <Badge variant="outline">
                                    <InstagramLogoIcon className="mr-2" />
                                    <FaTiktok className="mr-2" />
                                    <FaYoutube size={16} className="mr-2" />
                                    <RiTwitterXLine />
                                  </Badge>
                                )}
                                {!isOnlineBusiness && (
                                  <>
                                    <Badge className="text-white">
                                      {" " + placesInfo[index].name}{" "}
                                      <NfcIcon size={12} className="ml-2" />{" "}
                                      <ScanQrCode size={12} className="ml-2" />
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          </Button>
                        </div>
                      ))}
                      {openQrLinkInStoreDialog && (
                        <div className="flex justify-center p-4">
                          <Dialog
                            open={openQrLinkInStoreDialog}
                            onOpenChange={setOpenQrLinkInStoreDialog}
                          >
                            <DialogContent className="w-half max-w-2xl">
                              <div hidden={accountType === "influencer"}>
                                <DialogHeader className="justify-center items-center">
                                  <DialogTitle>
                                    {" "}
                                    {isOnlineBusiness
                                      ? "Printable QR Code"
                                      : "Personal Device QR Code"}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Print this QR code for customers to scan
                                    with ease to leave feedback for{" "}
                                    <a
                                      href={qrLinkInStore}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <strong>{qrNameInStore}</strong>
                                    </a>
                                  </DialogDescription>
                                </DialogHeader>
                                <div
                                  ref={qrCodeInStoreRef}
                                  className="flex justify-center p-6 bg-background rounded-lg"
                                >
                                  <QRCodeSVG value={qrLinkInStore} size={200} />
                                </div>
                                <div className="flex justify-center items-center">
                                  <Button
                                    onClick={handleDownload}
                                    variant="ghost"
                                  >
                                    <ImageUp />
                                  </Button>
                                </div>
                                <Separator />
                              </div>
                              <DialogTitle className="text-center">
                                {isOnlineBusiness
                                  ? "Social Bio/Post Link"
                                  : "Personal Device NFC Link"}
                              </DialogTitle>
                              <DialogDescription>
                                {isOnlineBusiness
                                  ? "Pop this link on your social bio or post so your followers can easily leave feedback for "
                                  : "Copy the link and program it into your NFC tag so customers can easily tap to access it to leave feedback for "}

                                <a
                                  href={qrLinkInStore}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <strong>{qrNameInStore}</strong>
                                </a>
                              </DialogDescription>
                              <div className="flex justify-center p-6 bg-background rounded-lg">
                                <Button
                                  variant="ghost"
                                  disabled={categories.length === 0}
                                  className="p-0 inline-flex items-center justify-center hover:bg-transparent hover:text-current focus:ring-0 active:bg-transparent"
                                  onClick={() =>
                                    handleBadgeClick(0, qrLinkInStore)
                                  }
                                >
                                  <div className="text-lg font-medium">
                                    <Badge className="" variant="outline">
                                      {qrLinkInStore}
                                    </Badge>
                                  </div>
                                </Button>
                              </div>
                            </DialogContent>
                            <DialogFooter></DialogFooter>
                          </Dialog>
                        </div>
                      )}
                      <Separator className="mt-5 mb-5" />
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          id="showComplimentaryItem"
                          checked={settings.showComplimentaryItem}
                          disabled={!settings.showWorryDialog}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "showComplimentaryItem",
                              checked
                            )
                          }
                        />
                        <Label htmlFor="showComplimentaryItem">
                          Offer Complimentary Item
                        </Label>
                      </div>
                      {settings.showComplimentaryItem && (
                        <div className="mt-2">
                          <p className="text-gray-500 text-xs">
                            {
                              "Specify the complimentary items you'd like to offer, which will be shown on the Talk. homepage."
                            }
                          </p>
                          <Input
                            id="complimentaryItem"
                            placeholder="10% off Item A, $2 off next purchase, etc..."
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
                      <div hidden={isOnlineBusiness}>
                        <Separator className="mt-5 mb-5" />
                        <Label htmlFor="keywords">Google Keywords</Label>
                        <p className="text-gray-500 text-xs mb-2">
                          Keywords that will be naturally integrated into
                          customer-generated reviews for posting on Google
                          Reviews.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {keywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="secondary"
                              className="bg-green-500 text-white hover:bg-red-500 cursor-pointer"
                              onClick={() => handleRemoveKeyword(keyword)}
                            >
                              {keyword}
                              <XIcon className="ml-2 h-4 w-4" />
                            </Badge>
                          ))}
                        </div>
                        {isAddingKeyword ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={newKeyword}
                              onChange={(e) => setNewKeyword(e.target.value)}
                              placeholder="Enter new keyword"
                              className="flex-grow"
                            />
                            <Button onClick={handleAddKeyword}>Save</Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsAddingKeyword(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => setIsAddingKeyword(true)}
                            variant="ghost"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Keyword
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedLayout>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isTabsLoading} variant="outline">
          <AnimatedSaveIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}
