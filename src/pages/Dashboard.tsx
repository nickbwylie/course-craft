import React, { useMemo } from "react";
import {
  BookOpen,
  BarChart2,
  Bell,
  PlayCircle,
  List,
  Clock,
} from "lucide-react"; // Importing Lucide icons
import { CustomCarousel } from "./ExplorePage";
import { CourseWithFirstVideo } from "@/types/CourseType";
import { useCoursesActivity } from "@/contexts/CoursesActivityContext";

const Dashboard = () => {
  const { courses } = useCoursesActivity();

  function durationToSeconds(duration: string): number {
    console.log("duration", duration);
    const h = Number(duration[0] + duration[1]);
    const min = Number(duration[3] + duration[4]);
    const sec = Number(duration[6] + duration[7]);

    console.log("h", h);
    console.log("min", min);
    console.log("sec", sec);
    return Math.floor(h * 3600 + min * 60 + sec);
  }

  const hoursWatched = useMemo(() => {
    if (!courses) {
      return 0;
    }

    const totalSeconds = courses.reduce((acc, current) => {
      return acc + durationToSeconds(current.total_duration);
    }, 0);

    // Convert total seconds to hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);

    // Format the result as hh:mm:ss
    return `${hours.toString()}`;
  }, [courses]);

  return (
    <div
      className="grid gap-6 p-8 pt-6 rounded-2xl"
      style={{ backgroundColor: "rgb(252,252,249)" }}
    >
      {/* Active Courses */}
      <div
        className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        style={{ backgroundColor: "rgb(243,243	,238)" }}
      >
        <div className="flex items-center mb-4">
          <PlayCircle
            className="text-purple-500 w-6 h-6 mr-3"
            style={{ color: "rgb(240, 128, 128)" }}
          />
          <h2 className="text-xl text-gray-700 uppercase tracking-wider">
            Active Courses
          </h2>
        </div>
        <div className="mb-4">
          <CustomCarousel videos={courses} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Quick Overview */}
        <div
          className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "rgb(243,243	,238)" }}
        >
          <div className="flex items-center mb-4">
            <BookOpen
              className="w-6 h-6 mr-3"
              style={{ color: "rgb(70, 130, 180)" }}
            />
            <h2 className="text-xl text-gray-700 uppercase tracking-wider">
              Overview
            </h2>
          </div>

          <p className="text-sm ml-1 text-gray-600">
            <span
              className=" font-bold mr-2 text-2xl opacity-100"
              style={{ color: "rgb(70, 130, 180)" }}
            >
              {courses?.length || 0}
            </span>
            <span className="opacity-85">Total Courses</span>
          </p>
          <p className="text-sm ml-1  text-gray-600 ">
            <span
              className=" font-bold mr-2 text-2xl opacity-100"
              style={{ color: "rgb(70, 130, 180)" }}
            >
              {courses?.length || 0}
            </span>
            <span className="opacity-85">In Progress</span>
          </p>
          <p className="text-sm ml-1 text-gray-600">
            <span
              className="font-bold mr-2 text-2xl opacity-100"
              style={{ color: "rgb(70, 130, 180)" }}
            >
              3
            </span>
            <span className="opacity-85">Completed </span>
          </p>
        </div>

        {/* Learning Stats */}
        <div
          className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "rgb(243,243	,238)" }}
        >
          <div className="flex items-center mb-4">
            <BarChart2
              className=" w-6 h-6 mr-3"
              style={{ color: "rgb(34, 87, 73)" }}
            />
            <h2 className="text-xl text-gray-700 uppercase tracking-wider">
              Learning Stats
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            <span
              className="font-bold text-green-600 text-2xl opacity-100"
              style={{ color: "rgb(34, 87, 73)" }}
            >
              {hoursWatched} hours
            </span>{" "}
            <span className="opacity-85">studied</span>
          </p>
          <p className="text-sm text-gray-600 opacity-85">
            <span
              className="font-bold text-2xl opacity-100"
              style={{ color: "rgb(34, 87, 73)" }}
            >
              85%
            </span>{" "}
            <span className="opacity-85">average score</span>
          </p>
          <p className="text-sm text-gray-600 opacity-85">
            <span
              className="font-bold text-2xl opacity-100"
              style={{ color: "rgb(34, 87, 73)" }}
            >
              75%
            </span>{" "}
            <span className="opacity-85"> progress rate</span>
          </p>
        </div>
      </div>

      {/* Recommended Courses */}
      <div
        className="p-6  rounded-lg shadow-sm hover:shadow-md transition-shadow"
        style={{ backgroundColor: "rgb(243,243	,238)" }}
      >
        <div className="flex items-center mb-4">
          <Clock
            className="text-indigo-500 w-6 h-6 mr-3"
            style={{ color: "rgb(225, 129, 107)" }}
          />
          <h2 className="text-xl text-gray-700 uppercase tracking-wider">
            Recommended Courses
          </h2>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800">Course Title A</h3>
          <p className="text-gray-600 mb-2">Explore advanced topics...</p>
          <button className="text-indigo-500 font-semibold hover:underline">
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
