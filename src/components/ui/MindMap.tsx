import React from "react";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import { Badge } from "./badge";
import Logo from "./Logo";

export default function MindMap() {
  const tags = [
    "Quality",
    "Rating",
    "Recency",
    "Quantity",
    "Engagement",
    "Frequency",
    "Distribution",
    "Shielding",
    "Response Time",
  ];
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white text-black">
      <div className="flex flex-col items-center space-y-8">
        {/* Traditional Process */}
        <div className="flex items-center space-x-4">
          <div className="font-semibold">Customer</div>
          <ArrowRight className="w-6 h-6" />
          <div className="font-semibold">Google Review</div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-300 my-4"></div>

        {/* Talk. Process */}
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="font-semibold">Customer</div>
            <ArrowRight className="w-6 h-6" />
            <div className="font-semibold">
              <Logo size={50} />
            </div>
            <ArrowRight className="w-6 h-6" />
            <div className=" p-2 text-sm whitespace-nowrap">
              <ScrollArea className="h-72 w-48 rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Increase Review:
                  </h4>
                  {tags.map((tag) => (
                    <>
                      <Badge>{tag}</Badge>
                      <Separator className="my-2" />
                    </>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <ArrowRight className="w-6 h-6" />
            <div className="font-semibold">Google Review</div>
          </div>
        </div>
      </div>
    </div>
  );
}
