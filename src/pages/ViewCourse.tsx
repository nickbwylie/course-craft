import { supabase } from "../supabaseconsant";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import "./CoursePage.css";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tv } from "lucide-react";
import { parseYouTubeDuration } from "@/helperFunctions/youtubeVideo";
import Quiz, { QuizQuestion } from "../quiz/Quiz.tsx";
import { Json } from "supabase-types.ts";

const parseSummary = (text: string) => {
  // Split the text by "###" marker to separate sections
  const sections = text.split("### ").filter(Boolean); // Remove empty strings from array

  // Map over sections to create JSX for each part
  return sections.map((section, index) => {
    // Split each section into the first line (heading) and the rest (content)
    const [heading, ...content] = section.split(/\n/); // Split by the first newline

    // Remove "Key Point X: " part from heading using regex
    const cleanedHeading = heading.replace(/Key Point \d+:\s*/, "").trim();

    return (
      <div key={index} className="text-left">
        <h3 className="font-bold text-lg ">{cleanedHeading}</h3>
        <p>{content.join(" ").trim()}</p>
        <br />
      </div>
    );
  });
};

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

export default function ViewCourse() {
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>();

  const [selectedCourse, setSelectedCourse] = useState(0);
  const location = useLocation();
  const { id } = useParams();

  const [showSummary, setShowSummary] = useState(true);

  async function getCourseContent(courseId: string) {
    // get_course_details(course_id UUID)
    // Call the RPC function to get course details
    const { data, error } = await supabase.rpc("filtered_course_details", {
      course_id: courseId,
    });

    try {
      setTimeout(() => {
        if (data) {
          setCourseVideos(data);
          console.log("course video", data);
        }
      }, 1000);
    } catch (e) {
      console.log(e);
    }

    if (error) {
      console.log("error getting course content");
    }
  }

  useEffect(() => {
    console.log(location);
    console.log(id);
    if (id) {
      getCourseContent(id);
    }
  }, [window.location.pathname]);

  return (
    <div className="w-full flex flex-col flex-nowrap ">
      <div className="w-full flex flex-row">
        {/* Left Section - Video and Tabs */}
        <div className="w-full md:w-2/3 p-6 md:p-8 h-full">
          {/* Course Title */}
          <h2 className="text-lg font-semibold text-slate-600 mb-6 text-left truncate">
            {courseVideos && courseVideos?.length > 0 ? (
              courseVideos[0].course_title
            ) : (
              <Skeleton className="w-1/3 h-[50px] bg-slate-300" />
            )}
          </h2>

          {/* YouTube Video Player */}
          {courseVideos && courseVideos ? (
            <div
              className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg"
              style={{
                width: "100%",
                maxWidth: "800px",
                height: "450px",
                margin: "0 auto",
              }}
            >
              <div className="absolute inset-0 flex justify-center items-center">
                <iframe
                  className="w-full h-full max-h-full max-w-full"
                  src={`https://www.youtube.com/embed/${courseVideos[selectedCourse].youtube_id}?rel=0&modestbranding=1&showinfo=0&autohide=1`}
                  title={courseVideos[selectedCourse].video_title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
            <Skeleton className="w-full h-64 md:h-96 bg-slate-300" />
          )}

          {/* Tab content for quiz */}
        </div>

        {/* Right Section - Course Modules */}
        <div className="w-full md:w-1/3 text-left ">
          <div className="w-full h-[470px] pt-16 p-6 pb-4 overflow-auto shadow-sm ">
            {/* Accordion for course modules */}

            {courseVideos?.map((courseVideo, index) => (
              <div
                onClick={() => {
                  setSelectedCourse(index);
                }}
              >
                <div
                  className={`flex w-full flex-col text-left items-start p-3 ${
                    index === selectedCourse ? "bg-gray-200" : ""
                  } border-b-2 border-gray-200 hover:bg-gray-300 cursor-pointer`}
                >
                  <div className="w-full text-sm truncated">
                    {courseVideo.video_title}
                  </div>
                  <span className="w-full flex flex-row space-x-2 items-center text-xs text-slate-700">
                    <h3>{parseYouTubeDuration(courseVideo.video_duration)}</h3>
                    <Tv width={10} height={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="h-full "></div>
        </div>
      </div>

      {/* course content quizes and summary */}
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-row items-center space-x-6 pl-12 pr-12 border-b-2 pb-2 ">
          <Button
            variant="secondary"
            onClick={() => setShowSummary(true)}
            className={`text-lg text-lg ${
              showSummary
                ? "font-bold underline underline-offset-[12px] decoration-4 decoration-cyan-500"
                : "font-semibold text-slate-600"
            }`}
          >
            Summary
          </Button>
          <Button
            onClick={() => setShowSummary(false)}
            variant="secondary"
            className={`text-lg text-lg ${
              !showSummary
                ? "font-bold underline underline-offset-[12px] decoration-4 decoration-cyan-500"
                : "font-semibold text-slate-600"
            }`}
          >
            Quiz
          </Button>
          <div
            className="grow text-end space-x-6 text-cyan-600 "
            style={{
              display: "flex",
              flexDirection: "row",
              justifySelf: "flex-end",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              variant="link"
              className="bg-slate-100 text-lg text-cyan-600"
              onClick={() =>
                setSelectedCourse((prev) => {
                  if (!courseVideos) return 0;

                  return prev <= 0 ? courseVideos.length - 1 : prev - 1;
                })
              }
            >
              Back
            </Button>
            <Button
              className="bg-cyan-500 text-lg hover:bg-cyan-600 text-slate-100"
              onClick={() =>
                setSelectedCourse((prev) => {
                  if (!courseVideos) return 0;
                  return (prev + 1) % courseVideos.length;
                })
              }
            >
              Next Video
            </Button>
          </div>
        </div>

        {/* summary */}
        <div className="w-full flex justify-center items-center ">
          <div className="w-[350px] md:w-[500px] lg:w-[800px] mt-4">
            {courseVideos &&
              showSummary &&
              parseSummary(courseVideos[selectedCourse].video_summary)}

            {courseVideos && !showSummary && (
              <Quiz
                key={selectedCourse}
                quiz={courseVideos[selectedCourse].quiz as QuizQuestion[]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
