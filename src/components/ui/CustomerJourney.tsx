"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartCustomerJourneyFormat,
  CustomerReviewInfoFromSerializer,
} from "../Types/types";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomerJourneyChart } from "./CustomerJourneyChart";
import { AestheticLoader } from "./Skeletons/GeneratingLoader";

type RatingToBadges = {
  [key: number]: string[];
};

type CustomerSvgs = {
  email: string;
  avatar_svg: string;
};

export default function CustomerJourney() {
  const router = useRouter();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<CustomerReviewInfoFromSerializer[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [placeIds, setPlaceIds] = useState([]);
  const [customerJournies, setCustomerJournies] = useState<{
    [key: string]: any;
  }>({});
  const [customerEmail, setCustomerEmail] = useState("");
  const [ratingToBadgesData, setRatingsToBadgesData] = useState<RatingToBadges>(
    {}
  );
  const [chartData, setChartData] = useState<ChartCustomerJourneyFormat[]>([]);
  const [customerSvgs, setCustomerSvgs] = useState<CustomerSvgs[]>([]);

  const findKeywordsInReview = (textBody: string, keywordsArray: string[]) => {
    const foundKeywords: string[] = [];
    keywordsArray.forEach((keyword) => {
      if (textBody.toLowerCase().includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });
    return foundKeywords;
  };

  function groupReviewsByCustomerEmail(
    reviews: CustomerReviewInfoFromSerializer[]
  ) {
    return reviews.reduce((acc: { [key: string]: any }, review) => {
      const { customer_email, rating, review_date, badges, id } = review;
      if (!acc[customer_email] && customer_email !== "") {
        acc[customer_email] = [];
      }
      if (customer_email !== "") {
        acc[customer_email].push({
          id,
          rating,
          review_date,
          badges,
        });
      }
      return acc;
    }, {});
  }

  function hasImprovementNoted(reviews: any) {
    if (reviews.length < 2) {
      // Not enough reviews to notice improvement
      return false;
    }

    // Sort reviews by review date to compare in chronological order
    const sortedReviews = reviews.sort(
      (a: any, b: any) =>
        new Date(a.review_date).getTime() - new Date(b.review_date).getTime()
    );

    // Check for improvement in ratings
    if (
      sortedReviews[sortedReviews.length - 1].rating >
      sortedReviews[sortedReviews.length - 2].rating
    ) {
      return true; // Improvement noted
    }

    return false; // No improvement
  }

  function hasRatingDropped(reviews: any) {
    if (reviews.length < 2) {
      // Not enough reviews to notice improvement
      return false;
    }

    // Sort reviews by review date to compare in chronological order
    const sortedReviews = reviews.sort(
      (a: any, b: any) =>
        new Date(a.review_date).getTime() - new Date(b.review_date).getTime()
    );

    // Check for drop in ratings
    if (
      sortedReviews[sortedReviews.length - 1].rating <
      sortedReviews[sortedReviews.length - 2].rating
    ) {
      return true; // No Improvement noted
    }

    return false; // Improvement Noted
  }

  function hasRatingTheSame(reviews: any) {
    if (reviews.length < 2) {
      // Not enough reviews to notice improvement
      return false;
    }

    // Sort reviews by review date to compare in chronological order
    const sortedReviews = reviews.sort(
      (a: any, b: any) =>
        new Date(a.review_date).getTime() - new Date(b.review_date).getTime()
    );

    // Check for drop in ratings
    if (
      sortedReviews[sortedReviews.length - 1].rating ==
      sortedReviews[sortedReviews.length - 2].rating
    ) {
      return true; // No Improvement noted
    }

    return false; // Improvement Noted
  }

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
        const customerJourniesAdjusted = groupReviewsByCustomerEmail(data);
        const userEmails = Object.keys(customerJourniesAdjusted);
        console.log(userEmails);
        const userSvgs = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-customer-svgs/`,
          {
            params: {
              emails: userEmails,
            },
          }
        );
        setCustomerSvgs(userSvgs.data);
        setCustomerJournies(customerJourniesAdjusted);
        const updatedReviews = data.map((review) => {
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
        setReviews(updatedReviews.reverse() as any);
        setRatingsToBadgesData(ratingToBadges(updatedReviews));
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(customerJournies).length > 0) {
      handleCustomerClick(Object.keys(customerJournies)[0]);
    }
  }, [customerJournies]);

  function ratingToBadges(reviews: any): Record<number, string[]> {
    return reviews.reduce(
      (acc: any, review: any) => {
        const { rating, badges } = review;
        if (!acc[rating]) {
          acc[rating] = [];
        }
        acc[rating] = acc[rating].concat(badges);
        return acc;
      },
      {} as Record<number, string[]>
    );
  }

  const avatarImage = (rating: number): string => {
    return `/Avatars/rating${rating}.png`;
  };

  const userImage = (customerEmail: string): string | null => {
    const customer = customerSvgs.find(
      (customer) => customer.email === customerEmail
    );
    return customer ? customer.avatar_svg : null; // Return the SVG or null if not found
  };

  const handleCustomerClick = (customer_email: string) => {
    setCustomerEmail(customer_email);
    setChartData(
      customerJournies[customer_email].sort(
        (
          a: CustomerReviewInfoFromSerializer,
          b: CustomerReviewInfoFromSerializer
        ) => a.id - b.id
      )
    );
  };

  const resizeSvg = (svgString: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = doc.documentElement;

    // Add viewBox if it doesn't exist
    if (!svgElement.getAttribute("viewBox")) {
      const width = svgElement.getAttribute("width") || "100";
      const height = svgElement.getAttribute("height") || "100";
      svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }

    // Remove width and height attributes to allow CSS sizing
    svgElement.removeAttribute("width");
    svgElement.removeAttribute("height");

    return new XMLSerializer().serializeToString(svgElement);
  };

  return (
    <div className="flex h-screen bg-white">
      {isLoading && (
        <div className="flex items-center justify-center w-full">
          <AestheticLoader />
        </div>
      )}
      {!isLoading && Object.keys(customerJournies).length === 0 && (
        <div className="flex items-center justify-center w-full">
          <p className="text-center">
            {
              "You can start viewing customer journeys once a signed up Talk. user leaves reviews for you! 🤗"
            }
          </p>
        </div>
      )}
      {Object.keys(customerJournies).length > 0 && (
        <>
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Customers</h2>
              <p className="text-gray-500 text-xs">
                Click on a customer to see their journey at your location(s).
              </p>
            </div>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              {Object.keys(customerJournies).map((customer_email, i) => (
                <div
                  key={customer_email}
                  className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCustomerClick(customer_email)}
                >
                  {userImage(customer_email) ? (
                    <div
                      className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100"
                      dangerouslySetInnerHTML={{
                        __html: resizeSvg(userImage(customer_email) || ""),
                      }}
                    />
                  ) : (
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          hasRatingDropped(customerJournies[customer_email])
                            ? avatarImage(3)
                            : avatarImage(5)
                        }
                      />
                      <AvatarFallback>
                        {customer_email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="ml-4">
                    <p className="font-semibold">{customer_email}</p>
                    {customerJournies[customer_email].length > 2 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              className={cn(
                                "bg-violet-500 text-white font-medium mt-2 ml-2"
                              )}
                            >
                              Loyal
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black border border-gray-200 shadow-md">
                            <p>
                              {`${customerEmail.split("@")[0]} is loyal to your business having visited more than 2 times. `}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {hasImprovementNoted(customerJournies[customer_email]) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              className={cn(
                                "bg-emerald-500 text-white font-medium mt-2 ml-2"
                              )}
                            >
                              Improvement Noticed
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black border border-gray-200 shadow-md">
                            <p>
                              {`${customerEmail.split("@")[0]} noticed an improvement from their last two visits. `}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {hasRatingDropped(customerJournies[customer_email]) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              className={cn(
                                "bg-red-600 text-white font-medium mt-2 ml-2"
                              )}
                            >
                              Rating Drop
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black border border-gray-200 shadow-md">
                            <p>
                              {`${customerEmail.split("@")[0]}'s rating dropped from their last two visits. `}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {hasRatingTheSame(customerJournies[customer_email]) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              className={cn(
                                "bg-yellow-600 text-white font-medium mt-2 ml-2"
                              )}
                            >
                              No Change
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black border border-gray-200 shadow-md">
                            <p>
                              {`${customerEmail.split("@")[0]}'s rating has stayed the same from their last two visits. `}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="flex-1 flex  justify-center">
            <div className="w-4/5 max-w-4xl">
              <CustomerJourneyChart
                chartData={chartData}
                chartTitle={`Customer: ${customerEmail.split("@")[0]}`}
                chartDescription={""}
                chartFact={""}
                chartFooter={`email: ${customerEmail}`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
