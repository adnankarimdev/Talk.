"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";
import SparklesText from "@/components/ui/sparkles-text";
import LetterPullup from "@/components/ui/letter-pullup";
import BoxReveal from "@/components/ui/box-reveal";
import RetroGrid from "@/components/ui/retro-grid";

export default function BusinessTemplate() {
  const { slug } = useParams();
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [websiteDetails, setWebsiteDetails] = useState<any>({});
  const [noWebsite, setNoWebsite] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-website-details/${slug}/`
        );
        console.log(JSON.parse(response.data.data["website_details"]));
        setWebsiteDetails(JSON.parse(response.data.data["website_details"]));
        setIsLoading(false);
      } catch (err) {
        setNoWebsite(true);
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading && <RecordingLoader />}
      {noWebsite && <p>This page does not exist.</p>}
      {!isLoading && !noWebsite && (
        <div className="min-h-screen flex flex-col items-center">
          {/* Hero Section */}
          <RetroGrid />
          <section className="relative h-[70vh] flex items-center justify-center w-full overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0" />
            </div>
            <div className="relative z-10 text-center">
              {/* <h1 className="text-5xl font-bold mb-4">
                {websiteDetails.businessName}
              </h1> */}
              <SparklesText
                className="text-5xl"
                text={websiteDetails.businessName}
                sparklesCount={5}
              />
              {/* <p className="text-xl mb-8 mt-10">{websiteDetails.tagline}</p> */}
              <LetterPullup
                className="text-xl mb-8 mt-10"
                words={websiteDetails.tagline}
                delay={0.05}
              />
            </div>
          </section>

          {/* About Section */}
          <section className="py-16 px-4 md:px-0 w-full flex justify-center">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-8">About Us</h2>
              <div className="gap-8 items-center">
                <div>
                  <p className="text-lg leading-relaxed">
                    {websiteDetails.aboutUs}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          {websiteDetails.services.length > 0 && (
            <section className="py-16 bg-white dark:bg-gray-800 w-full flex justify-center">
              <div className="container mx-auto max-w-6xl text-center">
                <h2 className="text-3xl font-bold mb-12">Our Services</h2>
                <div className="grid gap-8 md:grid-cols-3">
                  {websiteDetails.services.map((service: any, index: any) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-semibold mb-4">
                          {service.title}
                        </h3>
                        <p className="text-lg leading-relaxed mb-4">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section className="py-16 bg-white dark:bg-gray-800 w-full flex justify-center">
            <div className="container mx-auto max-w-6xl text-center">
              {" "}
              {/* Centered text in this div */}
              <h2 className="text-3xl font-bold mb-12">Contact Us</h2>
              <div className="">
                <div className="flex flex-col items-center">
                  <div className="space-y-10 flex flex-col justify-center">
                    {websiteDetails.contactInfo.address && (
                      <div className="flex items-center">
                        <MapPin className="w-6 h-6 mr-4 text-primary" />
                        <BoxReveal boxColor={"#fff7ed"} duration={0.5}>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${
                              encodeURIComponent(websiteDetails.businessName) +
                              encodeURIComponent(
                                websiteDetails.contactInfo.address
                              )
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {websiteDetails.contactInfo.address}
                          </a>
                        </BoxReveal>
                      </div>
                    )}

                    {websiteDetails.contactInfo.phoneNumber && (
                      <div className="flex items-center">
                        <Phone className="w-6 h-6 mr-4 text-primary" />
                        <BoxReveal boxColor={"#fff7ed"} duration={0.5}>
                          <p>{websiteDetails.contactInfo.phoneNumber}</p>
                        </BoxReveal>
                      </div>
                    )}

                    {websiteDetails.contactInfo.email && (
                      <div className="flex items-center">
                        <Mail className="w-6 h-6 mr-4 text-primary" />
                        <BoxReveal boxColor={"#fff7ed"} duration={0.5}>
                          <p>{websiteDetails.contactInfo.email}</p>
                        </BoxReveal>
                      </div>
                    )}
                    <Card className="w-full max-w-md">
                      {" "}
                      {/* Centered card */}
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl font-semibold">
                          <Clock className="w-5 h-5 mr-2 text-primary" />
                          Business Hours
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {daysOrder.map((day) => (
                            <li
                              key={day}
                              className="flex justify-between items-center py-2 border-b last:border-b-0"
                            >
                              <span className="font-medium">{day}</span>
                              <span>
                                {websiteDetails.contactInfo.openingHours[day]
                                  .open === "Closed" ? (
                                  <span className="text-muted-foreground">
                                    Closed
                                  </span>
                                ) : (
                                  `${websiteDetails.contactInfo.openingHours[day].open} - ${websiteDetails.contactInfo.openingHours[day].close}`
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 w-full flex justify-center">
            <div className="container mx-auto max-w-6xl text-center">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    {websiteDetails.businessName}
                  </h3>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="hover:text-primary">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary">
                        Services
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-primary">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="hover:text-primary">
                      Facebook
                    </a>
                    <a href="#" className="hover:text-primary">
                      Twitter
                    </a>
                    <a href="#" className="hover:text-primary">
                      Instagram
                    </a>
                    <a href="#" className="hover:text-primary">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p>Powered by Talk.</p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
