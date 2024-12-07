import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import youtubeThumbnail from "../assets/Untitled 3.png";

export default function ThreeDCard({
  title,
  channelTitle,
}: {
  title: string;
  channelTitle: string;
}) {
  return (
    <div className="perspective-1000 w-[250px] ">
      <Card className="w-full overflow-hidden transition-all duration-500 ease-out transform hover:rotate-y- hover:rotate-x-5 hover:scale-103 hover:shadow-xl">
        <div className="aspect-video relative">
          <img
            src={youtubeThumbnail}
            alt="Card image"
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{channelTitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400"></p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Learn More</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
