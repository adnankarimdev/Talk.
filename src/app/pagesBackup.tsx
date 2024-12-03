// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/components/ui/use-toast";
// import {
//   Bar,
//   Pie,
//   Line,
//   Doughnut,
//   Radar,
//   PolarArea,
//   Bubble,
//   Scatter,
// } from "react-chartjs-2";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   reviewsDataSimmons,
//   reviewsDataBridgeland,
//   reviewsDataCalgaryPlace,
//   reviewsDataChinook,
//   reviewsDataFarmers,
//   reviewsDataHudsons,
//   reviewsDataMarda,
//   reviewsDataMissions,
//   reviewsDataStephenAve,
//   stopWordsArray,
// } from "../constants/constants";
// import SmartReviewBuilder from "@/components/ui/SmartReviewBuilder";
// import Summary from "@/components/ui/Summary";
// import Reviews from "@/components/ui/Reviews";
// import Keywords from "@/components/ui/Keywords";
// import AutoRespond from "@/components/ui/AutoRespond";
// import { KeywordCounts } from "@/components/Types/types";
// import { useRouter } from "next/navigation";

// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   PointElement,
//   LineElement,
//   RadarController,
//   RadialLinearScale,
// } from "chart.js";
// import Personas from "@/components/ui/Personas";
// import TutorialSteps from "@/components/ui/TutorialSteps";
// import ChatInterface from "@/components/ui/ChatInterface";
// import NotionInterface from "@/components/ui/NotionInterface";
// import SmartReviewBuilderNew from "@/components/ui/SmartReviewBuilderNew";
// import AuthPage from "@/components/ui/AuthPage";
// import ClientSettings from "@/components/ui/ClientSettings";
// import Sidebar from "@/components/Sidebar";
// // import SmartReviewBuilderNew from "@/components/ui/SmartReviewBuilderNew";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   PointElement,
//   LineElement,
//   RadarController,
//   RadialLinearScale
// );

// export default function Dashboard() {
//   const router = useRouter();
//   const [showReviewPlatform, setShowReviewPlatform] = useState(false);

//   const preMadeQueries = [
//     "Are there any noticeable trends in review ratings over time?",
//     "What are the top issues customers mention in their reviews?",
//     "What factors seem to contribute most to 5 star reviews?",
//     "What factors are most likely to influence a customer to leave a positive or negative review?",
//   ];

//   const positiveKeywords = [
//     "Best Coffee",
//     "Specialty Coffee",
//     "Artisan Coffee",
//     "Gourmet Coffee",
//     "Freshly Brewed Coffee",
//     "Cozy Cafe",
//     "Best Coffee Experience",
//     "Quiet Coffee Shop",
//     "Study Cafe",
//     "Coffee Date Spot",
//     "Pet-Friendly Cafe",
//     "Community Coffee Shop",
//     "Coffee Tasting",
//     "Barista Crafted Coffee",
//     "Signature Coffee Drinks",
//     "Custom Blends",
//     "Gourmet Pastries",
//     "Artisan Teas",
//     "Local Bakery Goods",
//     "Healthy Snacks",
//     "Handmade Desserts",
//     "Breakfast Cafe",
//     "Brunch Spot",
//   ];

//   const steps = [
//     {
//       title: "Step 1: Share Your Thoughts",
//       description:
//         "Quickly jot down your answers to questions by Phil & Sebastian, using your own unique style.",
//       emoji: "✏️",
//     },
//     {
//       title: "Step 2: See the Magic",
//       description:
//         "If you want, Talk. will enhance your response, making sure it's the best it can be based on what you wrote!",
//       emoji: "✨",
//     },
//     {
//       title: "Step 3: Submit Your Review",
//       description:
//         "Once you're happy with it, send off your polished Google review!",
//       emoji: "🚀",
//     },
//   ];

//   const negativeKeywords = [
//     "Bad Service",
//     "Rude Staff",
//     "Cold Coffee",
//     "Overpriced",
//     "Stale Pastries",
//     "Noisy Environment",
//     "Long Wait Times",
//     "Uncomfortable Seating",
//     "Dirty Tables",
//     "Poor Quality",
//     "Slow Service",
//     "Burnt Coffee",
//     "Limited Menu",
//     "Crowded",
//     "Unfriendly Staff",
//     "Weak Coffee",
//     "Disappointing Experience",
//     "Unhygienic",
//     "Underwhelming",
//     "Poor WiFi",
//   ];

//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [searchQueryGpt, setSearchQueryGpt] = useState<string>("");
//   const [selectedLocation, setSelectedLocation] = useState<string>("");
//   const [returnedGraph, setReturnedGraph] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   const handlePreMadeQueryClick = (query: string) => {
//     setSearchQueryGpt(query);
//   };

//   const handleGoToGoogleReview = () => {
//     window.open(
//       "https://search.google.com/local/writereview?placeid=ChIJzd0u2lRlcVMRoSTjaEEDL_E",
//       "_blank",
//       "noopener,noreferrer"
//     );
//   };

//   const goToVero = () => {
//     setShowReviewPlatform(true);
//   };

//   const { toast } = useToast();
//   const threshold = 100;

//   const reviewsData = [
//     ...reviewsDataSimmons,
//     ...reviewsDataBridgeland,
//     ...reviewsDataCalgaryPlace,
//     ...reviewsDataChinook,
//     ...reviewsDataFarmers,
//     ...reviewsDataHudsons,
//     ...reviewsDataMarda,
//     ...reviewsDataMissions,
//     ...reviewsDataStephenAve,
//   ];

//   const uniqueLocations = Array.from(
//     new Set(reviewsData.map((review) => review.location))
//   );

