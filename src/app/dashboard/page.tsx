"use client";

import { useState } from "react";
import axios from "axios";
import AnimatedLayout from "@/animations/AnimatedLayout";
import { useToast } from "@/components/ui/use-toast";
import {
  Bar,
  Pie,
  Line,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
  Scatter,
} from "react-chartjs-2";
import {
  reviewsDataSimmons,
  reviewsDataBridgeland,
  reviewsDataCalgaryPlace,
  reviewsDataChinook,
  reviewsDataFarmers,
  reviewsDataHudsons,
  reviewsDataMarda,
  reviewsDataMissions,
  reviewsDataStephenAve,
} from "../constants/constants";
import Summary from "@/components/ui/Summary";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadarController,
  RadialLinearScale,
} from "chart.js";
import SparklesText from "@/components/ui/sparkles-text";
import GradualSpacing from "@/components/ui/gradual-spacing";
// import SmartReviewBuilderNew from "@/components/ui/SmartReviewBuilderNew";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadarController,
  RadialLinearScale
);

export default function Dashboard() {
  const preMadeQueries = [
    "Are there any noticeable trends in review ratings over time?",
    "What are the top issues customers mention in their reviews?",
    "What factors seem to contribute most to 5 star reviews?",
    "What factors are most likely to influence a customer to leave a positive or negative review?",
  ];

  const [searchQueryGpt, setSearchQueryGpt] = useState<string>("");
  const [returnedGraph, setReturnedGraph] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handlePreMadeQueryClick = (query: string) => {
    setSearchQueryGpt(query);
  };

  const { toast } = useToast();

  const reviewsData = [
    ...reviewsDataSimmons,
    ...reviewsDataBridgeland,
    ...reviewsDataCalgaryPlace,
    ...reviewsDataChinook,
    ...reviewsDataFarmers,
    ...reviewsDataHudsons,
    ...reviewsDataMarda,
    ...reviewsDataMissions,
    ...reviewsDataStephenAve,
  ];

  const handleSubmit = () => {
    setLoading(true);
    setReturnedGraph("");
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/create-charts/`, {
        query: searchQueryGpt,
      })
      .then((response) => {
        const codeString = response.data["content"]
          .replace(/```jsx/g, "")
          .replace(/```/g, "");
        // toast({
        //   title: "Graph Generated",
        // });
        setReturnedGraph(codeString);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const ratings = reviewsData.map((review) => parseInt(review.rating));
  const totalReviews = ratings.length;
  const averageRating = (
    ratings.reduce((sum, rating) => sum + rating, 0) / totalReviews
  ).toFixed(1);

  return (
    <AnimatedLayout>
      <div className="container mx-auto p-4">
        <GradualSpacing
          className="text-2xl font-bold mb-4 text-center"
          text="Talk. Dashboard"
        />
        <Summary
          averageRating={averageRating}
          totalReviews={totalReviews}
          searchQueryGpt={searchQueryGpt}
          setSearchQueryGpt={setSearchQueryGpt}
          handleSubmit={handleSubmit}
          loading={loading}
          returnedGraph={returnedGraph}
          handlePreMadeQueryClick={handlePreMadeQueryClick}
          preMadeQueries={preMadeQueries}
          BarChart={Bar}
          PieChart={Pie}
          LineChart={Line}
          DoughnutChart={Doughnut}
          RadarChart={Radar}
          PolarAreaChart={PolarArea}
          BubbleChart={Bubble}
          ScatterChart={Scatter}
          toast={toast}
        />
      </div>
    </AnimatedLayout>
  );
}
