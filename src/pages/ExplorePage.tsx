import React, { useEffect, useMemo, useRef, useState } from "react";
import { CourseWithFirstVideo } from "../types/CourseType";
import { supabase } from "@/supabaseconsant";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  Grid2X2,
  Monitor,
} from "lucide-react";

import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Arrow } from "@radix-ui/react-hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import { useTheme } from "@/styles/useTheme";

type VideoCardProps = {
  thumbnailUrl: string;
  title: string;
  description: string;
  onViewCourse: () => void;
  index: number;
};
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

//

export const CustomCarousel: React.FC<{ videos: CourseWithFirstVideo[] }> = ({
  videos,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false); // State to control left arrow visibility

  const [showRightArrow, setShowRightArrow] = useState(true);
  // Check scroll position to show/hide left and right arrows
  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      // Show the left arrow if we've scrolled away from the start
      setShowLeftArrow(scrollLeft > 0);
      // Hide the right arrow if we've scrolled to the end
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

  // Attach the scroll event listener to track when to show/hide arrows
  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener("scroll", handleScroll);
      handleScroll(); // Initialize arrow visibility based on scroll position
    }

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  return (
    <div className="w-full relative">
      <div className="relative">
        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-4 py-0"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {videos.map((video, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 relative" // Adjust the width of the card
              style={{ scrollSnapAlign: "start" }}
            >
              <BookVideoCard {...video} />
            </div>
          ))}
        </div>

        {/* Overlayed Arrows (half on image, half off) */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 left-0 transform -translate-y-20 text-3xl z-10 bg-gray-800 text-white p-2 rounded-full opacity-90 hover:opacity-100 hover:drop-shadow border"
            style={{
              marginLeft: "-20px",
              borderColor: "rgb(232,239,236)",
              borderWidth: 2,
            }} // Shift half off the edge
          >
            <ChevronLeft />
          </button>
        )}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute top-1/2 right-0 transform -translate-y-20 text-3xl z-10 bg-gray-800 text-white p-2 rounded-full opacity-90 hover:opacity-100 hover:drop-shadow border border-cyan-500"
            style={{
              marginRight: "-20px",
              borderColor: "rgb(232,239,236)",
              borderWidth: 2,
            }} // Shift half off the edge
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

const BookVideoCard: React.FC<CourseWithFirstVideo> = ({
  course_description,
  course_id,
  course_title,
  thumbnail_url,
  video_id,
  video_title,
  total_duration,
  total_videos,
  created_at,
}) => {
  const navigate = useNavigate();

  const dateToMonthYear = (dateS: string): string => {
    const newDate = new Date(dateS);

    const currentMonth = newDate.getMonth();

    const year = newDate.getFullYear();

    return `${months[currentMonth]} ${year}`;
  };

  const onViewCourse = () => {
    navigate(`/course/${course_id}`);
  };

  return (
    <HoverCard>
      <HoverCardTrigger
        className="w-64 flex flex-col place-items-start  text-left"
        style={{ cursor: "pointer" }}
        onClick={onViewCourse}
      >
        {/* Video Thumbnail */}
        <div className="w-64 h-44 bg-gray-500 overflow-hidden rounded-lg">
          <img
            src={thumbnail_url}
            alt={course_title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="pt-2 w-full">
          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 truncate">
            {course_title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {course_description}
          </p>

          <div className="w-full flex flex-row space-x-2 text-xs text-slate-500 items-center">
            <span className="text-xs text-slate-500">
              {getShorthandTime(total_duration)}
            </span>
            <span>
              <Monitor width={12} height={12} />
            </span>
            <span>{total_videos} videos </span>
            <span>Expert</span>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-64"
        side="right"
        align="start"
        style={{ backgroundColor: "rgb(243,243	,238)" }}
      >
        <div className="w-full flex justify-between space-x-4">
          <div className="w-full space-y-1">
            <h4 className="w-full text-sm font-semibold">{course_title}</h4>
            <div
              className=" w-full flex items-center pt-2"
              style={{ color: "rgb(64,126	,139)" }}
            >
              <CalendarDays className="mr-2 h-4 w-4" />{" "}
              <span className="text-xs ">
                Created {dateToMonthYear(created_at)}
              </span>
            </div>
            <div className="flex items-center pt-2 pb-4">
              <div className="w-full flex flex-row space-x-2 text-xs text-slate-500 items-center">
                <span className="text-xs text-slate-500">
                  {getShorthandTime(total_duration)} -
                </span>
                <span>{total_videos} videos -</span>
                <span>Expert</span>
              </div>
            </div>
            <p className=" w-full text-sm text-left text-slate-600 pb-2">
              {course_description}
            </p>
            <div className="w-full flex flex-row">
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
                className="text-sm text-slate-700"
              >
                <span className="flex flex-nowrap items-center">
                  4.1k &nbsp;
                  <Eye width={16} height={16} />{" "}
                </span>
              </div>
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "right",
                }}
                className="text-sm text-slate-700"
              >
                <Button
                  className="text-sm  text-slate-200 hover:bg-slate-600"
                  style={{ backgroundColor: "rgb(64,126	,139)" }}
                  onClick={onViewCourse}
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Arrow />
      </HoverCardContent>
    </HoverCard>
  );
};

