import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CourseWithFirstVideo, courseDifficultyMap } from "../types/CourseType";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Grid2X2,
  Monitor,
  Clock,
  TrendingUp,
  Plus,
  Calendar,
  BookOpen,
  Star,
  PlusCircle,
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
import { Badge } from "@/components/ui/badge";
import { useAdminCourses } from "@/hooks/useAdminCourses";
import { useGeneratedCourses } from "@/hooks/useGeneratedCourses";

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

// Helper functions
function getShorthandTime(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
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
  subtitle?: string;
}> = ({ videos, title, icon, subtitle }) => {
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
        left: -carouselRef.current.offsetWidth / 1.5,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: carouselRef.current.offsetWidth / 1.5,
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col relative">
          {/* Title with decorative accent */}
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 relative z-10">
            {icon}
            {title}
            {/* <span
              className={`absolute -left-4 h-full w-1 rounded-full ${
                title === "Popular Courses"
                  ? "bg-red-500/70 dark:bg-red-600/70"
                  : "bg-cyan-500/70 dark:bg-cyan-600/70"
              }`}
            /> */}
          </h3>
          {/* Subtle underline effect
          <div
            className={`absolute -bottom-2 left-0 h-1 w-20 rounded-full opacity-70 ${
              title === "Popular Courses"
                ? "bg-red-400 dark:bg-red-600"
                : "bg-primary/90 dark:bg-primary/90"
            }`}
          /> */}
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {showLeftArrow && (
            <Button
              onClick={scrollLeft}
              variant="outline"
              size="icon"
              className="rounded-full drop-shadow-sm border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 h-10 w-10 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {showRightArrow && (
            <Button
              onClick={scrollRight}
              variant="outline"
              size="icon"
              className="rounded-full drop-shadow-sm border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 h-10 w-10 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          className={`absolute rounded-lg ${
            title === "Popular Courses"
              ? "right-4 top-2  bg-primary-dark/90"
              : "left-4 bg-primary-dark/90 top-4"
          } w-full h-full `}
          style={{
            display: "inline-block",
            transform: `${
              title === "Popular Courses" ? "rotate(-2deg)" : "rotate(2deg)"
            }`,
          }}
        />
        <div
          ref={carouselRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-5 py-4 pb-6"
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
              style={{
                scrollSnapAlign: "start",
              }}
            >
              {/* <div
                className={`absolute left-4 top-4 opacity-60 ${
                  title === "Popular Courses" ? "right-4" : "left-4 top-2"
                } w-full h-full bg-primary-light`}
                style={{
                  transform: `${
                    title === "Popular Courses"
                      ? "rotate(0deg)"
                      : "rotate(0deg)"
                  }`,
                  display: "inline-block",
                }}
              /> */}
              <CourseCard {...video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = React.memo(function CourseCard({
  course_description,
  course_id,
  course_title,
  thumbnail_url,
  total_duration,
  total_videos,
  created_at,
  course_difficulty,
}: CourseWithFirstVideo) {
  const navigate = useNavigate();

  const onViewCourse = useCallback(() => {
    navigate(`/course/${course_id}`);
  }, [course_id, navigate]);

  const getDifficultyColor = useCallback((difficulty: number) => {
    const type = difficulty as keyof typeof courseDifficultyMap;

    // Colors for both light and dark mode
    switch (type) {
      case 1:
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30";
      case 2:
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30";
      case 3:
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
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
    <HoverCard openDelay={200} closeDelay={50}>
      <HoverCardTrigger
        className="block w-full transition-all duration-300 border border-slate-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg dark:shadow-none dark:hover:shadow-xl dark:hover:shadow-black/30 bg-white dark:bg-gray-800 transform cursor-pointer hover:-translate-y-1"
        onClick={onViewCourse}
      >
        <div className="rounded-xl overflow-hidden">
          {/* Thumbnail with overlay */}
          <div className="w-full relative pb-[56.25%] overflow-hidden bg-slate-100 dark:bg-gray-700">
            <img
              src={thumbnail_url}
              alt={course_title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
              {shortTime}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
              {course_title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 h-10">
              {course_description}
            </p>
            <div className="flex flex-row items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Monitor className="w-3 h-3" />
                <span>{total_videos} videos</span>
              </div>
              <Badge
                variant="outline"
                className={`font-normal text-xs px-2 py-0.5 border ${getDifficultyColor(
                  course_difficulty
                )}`}
              >
                {difficultyText}
              </Badge>
            </div>
          </div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-80 p-0 shadow-xl  dark:bg-gray-900 rounded-xl hidden sm:block z-50"
        side="right"
        align="start"
        sideOffset={5}
      >
        <div className="p-5 space-y-3">
          <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
            {course_title}
          </h4>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
            <span>Created {dateToMonthYear(created_at)}</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs pb-3">
            <Badge
              variant="outline"
              className="font-normal bg-slate-50 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-600"
            >
              {getShorthandTime(total_duration)}
            </Badge>
            <Badge
              variant="outline"
              className="font-normal bg-slate-50 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-600"
            >
              {total_videos} videos
            </Badge>
            <Badge
              variant="outline"
              className={`font-normal ${getDifficultyColor(course_difficulty)}`}
            >
              {difficultyText}
            </Badge>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {course_description}
          </p>
        </div>

        <div className="border-t border-slate-100 dark:border-gray-700 p-4">
          <Button
            className="w-full bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)] dark:bg-[rgb(74,136,149)] dark:hover:bg-[rgb(84,146,159)] text-white shadow-md hover:shadow-lg transition-all duration-300"
            onClick={onViewCourse}
          >
            Start Learning
          </Button>
        </div>
        <Arrow className="fill-slate-200 dark:fill-gray-700" />
      </HoverCardContent>
    </HoverCard>
  );
});

// Skeleton Loaders
const FastSkeletonCard = React.memo(function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-700 p-0 overflow-hidden animate-pulse">
      <Skeleton className="h-40 w-full rounded-none bg-gray-100 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-md bg-gray-100 dark:bg-gray-700" />
        <Skeleton className="h-4 w-full bg-gray-100 dark:bg-gray-700" />
        <Skeleton className="h-4 w-5/6 bg-gray-100 dark:bg-gray-700" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-20 bg-gray-100 rounded-full dark:bg-gray-700" />
          <Skeleton className="h-3 w-16 bg-gray-100 rounded-full dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
});

function SkeletonFeatureCard() {
  return (
    <div className="flex flex-col border border-slate-200 dark:border-gray-700 p-6 items-start dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none animate-pulse">
      <div className="flex flex-col sm:flex-row w-full gap-8 items-start">
        {/* Thumbnail skeleton */}
        <div className="min-w-72 h-48 sm:h-56">
          <Skeleton className="w-full h-full rounded-lg bg-gray-100 dark:bg-gray-700" />
        </div>

        {/* Content skeleton */}
        <div className="flex flex-col items-start w-full mt-4 sm:mt-0">
          {/* Title skeleton */}
          <Skeleton className="h-8 w-4/5 mb-3 bg-gray-100 dark:bg-gray-700" />

          {/* Date skeleton */}
          <Skeleton className="h-4 w-40 mb-4 bg-gray-100 dark:bg-gray-700" />

          {/* Description skeleton - multiple lines */}
          <Skeleton className="h-4 w-full mb-2 bg-gray-100 dark:bg-gray-700" />
          <Skeleton className="h-4 w-full mb-2 bg-gray-100 dark:bg-gray-700" />
          <Skeleton className="h-4 w-3/4 mb-6 bg-gray-100 dark:bg-gray-700" />

          {/* Button skeleton */}
          <Skeleton className="h-10 w-36 bg-gray-100 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

// Main ExplorePage Component
export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  // Filter options
  const categoryOptions = [
    { label: "Technology", value: "tech" },
    { label: "Business", value: "business" },
    { label: "Finance", value: "finance" },
    { label: "Design", value: "design" },
    { label: "Personal Development", value: "personal-dev" },
    { label: "Marketing", value: "marketing" },
  ];

  // Data fetching
  const { data: courses, isLoading, error } = useAdminCourses();
  const { data: userGeneratedCourses } = useGeneratedCourses();

  // Filtered courses based on search and category
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    let filtered = courses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.course_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.course_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, courses, selectedCategories]);

  // Featured courses (first 4)
  const featuredCourses = useMemo(() => {
    return filteredCourses?.slice(0, 4) || [];
  }, [filteredCourses]);

  // Popular courses (can be all or a subset)
  const popularCourses = useMemo(() => {
    return filteredCourses?.slice(0, 8) || [];
  }, [filteredCourses]);

  // Newest courses (sorted by date)
  const newestCourses = useMemo(() => {
    return filteredCourses
      ? [...filteredCourses]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 8)
      : [];
  }, [filteredCourses]);

  // Featured course data
  const featuredCourse = {
    course_description:
      "Want to understand AI but don't know where to start? This beginner-friendly course will teach you the basics of AI, how ChatGPT works, and how to use AI in everyday life. No tech skills needed—just curiosity! By the end, you'll have a solid foundation in AI and be able to use AI tools with confidence.",
    course_id: "c91a6877-8a56-4135-9c87-bb198f34ae06",
    thumbnail_url: "https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg",
    course_title: "AI for Beginners",
    created_at: "2025-03-08T19:11:34.66",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      {/* Search and Filter Bar */}
      {/* <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 rounded-lg"
            />
          </div>
          <div className="w-full md:w-60">
            <SearchableDropdown
              options={categoryOptions}
              placeholder="Select categories"
              emptyMessage="No categories found"
              value={selectedCategories}
              onValueChange={setSelectedCategories}
              className="border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      </div> */}

      {/* Main content */}
      <div className="space-y-16">
        {/* Featured courses section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-[rgb(64,126,139)] dark:text-[rgb(86,156,170)] h-5 w-5" />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
              Featured Course
            </h2>
          </div>

          {isLoading ? (
            <div className="w-full">
              <SkeletonFeatureCard />
            </div>
          ) : (
            <div className="flex flex-col border border-slate-200 dark:border-gray-600 p-6 items-start dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row w-full gap-8 items-start">
                <div className="sm:min-w-60 sm:w-60 w-full">
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                    <img
                      src={featuredCourse.thumbnail_url}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      alt={featuredCourse.course_title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                      <div className="w-full p-4">
                        <Button
                          size="sm"
                          className="w-full bg-white text-black hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                          onClick={() =>
                            navigate(`/course/${featuredCourse.course_id}`)
                          }
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Course
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start flex-grow">
                  <h1 className="text-2xl font-semibold text-[rgb(64,126,139)] dark:text-[rgb(86,156,170)] w-full">
                    {featuredCourse.course_title}
                  </h1>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <Badge
                      variant="outline"
                      className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    >
                      <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                      Featured
                    </Badge>
                    <p className="font-light text-xs flex items-center text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {dateToMonthYear(featuredCourse.created_at)}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {featuredCourse.course_description}
                  </p>

                  <div>
                    <Button
                      onClick={() =>
                        navigate(`/course/${featuredCourse.course_id}`)
                      }
                      className="bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)] dark:bg-[rgb(74,136,149)] dark:hover:bg-[rgb(84,146,159)] text-white"
                    >
                      Start Learning{" "}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Popular courses carousel */}
        <section>
          {isLoading ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Flame className="text-red-500 h-5 w-5" />
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  Popular Courses
                </h2>
              </div>
              <div className="flex space-x-5 overflow-x-scroll pb-6 scrollbar-hide">
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
              icon={<Flame className="text-red-500 h-6 w-6" />}
              subtitle="Most loved courses by our community"
            />
          )}
        </section>

        {/* New courses carousel */}
        {!isLoading && newestCourses.length > 0 ? (
          <section>
            <CustomCarousel
              videos={newestCourses}
              title="New Courses"
              icon={<Plus className="text-primary h-6 w-6" />}
              subtitle="Recently added learning paths"
            />
          </section>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Plus className="text-emerald-500 h-5 w-5" />
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                New Courses
              </h2>
            </div>
            <div className="flex space-x-5 overflow-x-scroll pb-6 scrollbar-hide">
              {[1, 2, 3, 4, 5].map((i) => (
                <div className="flex-shrink-0 w-72" key={i}>
                  <FastSkeletonCard />
                </div>
              ))}
            </div>
          </>
        )}

        {/* All courses grid with tabs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Grid2X2 className="text-slate-700 dark:text-slate-300 h-6 w-6" />
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                Browse All Courses
              </h2>
            </div>

            {!isLoading && filteredCourses && (
              <Badge
                variant="outline"
                className="text-slate-600 bg-slate-50 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-600 px-2.5 py-1 text-xs"
              >
                {userGeneratedCourses?.length} courses
              </Badge>
            )}
          </div>

          {userGeneratedCourses && userGeneratedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
              {userGeneratedCourses.map((course, index) => (
                <CourseCard key={course.course_id || index} {...course} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-slate-200 dark:border-gray-700 shadow-sm">
              <PlusCircle className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
                No user-generated courses yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Be the first to create and share a course with the community!
              </p>
              <Button
                className="bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)] dark:bg-[rgb(74,136,149)] dark:hover:bg-[rgb(84,146,159)] text-white shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => navigate("/create")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a Course
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
