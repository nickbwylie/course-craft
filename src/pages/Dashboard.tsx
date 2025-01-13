import React from "react";
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

const Dashboard = () => {
  const videos: CourseWithFirstVideo[] = [
    {
      course_description: "Course Description",
      course_id: "1234",
      course_title: "How To Improve Yourself",
      thumbnail_url: "https://i.ytimg.com/vi/k8hgfXmZSHE/maxresdefault.jpg",
      video_id: "",
      video_title: "Jordan Peterson discusses ways to be better",
      total_duration: "00:10:00",
      total_videos: 1,
      created_at: new Date().toDateString(),
    },
  ];
  return (
    <div
      className="grid gap-6 p-8 pt-6 rounded-2xl"
      style={{ backgroundColor: "rgb(252,252,249)" }}
    >
      {/* Top Row */}
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
              5
            </span>
            <span className="opacity-85">Total Courses</span>
          </p>
          <p className="text-sm ml-1  text-gray-600 ">
            <span
              className=" font-bold mr-2 text-2xl opacity-100"
              style={{ color: "rgb(70, 130, 180)" }}
            >
              2
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
              12 hours
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
          <CustomCarousel videos={videos} />
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div
          className="p-6  rounded-lg shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "rgb(243,243	,238)" }}
        >
          <div className="flex items-center mb-4">
            <List
              className="text-orange-500 w-6 h-6 mr-3"
              style={{ color: "rgb(255, 183, 98)" }}
            />
            <h2 className="text-xl text-gray-700 uppercase tracking-wider">
              Recent Activity
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Added video to <span className="font-semibold">"Course 1"</span>
          </p>
          <p className="text-lg text-gray-600">
            Completed quiz in <span className="font-semibold">"Course 2"</span>
          </p>
          <p className="text-lg text-gray-600">
            Created <span className="font-semibold">"Course 3"</span>
          </p>
        </div>

        {/* Notifications */}
        <div
          className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: "rgb(243,243	,238)" }}
        >
          <div className="flex items-center mb-4">
            <Bell
              className="w-6 h-6 mr-3"
              style={{ color: "rgb(45, 45, 45) " }}
            />
            <h2 className="text-xl text-gray-700 uppercase tracking-wider">
              Notifications
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Quiz due in <span className="font-semibold">"Course 2"</span>
          </p>
          <p className="text-lg text-gray-600">
            Resume <span className="font-semibold">"Course 1"</span>
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
