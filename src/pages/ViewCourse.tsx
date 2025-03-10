import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabaseconsant";
import "./CoursePage.css";

import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Menu,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {cleanedHeading}
        </h3>
        <p className="text-slate-600 leading-relaxed">
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Get current video data
  const currentVideo =
    courseVideos && courseVideos.length > selectedCourse
      ? courseVideos[selectedCourse]
      : null;

  return (
    <div className="flex flex-col max-w-4xl mx-auto min-h-screen">
      {/* Mobile Nav Toggle */}
      <div className="lg:hidden fixed top-4 right-8 z-50">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white shadow-md border-slate-200"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 sm:w-96 p-0 bg-white border-l border-slate-200"
          >
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-lg text-slate-800">
                Course Content
              </h2>
              <p className="text-sm text-slate-500">
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
                          : "hover:bg-slate-50"
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
                        <div className="w-20 h-12 bg-slate-200 rounded overflow-hidden flex items-center justify-center">
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
                            index === selectedCourse
                              ? "font-medium text-slate-800"
                              : "text-slate-700"
                          }`}
                        >
                          {courseVideo.video_title}
                        </h4>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-slate-400 mr-1" />
                          <span className="text-xs text-slate-500">
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

      <div className="px-4 md:px-8 py-6 mb-2 border-b border-slate-200">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
          {isLoading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            courseVideos && courseVideos[0]?.course_title
          )}
        </h1>

        {isLoading ? (
          <Skeleton className="h-4 w-1/2" />
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500"></div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`flex flex-col lg:flex-row w-full`}>
        {/* Left Content Area - Video and Tabs */}
        <div
          className={`lg:w-2/3 px-8 pt-4 md:px-8 pb-8 transition-all duration-300
          `}
        >
          {/* Video Container */}
          <div
            className={`
              relative bg-black rounded-lg overflow-hidden shadow-lg aspect-video mb-6
            `}
          >
            {isLoading || !currentVideo ? (
              <Skeleton className="w-full h-full bg-slate-800" />
            ) : (
              <>
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?rel=0&modestbranding=1&showinfo=0&autohide=1`}
                  title={currentVideo.video_title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
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
                  <h2 className="text-lg font-semibold text-slate-800">
                    {currentVideo.video_title}
                  </h2>
                  <p className="text-sm text-slate-500 flex items-center mt-1">
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
                className="text-slate-700 border-slate-300 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <Button
                size="sm"
                onClick={goToNextVideo}
                disabled={isLoading || !courseVideos}
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="mb-6 grid grid-cols-2 w-full md:w-auto bg-slate-100">
                <TabsTrigger
                  value="summary"
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                  onClick={() => setShowSummary(true)}
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="quiz"
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
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
                  <div className="prose prose-sm max-w-none p-4 border border-slate-100 rounded-lg bg-white">
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
                  <div className="border border-slate-100 rounded-lg bg-white">
                    <Quiz
                      key={selectedCourse}
                      quiz={currentVideo.quiz as QuizQuestion[]}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Sidebar - Course Modules (hidden in theater mode and on mobile) */}
        <div
          className={`
            lg:w-1/3 lg:border-l lg:border-slate-200 hidden lg:block`}
        >
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-lg text-slate-800">
              Course Content
            </h2>
            <p className="text-sm text-slate-500">
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
                          ? "bg-[#407e8b14] "
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            {index < selectedCourse ? (
                              <CheckCircle className="h-5 w-5 text-emerald-700" />
                            ) : index === selectedCourse ? (
                              <div className="bg-cyan-100 rounded-full p-1.5">
                                <Play className="h-4 w-4 text-cyan-600 fill-cyan-600" />
                              </div>
                            ) : (
                              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                                {index + 1}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`text-sm ${
                              index === selectedCourse
                                ? "font-medium text-slate-800"
                                : "text-slate-700"
                            } line-clamp-2`}
                          >
                            {courseVideo.video_title}
                          </h4>
                          <div className="flex items-center mt-1">
                            <Tv className="h-3 w-3 text-slate-400 mr-1" />
                            <span className="text-xs text-slate-500">
                              {parseYouTubeDuration(courseVideo.video_duration)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {index === selectedCourse && (
                        <div className="mt-2 pl-11">
                          <div className="flex gap-2">
                            <Badge
                              variant={showSummary ? "default" : "outline"}
                              className={`text-xs ${
                                showSummary
                                  ? "bg-cyan-600 hover:bg-cyan-500"
                                  : "border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSummary(true);
                              }}
                            >
                              Summary
                            </Badge>
                            <Badge
                              variant={!showSummary ? "default" : "outline"}
                              className={`text-xs ${
                                !showSummary
                                  ? "bg-cyan-600 hover:bg-cyan-500"
                                  : "border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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
    </div>
  );
}
