"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerReviewInfoFromSerializer } from "../Types/types";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import ReviewsSkeletonLoader from "./Skeletons/ReviewsSkeletonLoader";
import FlipCards from "./FlipCards";
import ReviewsClassic from "./ReviewsClassic";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReviewsTab() {
  const [placeIds, setPlaceIds] = useState([]);
  const { toast } = useToast();
  const router = useRouter();
  const [streamlinedView, setStreamlinedView] = useState(true);
  const [reviews, setReviews] = useState<CustomerReviewInfoFromSerializer[]>(
    []
  );
  const [filteredReviews, setFilteredReviews] = useState<
    CustomerReviewInfoFromSerializer[]
  >([]);
  const [selectedRating, setSelectedRating] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
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
        setPlaceIds(placeIdResponse.data.placeIds);

        const placeIdsAsArray = placeIdResponse.data.places.map(
          (place: any) => place.place_id
        );
        const placeIdsQuery = placeIdsAsArray.join(",");

        const reviewSettingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-review-settings/${placeIdsQuery}/`
        );
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-reviews-by-client-ids/`,
          {
            params: {
              clientIds: placeIdsAsArray,
            },
          }
        );
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
        setReviews(
          updatedReviews.sort(
            (a, b) => b.id - a.id
          ) as unknown as CustomerReviewInfoFromSerializer[]
        );
        setFilteredReviews(
          updatedReviews.sort(
            (a, b) => b.id - a.id
          ) as unknown as CustomerReviewInfoFromSerializer[]
        );
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRating === "all") {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(
        reviews.filter((review) => review.rating === parseInt(selectedRating))
      );
    }
  }, [selectedRating, reviews]);

  const findKeywordsInReview = (textBody: string, keywordsArray: string[]) => {
    const foundKeywords: string[] = [];

    keywordsArray.forEach((keyword) => {
      if (textBody.toLowerCase().includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });

    return foundKeywords;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Select value={selectedRating} onValueChange={setSelectedRating}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <ReviewsSkeletonLoader />}

      {!isLoading && streamlinedView && <FlipCards reviews={filteredReviews} />}

      {!isLoading && !streamlinedView && (
        <ReviewsClassic reviews={filteredReviews} />
      )}

      {!isLoading && filteredReviews.length === 0 && (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-xl md:text-xl lg:text-xl font-bold tracking-tight">
            {selectedRating === "all"
              ? "Watch Talk. work its magic. Reviews coming soon! 🚀"
              : `No ${selectedRating}-star reviews posted with Talk..`}
          </h1>
        </div>
      )}
    </div>
  );
}