const CardWithOverlay: React.FC<VideoCardProps> = ({
  thumbnailUrl,
  title,
  description,
}) => {
  const [hovering, setHovering] = useState(false);

  const colors = ["bg-slate-700", "bg-sky-900"];

  const cardColor = useMemo(() => {
    return colors[Math.floor(Math.random() * 2)];
  }, []);

  return (
    <div>
      <div
        className="relative h-60 rounded-xl hover:drop-shadow overflow-hidden"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={thumbnailUrl}
          alt="Workout"
          className=" h-full object-cover rounded-xl"
        />
        {/* Colored Overlay */}
        <div
          className={`absolute inset-0 shadow-lg ${cardColor}  ${
            hovering ? "opacity-90" : "opacity-80"
          } rounded-xl transition-opacity duration-300`}
        ></div>
        {/* Overlay Content */}
        <div className="absolute inset-0 rounded-xl">
          <h4 className="absolute text-slate-100 mt-4 ml-4 text-lg font-semibold">
            {title}
          </h4>

          <div
            className={`absolute left-4 right-4 text-left text-slate-300 text-sm font-semibold transition-transform duration-500 ${
              hovering ? "translate-y-0" : "translate-y-48"
            }`}
          >
            <h4 className="mt-24">{description}</h4>
            <h4 className="mt-4">Jordan Peterson</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 ">
      <Skeleton className="h-[176px] w-64 rounded-xl bg-slate-300" />
      <div className="space-y-2">
        <Skeleton className="h-[28px] w-[250px] bg-slate-300" />
        <Skeleton className="h-[40px] w-[250px] bg-slate-300" />
        <Skeleton className="h-[28px] w-[200px] bg-slate-300" />
      </div>
    </div>
  );
}

function SkeletonCardGrid() {
  const [width, setWidth] = useState(window.innerWidth);

  // Update width on window resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const widthOfSkeleton = useMemo(() => {
    if (width <= 766) {
      return 1;
    } else if (width <= 2000) {
      return 2;
    } else {
      return 3;
    }
  }, [width]);

  const skeletonWidth = useMemo(() => {
    console.log("screen width", width);
    console.log("amount of skeleton", widthOfSkeleton);

    if (width > 1600) {
      return 500;
    } else if (width <= 1600) {
      return 275;
    } else if (width <= 1400) {
      return 200;
    } else if (width <= 1000) {
      return 500;
    }

    return 500;
  }, [widthOfSkeleton, width]);

  return (
    <Skeleton
      className="h-60 rounded-xl bg-slate-300"
      style={{ width: skeletonWidth }}
    />
  );
}

export default function ExplorePage() {
  const [youTubeVideos, setYouTubeVideos] = useState<CourseWithFirstVideo[]>();
  const { theme, toggleTheme } = useTheme();

  async function getCourses() {
    const { data, error } = await supabase.rpc(
      "get_courses_with_first_video_and_duration"
    );
    console.log("course data", data);

    setTimeout(() => {
      setYouTubeVideos(data);
    }, 500);

    if (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCourses();
  }, []);
  return (
    <div className="flex grow flex-col py-8 pt-6 px-8 justify-start space-y-8">
      <div className="w-full flex flex-col space-y-4">
        <div className="w-full flex flex-row space-x-2 items-center">
          <h3
            className="text-xl text-left font-bold bg-cyan-500 p-2 text-white underline  underline-offset-8"
            // style={{ backgroundColor: theme.primaryz[900] }}
            style={{ backgroundColor: "rgb(64,126	,139)" }}
          >
            {" "}
            Most <span>Popular</span>
          </h3>
          <Flame
            width={24}
            height={24}
            style={{ color: "rgb(240, 128, 128)" }}
          />
        </div>
        <div className="w-full flex flex-row space-x-8 justify-start ">
          {youTubeVideos ? (
            <CustomCarousel videos={youTubeVideos} />
          ) : (
            [0, 1, 2, 3, 4].map(() => <SkeletonCard />)
          )}
        </div>
      </div>
      <div className="w-full flex flex-col space-y-4">
        <div className="w-full flex flex-row space-x-2 items-center">
          <h3
            className="text-xl text-left font-bold bg-cyan-500 p-2 text-white underline  underline-offset-8"
            style={{ backgroundColor: "rgb(64,126	,139)" }}
          >
            {" "}
            Browse <span>All</span>
          </h3>
          <Grid2X2 width={24} height={24} style={{ color: "rgb(28	51	58)" }} />
        </div>
        <div
          style={{ width: "100%", overflowX: "hidden" }}
          className="flex flex-wrap"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {youTubeVideos
              ? youTubeVideos.map((video, index) => (
                  <CardWithOverlay
                    description={video.course_description}
                    index={index}
                    onViewCourse={() => {}}
                    thumbnailUrl={video.thumbnail_url}
                    title={video.course_title}
                  />
                ))
              : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => <SkeletonCardGrid />)}
          </div>
        </div>
      </div>
    </div>
  );
}
