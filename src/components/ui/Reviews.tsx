import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomerReviewInfoFromSerializer } from "../Types/types";
import { useState, useEffect } from "react";
import axios from "axios";
import ReviewsSkeletonLoader from "./Skeletons/ReviewsSkeletonLoader";

export default function ReviewsTab({}: any) {
  const [placeIds, setPlaceIds] = useState([]);
  const [reviews, setReviews] = useState<CustomerReviewInfoFromSerializer[]>(
    []
  );
  const customerProfiles = [
    {
      id: 1,
      customerProfile: "Grumpy Gus",
      Description: "Totally unimpressed and ready to rant.",
    },
    {
      id: 2,
      customerProfile: "Meh Maggie",
      Description: "Couldn’t care less, just average.",
    },
    {
      id: 3,
      customerProfile: "Content Carl",
      Description: "Fine with it, nothing to write home about.",
    },
    {
      id: 4,
      customerProfile: "Chipper Charlie",
      Description: "Quite happy, had a good time!",
    },
    {
      id: 5,
      customerProfile: "Raving Ricky",
      Description: "Absolutely thrilled, shouting from the rooftops!",
    },
  ];
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        console.log("email in local", email);
        if (!email) {
          console.error("Email not found in localStorage");
          return;
        }

        // First, fetch the placeId
        const placeIdResponse = await axios.get(
          `http://localhost:8021/backend/get-place-id-by-email/${email}/`
        );
        setPlaceIds(placeIdResponse.data.placeIds);

        const placeIdsAsArray = placeIdResponse.data.places.map(
          (place: any) => place.place_id
        );
        console.log(placeIdsAsArray);
        const placeIdsQuery = placeIdsAsArray.join(",");

        const reviewSettingsResponse = await axios.get(
          `http://localhost:8021/backend/get-review-settings/${placeIdsQuery}/`
        );
        const response = await axios.get(
          "http://localhost:8021/backend/get-reviews-by-client-ids/",
          {
            params: {
              clientIds: placeIdsAsArray,
            },
          }
        );
        console.log("Reviews:", response.data);
        const data = response.data as CustomerReviewInfoFromSerializer[];
        const updatedReviews = data.map((review) => {
          // Convert badges JSON string to array or empty array if invalid
          const badgesArray = review.badges ? JSON.parse(review.badges) : [];
          return {
            ...review,
            badges: Array.isArray(badgesArray) ? badgesArray : [],
            internal_google_key_words: findKeywordsInReview(
              review.final_review_body,
              reviewSettingsResponse.data.keywords
            ),
          };
        });
        setReviews(updatedReviews);
        console.log(updatedReviews);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        false;
      }
    };

    fetchData();
  }, []);

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return ""; // Handle empty or null strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const findKeywordsInReview = (textBody: string, keywordsArray: string[]) => {
    const foundKeywords: string[] = [];

    keywordsArray.forEach((keyword) => {
      if (textBody.toLowerCase().includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });

    return foundKeywords;
  };

  const avatarImage = (rating: number) => {
    return `/Avatars/rating${rating}.png`;
  };
  return (
    <div className="space-y-8">
      {isLoading && <ReviewsSkeletonLoader />}
      {reviews.map((review) => (
        <Card key={review.id} className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatarImage(review.rating)} />
              </Avatar>
              <div className="flex flex-col">
                <span className="flex items-center">{review.location}</span>
                <span className="text-sm text-muted-foreground">
                  {review.review_date}
                </span>
              </div>

              <span className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? "text-black fill-black" : "text-gray-300"}`}
                  />
                ))}
              </span>
            </CardTitle>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Review Analysis</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(review.analyzed_review_details).length != 0 && (
                  <Badge variant="outline">
                    Emotion:{" "}
                    {capitalizeFirstLetter(
                      review.analyzed_review_details.emotion
                    )}
                  </Badge>
                )}
                {Object.keys(review.analyzed_review_details).length != 0 && (
                  <Badge variant="outline">
                    Tone:{" "}
                    {capitalizeFirstLetter(review.analyzed_review_details.tone)}
                  </Badge>
                )}
                <Badge variant="outline">
                  {review.posted_to_google_review
                    ? "Posted to Google: 🥳"
                    : "Posted to Google: 🚫"}
                </Badge>
                {review.generated_review_body !== "" && (
                  <Badge variant="outline">{"AI-assisted review: 🤖"}</Badge>
                )}
                <Badge variant="outline">
                  {review.email_sent_to_company
                    ? "Email Sent: ✅"
                    : "Email Sent: ❌"}
                </Badge>
                {/* <Badge variant="outline">
                  {"Review Writing Time: "}
                  {review.time_taken_to_write_review_in_seconds.toFixed(2)}s
                </Badge> */}
              </div>
            </div>
            <div>
              <Separator className="mb-4" />
              <h3 className="text-lg font-semibold mb-2">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {review.posted_with_bubble_rating_platform &&
                  review.badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white-500 text-black "
                    >
                      {badge}
                    </Badge>
                  ))}
                {!review.posted_with_bubble_rating_platform && (
                  <span className="text-sm text-muted-foreground">
                    {"Free form platform was used."}
                  </span>
                )}
              </div>
            </div>
            <div>
              <Separator className="mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Google Keywords Mentioned
              </h3>
              <div className="flex flex-wrap gap-2">
                {review.posted_to_google_review &&
                  review.internal_google_key_words.map((badge, index) => (
                    <Badge
                      key={index}
                      className="bg-green-500 text-white hover:bg-green-500 hover:text-white cursor-pointer"
                    >
                      {badge}
                    </Badge>
                  ))}
                {!review.posted_to_google_review && (
                  <span className="text-sm text-muted-foreground">
                    {
                      "No keywords mentioned since this review was not posted to Google."
                    }
                  </span>
                )}
              </div>
            </div>
            <div>
              <Separator className="mb-4" />
              <h3 className="text-lg font-semibold mb-2">Review Content</h3>
              <p className="text-sm text-muted-foreground">
                {review.final_review_body ||
                  review.generated_review_body ||
                  "The customer did not provide any review content."}
              </p>
            </div>
            <div>
              <Separator className="mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analysis Reasoning</h3>
              {review.analyzed_review_details.reasoning !== "" && (
                <p className="text-sm text-muted-foreground">
                  {review.analyzed_review_details.reasoning}
                </p>
              )}

              {Object.keys(review.analyzed_review_details).length == 0 && (
                <p className="text-sm text-muted-foreground">
                  {"Since there is no review body, there is no analysis."}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {!isLoading && reviews.length == 0 && (
        <div className="flex justify-center items-center h-screen">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <span className="flex items-center text-md font-semibold justify-center">
                  Watch Vero work its magic. Reviews coming soon! 🚀
                </span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
}