//   const filteredReviews =
//     selectedLocation && selectedLocation !== "All"
//       ? reviewsData.filter((review) => review.location === selectedLocation)
//       : reviewsData;

//   const finalFilteredReviews = filteredReviews.filter((review) =>
//     searchQuery
//       ? review.body.toLowerCase().includes(searchQuery.toLowerCase())
//       : true
//   );

//   const positiveKeywordCounts: { [key: string]: number } =
//     positiveKeywords.reduce((acc: KeywordCounts, keyword) => {
//       acc[keyword] = 0;
//       return acc;
//     }, {});

//   const handleSubmit = () => {
//     setLoading(true);
//     setReturnedGraph("");
//     axios
//       .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/create-charts/`, {
//         query: searchQueryGpt,
//       })
//       .then((response) => {
//         const codeString = response.data["content"]
//           .replace(/```jsx/g, "")
//           .replace(/```/g, "");
//         // toast({
//         //   title: "Graph Generated",
//         // });
//         setReturnedGraph(codeString);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error(error);
//         setLoading(false);
//       });
//   };

//   const commonWords = getCommonWordsInFiveStarReviews(reviewsData);

//   function getCommonWordsInFiveStarReviews(
//     reviews: { rating: string; body: string }[]
//   ): [string, number][] {
//     const stopWords = new Set(stopWordsArray);
//     const fiveStarReviews = reviews.filter(
//       (review) => parseInt(review.rating) === 5
//     );
//     const wordFrequency: { [key: string]: number } = {};

//     fiveStarReviews.forEach((review) => {
//       const words = review.body
//         .toLowerCase()
//         .replace(/[^\w\s]/g, "")
//         .split(/\s+/);

//       words.forEach((word) => {
//         if (word.length > 2 && !stopWords.has(word)) {
//           wordFrequency[word] = (wordFrequency[word] || 0) + 1;
//         }
//       });
//     });

//     return Object.entries(wordFrequency)
//       .filter(([_, frequency]) => frequency > threshold)
//       .sort(([, a], [, b]) => b - a);
//   }

//   const keywordCountsNegative: KeywordCounts = negativeKeywords.reduce(
//     (acc: KeywordCounts, keyword) => {
//       acc[keyword] = 0;
//       return acc;
//     },
//     {} as KeywordCounts
//   );

//   reviewsData.forEach((review) => {
//     positiveKeywords.forEach((keyword) => {
//       const regex = new RegExp(keyword, "gi");
//       const matches = review.body.match(regex);
//       if (matches) {
//         positiveKeywordCounts[keyword] += matches.length;
//       }
//     });
//   });

//   reviewsData.forEach((review) => {
//     negativeKeywords.forEach((keyword) => {
//       const regex = new RegExp(keyword, "gi");
//       const matches = review.body.match(regex);
//       if (matches) {
//         keywordCountsNegative[keyword] += matches.length;
//       }
//     });
//   });

//   const nextpage = () => {
//     router.push("/dashboard");
//   };
//   const ratings = reviewsData.map((review) => parseInt(review.rating));
//   const totalReviews = ratings.length;
//   const averageRating = (
//     ratings.reduce((sum, rating) => sum + rating, 0) / totalReviews
//   ).toFixed(1);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Talk. Dashboard</h1>
//       <Tabs defaultValue="summary">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="signup">Sign Up </TabsTrigger>
//           <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//           <TabsTrigger value="summary">Summary</TabsTrigger>
//           <TabsTrigger value="reviews">Reviews</TabsTrigger>
//           {/* <TabsTrigger value="keywords">Top Keywords</TabsTrigger> */}
//           <TabsTrigger value="Auto Respond to Reviews">
//             Auto Respond to Reviews
//           </TabsTrigger>

//           {/* <TabsTrigger value="personas">Customer Personas</TabsTrigger> */}
//         </TabsList>

//         <TabsContent value="signup">
//           <div className="flex items-center justify-center min-h-screen">
//             <AuthPage />
//           </div>
//         </TabsContent>

//         <TabsContent value="summary">
//           <Summary
//             averageRating={averageRating}
//             totalReviews={totalReviews}
//             searchQueryGpt={searchQueryGpt}
//             setSearchQueryGpt={setSearchQueryGpt}
//             handleSubmit={handleSubmit}
//             loading={loading}
//             returnedGraph={returnedGraph}
//             handlePreMadeQueryClick={handlePreMadeQueryClick}
//             preMadeQueries={preMadeQueries}
//             BarChart={Bar}
//             PieChart={Pie}
//             LineChart={Line}
//             DoughnutChart={Doughnut}
//             RadarChart={Radar}
//             PolarAreaChart={PolarArea}
//             BubbleChart={Bubble}
//             ScatterChart={Scatter}
//             toast={toast}
//           />

//           <Button onClick={nextpage}>Redirect</Button>
//         </TabsContent>

//         <TabsContent value="reviews">
//           <Sidebar></Sidebar>
//           <Reviews
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             uniqueLocations={uniqueLocations}
//             setSelectedLocation={setSelectedLocation}
//             finalFilteredReviews={finalFilteredReviews}
//           />
//         </TabsContent>

//         <TabsContent value="keywords">
//           <Keywords
//             keywordCounts={positiveKeywordCounts}
//             keywordCountsNegative={keywordCountsNegative}
//             commonWords={commonWords}
//           />
//         </TabsContent>

//         <TabsContent value="Auto Respond to Reviews">
//           <AutoRespond />
//         </TabsContent>

//         <TabsContent value="dashboard">
//           <ClientSettings />
//         </TabsContent>

//         <TabsContent value="personas">
//           <Personas />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
