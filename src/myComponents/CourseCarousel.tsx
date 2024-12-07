import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

export default function CourseCarousel() {
  const items = [
    {
      title: "The Alchemist",
      image: "/placeholder.svg?height=200&width=300",
      description: "A magical story about following your dreams.",
      author: "Paulo Coelho",
      review: 4.5,
    },
    {
      title: "To Kill a Mockingbird",
      image: "/placeholder.svg?height=200&width=300",
      description:
        "A classic tale of justice and racism in the American South.",
      author: "Harper Lee",
      review: 4.8,
    },
    {
      title: "1984",
      image: "/placeholder.svg?height=200&width=300",
      description: "A dystopian novel about totalitarian control.",
      author: "George Orwell",
      review: 4.7,
    },
    {
      title: "Pride and Prejudice",
      image: "/placeholder.svg?height=200&width=300",
      description: "A romantic novel set in 19th century England.",
      author: "Jane Austen",
      review: 4.6,
    },
    {
      title: "The Great Gatsby",
      image: "/placeholder.svg?height=200&width=300",
      description:
        "A tale of wealth, love, and the American Dream in the Roaring Twenties.",
      author: "F. Scott Fitzgerald",
      review: 4.4,
    },
  ];

  return (
    <Carousel className="w-full max-w-5xl">
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.map((item, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3">
            <Card className="overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">By {item.author}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm">{item.review}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
