import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseconsant";
import { CourseWithFirstVideo, courseDifficultyMap } from "../types/CourseType";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  Grid2X2,
  Monitor,
  Search,
  Filter,
  Clock,
  Star,
  TrendingUp,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Arrow } from "@radix-ui/react-hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FilterOptions } from "@/myComponents/FilterOptions";
import { parseYouTubeDuration } from "@/helperFunctions/youtubeVideo";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function getShorthandTime(timeString: string) {
  // Split the input string into hours, minutes, and seconds
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Determine shorthand based on the input values
  if (hours > 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute" : `${minutes} minutes`;
  } else {
    return "less than a minute";
  }
}

function dateToMonthYear(dateS: string): string {
  const newDate = new Date(dateS);
  const currentMonth = newDate.getMonth();
  const year = newDate.getFullYear();
  return `${months[currentMonth]} ${year}`;
}

// Course Carousel Component
export const CustomCarousel: React.FC<{
  videos: CourseWithFirstVideo[];
  title: string;
  icon: React.ReactNode;
}> = ({ videos, title, icon }) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -carouselRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: carouselRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {icon}
            {title}
          </h3>
        </div>
        <div className="flex gap-2">
          {showLeftArrow && (
            <Button
              onClick={scrollLeft}
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {showRightArrow && (
            <Button
              onClick={scrollRight}
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-5 py-2"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {videos.map((video, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 relative"
              style={{ scrollSnapAlign: "start" }}
            >
              <CourseCard {...video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard: React.FC<CourseWithFirstVideo> = ({
  course_description,
  course_id,
  course_title,
  thumbnail_url,
  total_duration,
  total_videos,
  created_at,
  course_difficulty,
}) => {
  const navigate = useNavigate();

  const onViewCourse = () => {
    navigate(`/course/${course_id}`);
  };

  return (
    <HoverCard>
      <HoverCardTrigger
        className="block w-full transition-all duration-200 hover:shadow-lg rounded-lg overflow-hidden"
        style={{ cursor: "pointer" }}
        onClick={onViewCourse}
      >
        <div className="relative group">
          {/* Thumbnail with overlay */}
          <div className="w-full h-44 bg-gray-200 overflow-hidden">
            <img
              src={thumbnail_url}
              alt={course_title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-0 right-0 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-bl-lg">
              {getShorthandTime(total_duration)}
            </div>
          </div>

          {/* Content */}
          <div className="p-3 bg-white">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
              {course_title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-2">
              {course_description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                <span>{total_videos} videos</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>4.8</span>
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-700 text-xs">
                {course_difficulty in courseDifficultyMap
                  ? courseDifficultyMap[
                      course_difficulty as keyof typeof courseDifficultyMap
                    ]
                  : "Simple"}
              </span>
            </div>
          </div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 p-4" side="right" align="start">
        <div className="space-y-3">
          <h4 className="font-bold text-lg">{course_title}</h4>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Created {dateToMonthYear(created_at)}</span>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <div className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
              {getShorthandTime(total_duration)}
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
              {total_videos} videos
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
              {course_difficulty in courseDifficultyMap
                ? courseDifficultyMap[
                    course_difficulty as keyof typeof courseDifficultyMap
                  ]
                : "Simple"}
            </div>
          </div>

          <p className="text-sm text-gray-600">{course_description}</p>

          <Button
            className="w-full"
            onClick={onViewCourse}
            style={{ backgroundColor: "rgb(64,126,139)" }}
          >
            Start Learning
          </Button>
        </div>
        <Arrow className="fill-white" />
      </HoverCardContent>
    </HoverCard>
  );
};

// Feature Card Component
const FeatureCard: React.FC<CourseWithFirstVideo> = ({
  course_description,
  course_id,
  course_title,
  thumbnail_url,
}) => {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative h-64 rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:scale-[1.02]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => navigate(`/course/${course_id}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={thumbnail_url}
        alt={course_title}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent ${
          hovering ? "opacity-95" : "opacity-90"
        } transition-opacity duration-300`}
      ></div>

      {/* Content overlay */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white mb-2">{course_title}</h3>

        <div
          className={`text-white/90 text-sm transition-transform duration-500 ${
            hovering ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="line-clamp-2">{course_description}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-white border-white hover:bg-white/20"
          >
            View Course
          </Button>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loaders
function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-44 w-72 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
}

function SkeletonFeatureCard() {
  return <Skeleton className="h-64 rounded-xl w-full" />;
}

// Main ExplorePage Component
export default function ExplorePage() {
  const [courses, setCourses] = useState<CourseWithFirstVideo[]>();
  const [filteredCourses, setFilteredCourses] =
    useState<CourseWithFirstVideo[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [isLoading, setIsLoading] = useState(true);

  async function getCourses() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc(
        "get_courses_with_first_video_and_duration"
      );

      if (data) {
        setCourses(data);
        setFilteredCourses(data);
      }

      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCourses();
  }, []);

  // Handle search
  useEffect(() => {
    if (!courses) return;

    const filtered = courses.filter(
      (course) =>
        course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  // Handle sorting
  useEffect(() => {
    if (!filteredCourses) return;

    let sorted = [...filteredCourses];

    switch (sortBy) {
      case "newest":
        sorted = sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "popular":
        // In real app, you would sort by ratings or views
        break;
      case "longest":
        sorted = sorted.sort((a, b) => {
          const [aHours, aMin] = a.total_duration.split(":").map(Number);
          const [bHours, bMin] = b.total_duration.split(":").map(Number);
          return bHours * 60 + bMin - (aHours * 60 + aMin);
        });
        break;
      default:
        break;
    }

    setFilteredCourses(sorted);
  }, [sortBy, courses]);

  // Featured courses (first 4)
  const featuredCourses = filteredCourses?.slice(0, 4) || [];

  // Popular courses (can be all or a subset)
  const popularCourses = filteredCourses || [];

  // Newest courses (sorted by date)
  const newestCourses = filteredCourses
    ? [...filteredCourses]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 8)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header section with search and filters */}

      {/* Main content */}
      <div className="space-y-10">
        {/* Featured courses section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-cyan-600 h-5 w-5" />
            <h2 className="text-2xl font-bold text-gray-800">
              Featured Courses
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonFeatureCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredCourses.map((course, index) => (
                <FeatureCard key={course.course_id || index} {...course} />
              ))}
            </div>
          )}
        </section>

        {/* Popular courses carousel */}
        <section>
          {isLoading ? (
            <div className="flex space-x-5 overflow-x-scroll pb-2 scrollbar-hide">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <CustomCarousel
              videos={popularCourses}
              title="Popular Courses"
              icon={<Flame className="text-red-500 h-5 w-5" />}
            />
          )}
        </section>

        {/* All courses grid with tabs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Grid2X2 className="text-gray-700 h-5 w-5" />
              <h2 className="text-2xl font-bold text-gray-800">
                Browse All Courses
              </h2>
            </div>

            {!isLoading && filteredCourses && (
              <p className="text-sm text-gray-500">
                Showing {filteredCourses.length} courses
              </p>
            )}
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Categories</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="personal">Personal Development</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses?.map((course, index) => (
                    <CourseCard key={course.course_id || index} {...course} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Other tab contents would be similar */}
            <TabsContent value="technology">
              <div className="text-center py-10 text-gray-500">
                <p>Technology courses coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="business">
              <div className="text-center py-10 text-gray-500">
                <p>Business courses coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="design">
              <div className="text-center py-10 text-gray-500">
                <p>Design courses coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="personal">
              <div className="text-center py-10 text-gray-500">
                <p>Personal Development courses coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>

          {!isLoading && filteredCourses && filteredCourses.length > 12 && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="border-gray-300">
                Load More Courses
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
