import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Place } from "../Types/types";
import { Separator } from "@/components/ui/separator";
import {
  CustomerReviewInfoFromSerializer,
  ChartReviewFormat,
  TopCustomer,
} from "../Types/types";
import { PiTranslate } from "react-icons/pi";
import { FaGoogle } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Star,
  MessageSquare,
  ChartSpline,
  Ban,
  Clock,
  Sigma,
  Eye,
  Tablet,
  Smartphone,
} from "lucide-react";
import { ScrollArea } from "./scroll-area";
import { Badge } from "./badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import JsxParser from "react-jsx-parser";
import Iframe from "react-iframe";
import axios from "axios";
import TableSkeletonLoader from "./Skeletons/TableSkeletonLoader";
import { AreaChartComponent } from "./AreaChartComponent";
import BadgeLoader from "./Skeletons/BadgeLoader";
import UpgradeButton from "./UpgradeButton";
import TopCustomersTable from "./TopCustomersTable";
import ShowWebsiteBadge from "./ShowWebsiteBadge";
import NumberTicker from "./number-ticker";

interface BadgeTexts {
  [recordNumber: string]: {
    [badge: string]: string;
  };
}

export default function SummaryTab({
  averageRating,
  totalReviews,
  searchQueryGpt,
  setSearchQueryGpt,
  handleSubmit,
  loading,
  returnedGraph,
  handlePreMadeQueryClick,
  preMadeQueries,
  BarChart,
  PieChart,
  LineChart,
  DoughnutChart,
  RadarChart,
  PolarAreaChart,
  BubbleChart,
  ScatterChart,
  toast,
}: any) {
  const [placesInfo, setPlacesInfo] = useState<Place[]>([]);
  const router = useRouter();
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [
    totalNumberOfFiveStarReviewsPostedToGoogle,
    setTotalNumberOfFiveStarReviewsPostedToGoogle,
  ] = useState(0);
  const [totalNumberOfFiveStarReviews, setTotalNumberOfFiveStarReviews] =
    useState(0);
  const [totalNegativeReviewsPrevented, setTotalNegativeReviewsPrevented] =
    useState(0);
  const [totalReviewsWithVero, setTotalReviewsWithVero] = useState(0);
  const [totalReviewsWithPersonalDevice, setTotalReviewsWithPersonalDevice] =
    useState(0);
  const [totalReviewsWithKiosk, setTotalReviewsWithKiosk] = useState(0);
  const [averageReviewTime, setAverageReviewTime] = useState(0);
  const [averageInStoreReviewTime, setAverageInStoreReviewTime] = useState(0);
  const [averagePersonalDeviceReviewTime, setAveragePersonalDeviceReviewTime] =
    useState(0);
  const [averageReviewRating, setAverageReviewRating] = useState(0);
  const [organizedBadges, setOrganizedBadges] = useState<
    Record<number, Record<string, number>>
  >({});
  const [chartData, setChartData] = useState<ChartReviewFormat[]>([]);
  const [isSocialMediaAccount, setIsSocialMediaAccount] = useState(false);
  const [badgeTexts, setBadgeTexts] = useState<BadgeTexts>({});
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [showWebsiteMessage, setShowWebsiteMessage] = useState(false);
  const [loadingBadges, setLoadingBadges] = useState<{
    [key: string]: boolean;
  }>({});

  const handleBadgeTranslationChange = (
    recordNumber: string,
    badge: string
  ) => {
    setLoadingBadges((prev) => ({
      ...prev,
      [`${recordNumber}-${badge}`]: true, // Unique key for each badge
    }));
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/translate-badge/`,
        {
          badge: badge,
        }
      )
      .then((response) => {
        const translatedBadge = response.data["content"];
        setBadgeTexts((prev) => ({
          ...prev,
          [recordNumber]: {
            ...prev[recordNumber],
            [badge]: translatedBadge,
          },
        }));
        setLoadingBadges((prev) => ({
          ...prev,
          [`${recordNumber}-${badge}`]: false,
        }));
        toast({
          title: "Success",
          description: "Badge translated.",
          duration: 1000,
        });
      })
      .catch((error) => {
        setLoadingBadges((prev) => ({
          ...prev,
          [`${recordNumber}-${badge}`]: false,
        }));
        toast({
          title: "Failed to generate",
          description: "Try again",
          duration: 1000,
        });
      });
  };

  const calculateAdditionalReviews = (
    currentRating: number,
    currentReviews: number,
    targetRating: number
  ): number | string => {
    if (targetRating <= currentRating) {
      return "Target rating must be higher than the current rating.";
    }

    // Total rating points for current reviews
    const totalCurrentPoints = currentRating * currentReviews;

    // Solve for the number of additional reviews needed
    const additionalReviews =
      (targetRating * currentReviews - totalCurrentPoints) / (5 - targetRating);

    // Check if the result is a valid number
    if (isNaN(additionalReviews) || additionalReviews < 0) {
      return "Invalid input values.";
    }

    // Round up to the next whole number
    return Math.ceil(additionalReviews);
  };

  const calculateAverageReviewRating = (
    data: CustomerReviewInfoFromSerializer[]
  ) => {
    if (data.length === 0) return 0; // Return 0 if there's no data

    const totalReviewRatings = data.reduce((total, review) => {
      return total + review.rating;
    }, 0);

    const averageReviewRating =
      Math.round((totalReviewRatings / data.length) * 10) / 10; // Calculate average
    setAverageReviewRating(averageReviewRating);
  };

  const calculateAverageReviewTime = (
    data: CustomerReviewInfoFromSerializer[]
  ) => {
    if (data.length === 0) return 0; // Return 0 if there's no data

    const totalReviewTime = data.reduce((total, review) => {
      return !review.posted_with_in_store_mode
        ? total + review.time_taken_to_write_review_in_seconds
        : total;
    }, 0);

    const averageReviewTime = Math.round(totalReviewTime / data.length); // Calculate average
    setAverageReviewTime(averageReviewTime);
  };

  const calculateAverageInStoreReviewTime = (
    data: CustomerReviewInfoFromSerializer[]
  ) => {
    // Filter reviews where instoremode is true
    const filteredReviews = data.filter(
      (review) => review.posted_with_in_store_mode
    );

    if (filteredReviews.length === 0) return 0; // Return 0 if there are no matching reviews

    const totalReviewTime = filteredReviews.reduce((total, review) => {
      return total + review.time_taken_to_write_review_in_seconds;
    }, 0);

    const averageInStoreReviewTime = Math.round(
      totalReviewTime / filteredReviews.length
    ); // Calculate average
    setAverageInStoreReviewTime(averageInStoreReviewTime);
  };

  const calculateAveragePersonalDeviceReviewTime = (
    data: CustomerReviewInfoFromSerializer[]
  ) => {
    // Filter reviews where instoremode is true
    const filteredReviews = data.filter(
      (review) => !review.posted_with_in_store_mode
    );

    if (filteredReviews.length === 0) return 0; // Return 0 if there are no matching reviews

    const totalReviewTime = filteredReviews.reduce((total, review) => {
      return total + review.time_taken_to_write_review_in_seconds;
    }, 0);

    const averagePersonalDeviceReviewTime = Math.round(
      totalReviewTime / filteredReviews.length
    ); // Calculate average
    setAveragePersonalDeviceReviewTime(averagePersonalDeviceReviewTime);
  };
  const organizeBadgesByRating = (data: CustomerReviewInfoFromSerializer[]) => {
    const organized: Record<number, Record<string, number>> = {};

    data.forEach((review) => {
      const rating = review.rating;
      const badges = JSON.parse(review.badges) as string[]; // Parse the badges from string to array

      if (!organized[rating]) {
        organized[rating] = {}; // Initialize the object if it doesn't exist
      }

      badges.forEach((badge) => {
        // Increment the badge count for this rating
        organized[rating][badge] = (organized[rating][badge] || 0) + 1;
      });
    });

    setOrganizedBadges(organized);
  };

  const convertReviewDataToChartForReviewsPerMonth = (
    reviews: CustomerReviewInfoFromSerializer[]
  ) => {
    return reviews.reduce(
      (acc, review) => {
        const month = review.review_date
          ? review.review_date.split(" ")[0]
          : ""; // Extract month
        const rating = review.rating;

        const existingMonth = acc.find((item) => item.month === month);

        if (existingMonth) {
          existingMonth.total += 1; // Add to total rating if month exists
        } else {
          acc.push({ month: month, total: 1 }); // Add new month if not exists
        }

        return acc;
      },
      [] as { month: string; total: number }[]
    );
  };

  function getTopCustomers(
    reviews: CustomerReviewInfoFromSerializer[]
  ): { email: string; count: number }[] {
    const emailCounts: Record<string, number> = {};

    // Count occurrences of each email
    reviews.forEach((review) => {
      const email = review.customer_email;
      if (email.length !== 0) {
        emailCounts[email] = (emailCounts[email] || 0) + 1;
      }
    });

    // Convert counts to an array and sort by count descending
    const sortedEmails = Object.entries(emailCounts)
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count);

    // Return top 5
    return sortedEmails.slice(0, 5);
  }

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

        const shouldTriggerWebistePrompt = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-website-message/`,
          {
            headers: {
              Authorization: `Bearer ${email}`,
            },
          }
        );

        console.log(shouldTriggerWebistePrompt);

        setShowWebsiteMessage(
          shouldTriggerWebistePrompt.data.data["internal_website"] === null &&
            shouldTriggerWebistePrompt.data.data["websites"].length === 1 &&
            shouldTriggerWebistePrompt.data.data["websites"][0] === ""
        );

        console.log(shouldTriggerWebistePrompt.data.data);

        const placeIdResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-place-id-by-email/`,
          {
            headers: {
              Authorization: `Bearer ${email}`,
            },
          }
        );
        setIsSocialMediaAccount(
          placeIdResponse.data.places[0].name ===
            placeIdResponse.data.places[0].place_id
        );
        setPlacesInfo(placeIdResponse.data.places);
        const placeIdsAsArray = placeIdResponse.data.places.map(
          (place: any) => place.place_id
        );
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-reviews-by-client-ids/`,
          {
            params: {
              clientIds: placeIdsAsArray,
            },
          }
        );
        const placeIdsQuery = placeIdsAsArray.join(",");
        const reviewSettingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-review-settings/${placeIdsQuery}/`
        );
        const data = response.data as CustomerReviewInfoFromSerializer[];
        const topCustomers = setTopCustomers(getTopCustomers(data));
        const chartDataToStore =
          convertReviewDataToChartForReviewsPerMonth(data);
        setChartData(chartDataToStore);
        organizeBadgesByRating(data);
        calculateAverageReviewTime(data);
        calculateAverageReviewRating(data);
        calculateAverageInStoreReviewTime(data);
        calculateAveragePersonalDeviceReviewTime(data);
        setTotalReviewsWithVero(data.length);
        setTotalReviewsWithKiosk(
          data.filter((review) => review.posted_with_in_store_mode).length
        );
        setTotalReviewsWithPersonalDevice(
          data.filter((review) => !review.posted_with_in_store_mode).length
        );
        setTotalNegativeReviewsPrevented(
          data.filter(
            (item) => item.rating <= reviewSettingsResponse.data.worryRating
          ).length
        );
        setTotalNumberOfFiveStarReviewsPostedToGoogle(
          data.filter(
            (item) =>
              item.rating === 5 &&
              (item.posted_to_google_review ||
                item.posted_to_google_after_email_sent)
          ).length
        );
        setTotalNumberOfFiveStarReviews(
          data.filter((item) => item.rating === 5).length
        );
        setIsTableLoading(false);
      } catch (err) {
        console.error(err);
        setIsTableLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {isSocialMediaAccount ? "All Engagement" : "All Locations"}
          </CardTitle>
          <div className="flex justify-between">
            <CardDescription>Overview</CardDescription>
            {showWebsiteMessage && <ShowWebsiteBadge />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Average Review Rating"
              value={averageReviewRating}
              icon={<Star className="h-4 w-4 text-muted-foreground" />}
              decimalPlaces={1}
            />
            <StatCard
              title="Total Reviews with Talk."
              value={totalReviewsWithVero}
              icon={<Sigma className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Kiosk Reviews"
              value={totalReviewsWithKiosk}
              icon={<Tablet className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Personal Device Reviews"
              value={totalReviewsWithPersonalDevice}
              icon={<Smartphone className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Negative Reviews Prevented"
              value={totalNegativeReviewsPrevented}
              icon={<Ban className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="5 Star Reviews"
              value={totalNumberOfFiveStarReviews}
              icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="5 Star Reviews Routed to Google"
              value={totalNumberOfFiveStarReviewsPostedToGoogle}
              icon={<FaGoogle className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Badge Distribution by Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {Object.entries(organizedBadges)
                .reverse()
                .map(([recordNumber, badgeCounts]) => (
                  <div
                    key={recordNumber}
                    className="border rounded-lg p-4 mb-4"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {recordNumber}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(badgeCounts).map(([badge, count]) => (
                        <Badge key={badge} variant="outline">
                          {!loadingBadges[`${recordNumber}-${badge}`] ? (
                            <>
                              {badgeTexts[recordNumber]?.[badge] || badge}:{" "}
                              {count}
                            </>
                          ) : (
                            <BadgeLoader />
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-transparent"
                                  onClick={() =>
                                    handleBadgeTranslationChange(
                                      recordNumber,
                                      badge
                                    )
                                  }
                                >
                                  <PiTranslate />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-black border border-gray-200 shadow-md">
                                <p>Translate to English</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isSocialMediaAccount
                ? "Engagements per month"
                : "Reviews per month"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChartComponent
              chartData={chartData}
              chartTitle=""
              chartDescription=""
              chartFact=""
              chartFooter=""
            />
          </CardContent>
        </Card>
      </div>

      {topCustomers.length != 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Talk. Customers</CardTitle>
            <CardDescription>
              Based on the number of times visited
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isTableLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                Loading...
              </div>
            ) : (
              <TopCustomersTable customers={topCustomers} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, decimalPlaces = 0 }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <NumberTicker
          className="text-2xl font-bold"
          value={value}
          decimalPlaces={decimalPlaces}
        />
      </CardContent>
    </Card>
  );
}
