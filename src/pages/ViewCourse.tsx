import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { supabase } from "../supabaseconsant";
import "./CoursePage.css";

import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  List,
  Maximize2,
  Menu,
  Minimize2,
  MonitorPlay,
  Play,
  Share2,
  Star,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tv } from "lucide-react";

import { parseYouTubeDuration } from "@/helperFunctions/youtubeVideo";
import Quiz, { QuizQuestion } from "../quiz/Quiz.tsx";
import { Json } from "supabase-types.ts";

export interface CourseVideo {
  course_description: string;
  course_id: string;
  course_title: string;
  quiz: Json;
  video_summary: string;
  quiz_id: string;
  video_id: string;
  video_title: string;
  video_duration: string;
  youtube_id: string;
}

// Parse summary text into formatted sections
const parseSummary = (text: string) => {
  if (!text) return [];

  const cleanedText = text.replaceAll("*", "");
  // Split the text by "###" marker to separate sections
  const sections = cleanedText.split("### ").filter(Boolean);

  // Map over sections to create JSX for each part
  return sections.map((section, index) => {
    // Split each section into the first line (heading) and the rest (content)
    const [heading, ...content] = section.split(/\n/);

    // Remove "Key Point X: " part from heading using regex
    const cleanedHeading = heading.replace(/Key Point \d+:\s*/, "").trim();

    return (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {cleanedHeading}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {content.join(" ").trim()}
        </p>
      </div>
    );
  });
};

