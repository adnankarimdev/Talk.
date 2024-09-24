import { useEffect, useState } from "react";
import { Place } from "../Types/types";
import { Separator } from "@/components/ui/separator";
import { CustomerReviewInfoFromSerializer } from "../Types/types";
import { FaGoogle } from "react-icons/fa";
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
  const [averageReviewTime, setAverageReviewTime] = useState(0);
  const [averageReviewRating, setAverageReviewRating] = useState(0);
  const [organizedBadges, setOrganizedBadges] = useState<
    Record<number, Record<string, number>>
  >({});

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
      return total + review.time_taken_to_write_review_in_seconds;
    }, 0);

    const averageReviewTime = Math.round(totalReviewTime / data.length); // Calculate average
    setAverageReviewTime(averageReviewTime);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          console.error("Email not found in localStorage");
          return;
        }

        const placeIdResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-place-id-by-email/${email}/`
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
        organizeBadgesByRating(data);
        calculateAverageReviewTime(data);
        calculateAverageReviewRating(data);
        setTotalReviewsWithVero(data.length);
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
    <Card>
      <CardHeader>
        <CardTitle>All Locations</CardTitle>
        <CardDescription>Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-1 mb-10 place-items-center">
          <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {"Badge Distrubtion by Rating"}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {Object.entries(organizedBadges).map(
                    ([recordNumber, badgeCounts]) => (
                      <div key={recordNumber} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {recordNumber}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(badgeCounts).map(([badge, count]) => (
                            <Badge key={badge} variant="outline">
                              {badge}: {count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {"Average Review Rating with Customers using Vero"}
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageReviewRating}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {"Total Reviews with Vero"}
              </CardTitle>
              <Sigma className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReviewsWithVero}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {"Negative Reviews Prevented with Vero"}
              </CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalNegativeReviewsPrevented}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {"5 Star Reviews with Vero"}
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalNumberOfFiveStarReviews}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {"5 Star Reviews Posted to Google"}
              </CardTitle>
              <FaGoogle className="h-4 w-4 text-muted-foreground" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalNumberOfFiveStarReviewsPostedToGoogle}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {"Average Review Time with Vero"}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageReviewTime} {"s"}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Table will be here eventually. should probs create own component.*/}
        {/* <Separator className="my-4" /> */}
        {/* <CardHeader>
          <CardTitle>Per Location</CardTitle>
          <CardDescription>Overview</CardDescription>
        </CardHeader>

        {isTableLoading && <TableSkeletonLoader />}
        {!isTableLoading && (
          <Table className="w-full mt-2">
            <TableCaption>An overview of all your locations</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Current Rating</TableHead>
                <TableHead>Total Google Reviews</TableHead>
                <TableHead>5-Star Reviews Needed (+0.1)</TableHead>
                <TableHead>5-Star Reviews with Vero</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placesInfo.map((place) => (
                <TableRow key={place.place_id} className="text-center">
                  <TableCell className="font-medium text-left">
                    {place.name}
                  </TableCell>
                  <TableCell>{place.currentRating}</TableCell>
                  <TableCell>{place.currentTotalReviews}</TableCell>
                  <TableCell>
                    {calculateAdditionalReviews(
                      Number(place.currentRating!),
                      Number(place.currentTotalReviews),
                      Number(place.currentRating! + 0.1)
                    )}
                  </TableCell>
                  <TableCell>{0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )} */}
      </CardContent>
    </Card>
  );
}
