import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Plus,
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
import { Badge } from "@/components/ui/badge";

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
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
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
              className="rounded-full border-slate-200 hover:bg-slate-50 h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {showRightArrow && (
            <Button
              onClick={scrollRight}
              variant="outline"
              size="icon"
              className="rounded-full border-slate-200 hover:bg-slate-50 h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-4 py-2 pb-4"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
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

  const onViewCourse = useCallback(() => {
    navigate(`/course/${course_id}`);
  }, [course_id, navigate]);

  const getDifficultyColor = useCallback((difficulty: number) => {
    const type = difficulty as keyof typeof courseDifficultyMap;

    switch (type) {
      case 1:
        return "bg-emerald-50 text-emerald-700";
      case 2:
        return "bg-blue-50 text-blue-700";
      case 3:
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  }, []);

  const difficultyText =
    course_difficulty in courseDifficultyMap
      ? courseDifficultyMap[
          course_difficulty as keyof typeof courseDifficultyMap
        ]
      : "Simple";

  const shortTime = useMemo(
    () => getShorthandTime(total_duration),
    [total_duration]
  );
  return (
    <HoverCard>
      <HoverCardTrigger
        className="block w-full transition-all duration-200 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md"
        onClick={onViewCourse}
      >
        <div className="relative group bg-white rounded-lg overflow-hidden">
          {/* Thumbnail with overlay */}
          <div className="w-full relative pb-[56.25%] overflow-hidden">
            {" "}
            {/* 16:9 aspect ratio */}
            <img
              src={thumbnail_url}
              alt={course_title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
              {shortTime}
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            <h3 className="text-base font-semibold text-slate-800 line-clamp-1 mb-1">
              {course_title}
            </h3>
            <p className="text-sm text-slate-600 mb-3 line-clamp-2 h-10">
              {course_description}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                <span>{total_videos} videos</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge
                  variant="outline"
                  className={`mb-2 font-normal ${getDifficultyColor(
                    course_difficulty
                  )}`}
                >
                  {difficultyText}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-80 p-0 shadow-lg border-slate-200 hidden sm:block "
        side="right"
        align="start"
      >
        <div className="p-4 space-y-3">
          <h4 className="font-semibold text-lg text-slate-800">
            {course_title}
          </h4>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>Created {dateToMonthYear(created_at)}</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="font-normal bg-slate-50">
              {getShorthandTime(total_duration)}
            </Badge>
            <Badge variant="outline" className="font-normal bg-slate-50">
              {total_videos} videos
            </Badge>
            <Badge
              variant="outline"
              className={`font-normal ${getDifficultyColor(course_difficulty)}`}
            >
              {difficultyText}
            </Badge>
          </div>

          <p className="text-sm text-slate-600">{course_description}</p>
        </div>

        <div className="border-t border-slate-100 p-3">
          <Button
            className="w-full bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)]"
            onClick={onViewCourse}
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
  total_duration,
  course_difficulty,
}) => {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);

  const difficultyText =
    course_difficulty in courseDifficultyMap
      ? courseDifficultyMap[
          course_difficulty as keyof typeof courseDifficultyMap
        ]
      : "Simple";

  return (
    <div
      className="relative h-64 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => navigate(`/course/${course_id}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={thumbnail_url}
        alt={course_title}
        className={`w-full h-full object-cover transition-all duration-500 ${
          hovering ? "scale-105" : "scale-100"
        }`}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/20 transition-opacity duration-300 "></div>

      {/* Badge and duration */}
      <div className="absolute top-3 right-3 flex gap-2">
        <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md backdrop-blur-sm">
          {getShorthandTime(total_duration)}
        </span>
        <span className="px-2 py-1 bg-white/90 text-slate-800 text-xs font-medium rounded-md backdrop-blur-sm">
          {difficultyText}
        </span>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-center ">
        <h3 className="text-xl font-semibold text-white mb-2">
          {course_title}
        </h3>

        <div
          className={`text-white/90 text-sm transition-all duration-300 ${
            hovering ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="line-clamp-2 mb-3">{course_description}</p>
          <Button
            className="bg-white/20 text-white hover:bg-white/30 border-0"
            size="sm"
          >
            View Course
          </Button>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loaders
const FastSkeletonCard = React.memo(function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 bg-white rounded-lg shadow-sm p-0 overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-3 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
});

function SkeletonFeatureCard() {
  return <Skeleton className="h-64 rounded-lg w-full" />;
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
  const featuredCourses = useMemo(() => {
    return filteredCourses?.slice(0, 4) || [];
  }, [filteredCourses]);

  // Popular courses (can be all or a subset)
  const popularCourses = useMemo(() => {
    return filteredCourses || [];
  }, [filteredCourses]);

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
    <div className="max-w-4xl mx-auto px-8 py-8 ">
      {/* Main content */}
      <div className="space-y-12">
        {/* Featured courses section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-[rgb(64,126,139)] h-5 w-5" />
            <h2 className="text-xl font-semibold text-slate-800">
              Featured Courses
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonFeatureCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredCourses.map((course, index) => (
                <FeatureCard key={course.course_id || index} {...course} />
              ))}
            </div>
          )}
        </section>

        {/* Popular courses carousel */}
        <section>
          {isLoading ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="text-red-500 h-5 w-5" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Popular Courses
                </h2>
              </div>
              <div className="flex space-x-4 overflow-x-scroll pb-4 scrollbar-hide">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div className="flex-shrink-0 w-72" key={i}>
                    <FastSkeletonCard />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <CustomCarousel
              videos={popularCourses}
              title="Popular Courses"
              icon={<Flame className="text-red-500 h-5 w-5" />}
            />
          )}
        </section>

        {/* New courses carousel */}
        {!isLoading && newestCourses.length > 0 && (
          <section>
            <CustomCarousel
              videos={newestCourses}
              title="New Courses"
              icon={<Plus className="text-emerald-500 h-5 w-5" />}
            />
          </section>
        )}

        {/* All courses grid with tabs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Grid2X2 className="text-slate-700 h-5 w-5" />
              <h2 className="text-xl font-semibold text-slate-800">
                Browse All Courses
              </h2>
            </div>

            {!isLoading && filteredCourses && (
              <Badge variant="outline" className="text-slate-600 bg-slate-50">
                {filteredCourses.length} courses
              </Badge>
            )}
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="border-b border-slate-200 mb-4">
              <TabsList className="bg-transparent h-10 p-0 space-x-6">
                <TabsTrigger
                  value="all"
                  className="
                  data-[state=active]:bg-gray-100
                  data-[state=active]:rounded-t-md
                  data-[state=active]:border-b-2 data-[state=active]:border-b-[rgb(64,126,139)] data-[state=active]:text-[rgb(64,126,139)] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3"
                >
                  All Categories
                </TabsTrigger>
                <TabsTrigger
                  value="technology"
                  className="
                  data-[state=active]:bg-gray-100
                  data-[state=active]:rounded-t-md
                  data-[state=active]:border-b-2 data-[state=active]:border-b-[rgb(64,126,139)] data-[state=active]:text-[rgb(64,126,139)] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3"
                >
                  Technology
                </TabsTrigger>
                <TabsTrigger
                  value="business"
                  className="data-[state=active]:bg-gray-100
                  data-[state=active]:rounded-t-md
                  data-[state=active]:border-b-2 data-[state=active]:border-b-[rgb(64,126,139)] data-[state=active]:text-[rgb(64,126,139)] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3"
                >
                  Business
                </TabsTrigger>
                <TabsTrigger
                  value="design"
                  className="data-[state=active]:bg-gray-100
                  data-[state=active]:rounded-t-md
                  data-[state=active]:border-b-2 data-[state=active]:border-b-[rgb(64,126,139)] data-[state=active]:text-[rgb(64,126,139)] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3"
                >
                  Design
                </TabsTrigger>
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-gray-100
                  data-[state=active]:rounded-t-md
                  data-[state=active]:border-b-2 data-[state=active]:border-b-[rgb(64,126,139)] data-[state=active]:text-[rgb(64,126,139)] data-[state=active]:shadow-none rounded-none bg-transparent px-2 py-3"
                >
                  Personal Development
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <FastSkeletonCard key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses?.map((course, index) => (
                    <CourseCard key={course.course_id || index} {...course} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Other tab contents would be similar */}
            <TabsContent value="technology" className="mt-0">
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-50/50 rounded-lg">
                <BookOpen className="h-10 w-10 mb-3 text-slate-300" />
                <h3 className="text-lg font-medium mb-1">Technology Courses</h3>
                <p className="text-sm">Coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="business" className="mt-0">
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-50/50 rounded-lg">
                <BookOpen className="h-10 w-10 mb-3 text-slate-300" />
                <h3 className="text-lg font-medium mb-1">Business Courses</h3>
                <p className="text-sm">Coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="design" className="mt-0">
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-50/50 rounded-lg">
                <BookOpen className="h-10 w-10 mb-3 text-slate-300" />
                <h3 className="text-lg font-medium mb-1">Design Courses</h3>
                <p className="text-sm">Coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="personal" className="mt-0">
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-50/50 rounded-lg">
                <BookOpen className="h-10 w-10 mb-3 text-slate-300" />
                <h3 className="text-lg font-medium mb-1">
                  Personal Development Courses
                </h3>
                <p className="text-sm">Coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>

          {!isLoading && filteredCourses && filteredCourses.length > 12 && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                className="border-slate-200 hover:bg-slate-50 hover:text-slate-800"
              >
                Load More Courses
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
