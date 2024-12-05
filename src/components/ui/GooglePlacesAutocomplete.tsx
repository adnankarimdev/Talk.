"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "./button";
import axios from "axios";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import { Place } from "../Types/types";

const GOOGLE_MAPS_API_KEY = "AIzaSyDEJBvbJXfBOqam_dohKIp-9OT6ZBYB2rY";
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;

const GOOGLE_RECENT_REVIEWS_CALL =
  "https://maps.googleapis.com/maps/api/place/details/json?place_id=YOUR_PLACE_ID&key=YOUR_API_KEY";

declare global {
  interface Window {
    google: any;
  }
}

export default function GooglePlacesAutocomplete(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && inputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: ["name", "formatted_address", "place_id"],
          }
        );
        autocomplete.addListener("place_changed", async () => {
          // For now, we'll save the number of locations as 1.
          // Eventually, we'll need to set up the backend to select the number of locations based on pricing.
          if (
            places.length >
            Number(process.env.NEXT_PUBLIC_NUMBER_OF_LOCATIONS_ALLOWED)
          ) {
            toast({
              title: "Failed",
              description: "Can only add one location on free trial.",
              duration: 3000,
              variant: "destructive",
            });

            return;
          }

          const selectedPlace = autocomplete.getPlace();

          const newPlace: Place = {
            name: selectedPlace.name,
            formatted_address: selectedPlace.formatted_address,
            place_id: selectedPlace.place_id,
          };

          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-place-details/${selectedPlace.place_id}/`
            );
            const data = response.data;
            const website = data.result["website"] || "";
            const types = data.result["types"];
            const typesToRemove = new Set([
              "store",
              "point_of_interest",
              "establishment",
            ]);
            const finalTypes = types.filter(
              (type: any) => !typesToRemove.has(type)
            );
            newPlace.currentRating = data.result["rating"];
            newPlace.currentTotalReviews = data.result["user_ratings_total"];
            newPlace.websiteUrl = website;
            newPlace.googleTypes = finalTypes;
            setPlaces((prevPlaces) => {
              if (!prevPlaces.includes(newPlace)) {
                return [...prevPlaces, newPlace];
              }
              return prevPlaces;
            });
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          } catch (error: any) {
            // Handle and throw the error explicitly
            console.log(error.response.data.error);
            toast({
              title: error.response.data.error,
              duration: 3000,
              variant: "destructive",
            });
            return;
          }
        });
      }
    };

    if (window.google) {
      initAutocomplete();
    } else {
      const script = document.createElement("script");
      script.src = GOOGLE_MAPS_API_URL;
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    }
  }, [places]);

  const removePlace = (placeId: string) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.place_id !== placeId)
    );
  };

  const handleLocationsSubmit = () => {
    if (
      places.length >
      Number(process.env.NEXT_PUBLIC_NUMBER_OF_LOCATIONS_ALLOWED)
    ) {
      toast({
        title: "Failed",
        description: "Can only add one location on free trial.",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/set-place-ids/`, {
        places: places,
        userEmail: localStorage.getItem("userEmail"),
      })
      .then((response) => {
        toast({
          title: "Success",
          description: "Places stored.",
          duration: 1000,
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: "Failed to update",
          description: error.response.data.error,
          duration: 1000,
        });
      });
  };
  return (
    <div className="w-full max-w-md space-y-4">
      <Script src={GOOGLE_MAPS_API_URL} />
      <style jsx global>{`
        .pac-container {
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          z-index: 1100;
        }
        .pac-item {
          padding: 0.5rem 0.75rem;
          color: hsl(var(--foreground));
        }
        .pac-item:hover {
          background-color: hsl(var(--accent));
        }
        .pac-item-selected {
          background-color: hsl(var(--accent));
        }
        .pac-matched {
          font-weight: 600;
        }
      `}</style>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="relative">
          <Input
            ref={inputRef}
            id="location"
            type="text"
            placeholder="Enter a location"
            className="w-full"
          />
        </div>
      </div>
      {places.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Places</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {places.map((place) => (
                <Badge
                  key={place.place_id}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center space-x-1"
                >
                  <span>{place.name}</span>
                  <button
                    onClick={() => removePlace(place.place_id)}
                    className="ml-1 rounded-full p-1 hover:bg-secondary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-4">
            <Button
              onClick={handleLocationsSubmit}
              variant="outline"
              disabled={isLoading}
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