export default function ViewCourse() {
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>();
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [showSummary, setShowSummary] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const { id } = useParams();

  async function getCourseContent(courseId: string) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc("filtered_course_details", {
        course_id: courseId,
      });

      if (data) {
        setCourseVideos(data);
      }

      if (error) {
        console.error("Error getting course content:", error);
      }
    } catch (e) {
      console.error("Unexpected error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getCourseContent(id);
      setSelectedCourse(0);
    }
  }, [id]);

  // Handle navigation between videos
  const goToNextVideo = () => {
    if (!courseVideos) return;
    setSelectedCourse((prev) => (prev + 1) % courseVideos.length);
  };

  const goToPreviousVideo = () => {
    if (!courseVideos) return;
    setSelectedCourse((prev) =>
      prev <= 0 ? courseVideos.length - 1 : prev - 1
    );
  };

  // Calculate progress percentage
  const progressPercentage = courseVideos
    ? Math.round(((selectedCourse + 1) / courseVideos.length) * 100)
    : 0;

  // Get current video data
  const currentVideo =
    courseVideos && courseVideos.length > selectedCourse
      ? courseVideos[selectedCourse]
      : null;

  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen">
      {/* Mobile Nav Toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white shadow-md"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96 p-0">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">Course Content</h2>
              <p className="text-sm text-gray-500">
                {courseVideos ? `${courseVideos.length} videos` : "Loading..."}
              </p>
            </div>

            <ScrollArea className="h-[calc(100vh-80px)] p-4">
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="mb-4">
                        <Skeleton className="h-16 w-full mb-2" />
                      </div>
                    ))
                : courseVideos?.map((courseVideo, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedCourse(index);
                        setIsMobileNavOpen(false);
                      }}
                      className={`flex items-start p-3 mb-2 rounded-lg cursor-pointer ${
                        index === selectedCourse
                          ? "bg-cyan-50 border border-cyan-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3 relative">
                        {index === selectedCourse && (
                          <div className="absolute inset-0 bg-cyan-500/30 rounded flex items-center justify-center">
                            <img
                              src={`https://img.youtube.com/vi/${courseVideo?.youtube_id}/hqdefault.jpg`}
                              alt="Video Thumbnail"
                              className="absolute inset-0 w-full h-full object-cover opacity-50"
                            />
                          </div>
                        )}
                        <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                          <img
                            src={`https://img.youtube.com/vi/${courseVideo?.youtube_id}/hqdefault.jpg`}
                            alt="Video Thumbnail"
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`text-sm ${
                            index === selectedCourse ? "font-medium" : ""
                          }`}
                        >
                          {courseVideo.video_title}
                        </h4>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {parseYouTubeDuration(courseVideo.video_duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Course Header - Only visible on larger screens and when not in theater mode */}
      {!isTheaterMode && (
        <div className="px-4 py-6 md:px-8 mb-2">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            {isLoading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              courseVideos && courseVideos[0]?.course_title
            )}
          </h1>

          {isLoading ? (
            <Skeleton className="h-4 w-1/2" />
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500"></div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex flex-col lg:flex-row w-full ${
          isTheaterMode ? "h-screen" : ""
        }`}
      >
        {/* Left Content Area - Video and Tabs */}
        <div
          className={`
          ${
            isTheaterMode
              ? "w-full h-full flex flex-col"
              : "lg:w-2/3 px-4 md:px-8 pb-8"
          } 
          transition-all duration-300
        `}
        >
          {/* Video Container */}
          <div
            className={`
            relative bg-black rounded-lg overflow-hidden shadow-lg 
            ${isTheaterMode ? "flex-1" : "aspect-video"}
            mb-4
          `}
          >
            {isLoading || !currentVideo ? (
              <Skeleton className="w-full h-full bg-gray-800" />
            ) : (
              <>
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?rel=0&modestbranding=1&showinfo=0&autohide=1`}
                  title={currentVideo.video_title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>

                {/* Video Controls Overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-black/40 border-gray-700 text-white hover:bg-black/60"
                          onClick={() => setIsTheaterMode(!isTheaterMode)}
                        >
                          {isTheaterMode ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isTheaterMode ? "Exit Theater Mode" : "Theater Mode"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}
          </div>

          {/* Video Title and Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              {isLoading || !currentVideo ? (
                <>
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {currentVideo.video_title}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {parseYouTubeDuration(currentVideo.video_duration)}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousVideo}
                disabled={isLoading || !courseVideos}
                className="text-gray-700"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <Button
                size="sm"
                onClick={goToNextVideo}
                disabled={isLoading || !courseVideos}
                style={{ backgroundColor: "rgb(64,126,139)" }}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Content Tabs */}
          {!isTheaterMode && (
            <div className="mb-8">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="mb-6 grid grid-cols-2 w-full md:w-auto">
                  <TabsTrigger
                    value="summary"
                    className="text-sm font-medium"
                    onClick={() => setShowSummary(true)}
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="quiz"
                    className="text-sm font-medium"
                    onClick={() => setShowSummary(false)}
                  >
                    Quiz
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-0">
                  {isLoading || !currentVideo ? (
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="mb-6">
                          <Skeleton className="h-6 w-48 mb-2" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      {parseSummary(currentVideo.video_summary)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="quiz" className="mt-0">
                  {isLoading || !currentVideo ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <Quiz
                        key={selectedCourse}
                        quiz={currentVideo.quiz as QuizQuestion[]}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Right Sidebar - Course Modules (hidden in theater mode and on mobile) */}
        <div
          className={`
          lg:w-1/3 border-l border-gray-200 bg-white
          ${isTheaterMode ? "hidden" : "hidden lg:block"}
        `}
        >
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Course Content</h2>
            <p className="text-sm text-gray-500">
              {courseVideos ? `${courseVideos.length} videos` : "Loading..."}
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="mb-4">
                      <Skeleton className="h-16 w-full mb-2" />
                    </div>
                  ))
              ) : (
                <div className="space-y-2">
                  {courseVideos?.map((courseVideo, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedCourse(index)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        index === selectedCourse
                          ? "bg-cyan-50 border border-cyan-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {index < selectedCourse ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : index === selectedCourse ? (
                              <Play className="h-4 w-4 text-cyan-500 fill-cyan-500" />
                            ) : (
                              <span className="text-xs font-medium text-gray-700">
                                {index + 1}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`text-sm ${
                              index === selectedCourse ? "font-medium" : ""
                            } line-clamp-2`}
                          >
                            {courseVideo.video_title}
                          </h4>
                          <div className="flex items-center mt-1">
                            <Tv className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {parseYouTubeDuration(courseVideo.video_duration)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {index === selectedCourse && (
                        <div className="mt-2 pl-11">
                          <div className="flex gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                showSummary
                                  ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSummary(true);
                              }}
                            >
                              Summary
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                !showSummary
                                  ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSummary(false);
                              }}
                            >
                              Quiz
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Theater Mode Content Tab */}
      {isTheaterMode && currentVideo && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <Collapsible>
            <div className="px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Content</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="px-4 pb-4">
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger
                      value="summary"
                      onClick={() => setShowSummary(true)}
                    >
                      Summary
                    </TabsTrigger>
                    <TabsTrigger
                      value="quiz"
                      onClick={() => setShowSummary(false)}
                    >
                      Quiz
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary">
                    <div className="prose prose-sm max-w-none">
                      {parseSummary(currentVideo.video_summary)}
                    </div>
                  </TabsContent>

                  <TabsContent value="quiz">
                    <div className="bg-white rounded-lg">
                      <Quiz
                        key={selectedCourse}
                        quiz={currentVideo.quiz as QuizQuestion[]}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
}
