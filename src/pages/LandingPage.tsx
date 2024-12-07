import React from "react";
import { Parallax } from "react-scroll-parallax";

import image1 from "../assets/youtubePreview.jpg";

import image2 from "../assets/youtubePreview2.jpg";

import image3 from "../assets/youtubePreview3.jpg";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  CheckCircle,
  Pen,
  Quote,
  QuoteIcon,
  SparkleIcon,
  Sparkles,
  Sun,
  TextQuote,
  TextQuoteIcon,
  Tv,
} from "lucide-react";

import createPageScreen from "../assets/createCoursePage.png";

import exploreScreen from "../assets/explorePageScreen.png";
import screenRecording from "../assets/recording.mov"; // Adjust the path as needed
import PricingBlock from "@/myComponents/PricingBlock";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          backgroundColor: "rgb(252,252,249)",
        }}
      >
        {/* Centered Text */}
        <div
          className="w-full h-full flex flex-col space-y-4 justify-center items-center backdrop-blur-lg"
          style={{ position: "relative", zIndex: 10 }}
        >
          <h1
            className="flex flex-row text-3xl text-center w-[500px] font-semibold"
            style={{ position: "relative", zIndex: 10 }}
          >
            <Sparkles width={48} height={48} className="text-yellow-300" />
            Create Custom Courses from YouTube Videos in Seconds
            <Sparkles width={48} height={48} className="text-cyan-300" />
          </h1>

          <h3 className="text-sm text-slate-500 w-[400px] font-semibold text-center pb-2">
            Learn what you want, when you want, how you want.
          </h3>
          <div className="w-full flex flex-row justify-center space-x-2">
            <Button
              className="text-lg bg-[#90CEEF] hover:bg-[#A9D8F2]  rounded-2xl"
              style={{ color: "#031A27" }}
              onClick={() => navigate("/create")}
            >
              Create a Course Now
            </Button>
            <Button
              className="text-lg rounded-2xl"
              style={{ backgroundColor: "#04293D", color: "#D3ECE5" }}
              onClick={() => navigate("/explore")}
            >
              Explore Courses
            </Button>
          </div>
          <div className="w-full flex justify-center">
            <video
              src={screenRecording}
              autoPlay
              muted
              loop
              className="rounded-lg shadow-lg"
              style={{ width: "80%", maxWidth: "800px" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Parallax Images
        <Parallax
          speed={5}
          style={{ position: "absolute", top: "20%", left: "10%" }}
        >
          <img src={image1} alt="Small Image 1" style={{ width: "200px" }} />
        </Parallax>
        <Parallax
          speed={-10}
          style={{ position: "absolute", top: "30%", right: "5%" }}
        >
          <img src={image3} alt="Small Image 2" style={{ width: "250px" }} />
        </Parallax>
        <Parallax
          speed={20}
          style={{ position: "absolute", bottom: "20%", left: "5%" }}
        >
          <img src={image2} alt="Small Image 3" style={{ width: "300px" }} />
        </Parallax> */}
      </div>

      {/* Add more content to enable scrolling */}
      <div
        style={{
          width: "100%",
        }}
        className="pt-24 pb-24 pl-8 pr-8 flex flex-col text-center items-start space-y-12 bg-slate-100"
      >
        <h2 className="w-full text-2xl font-semibold text-center">
          How it works?
        </h2>

        <div
          className="w-full flex flex-row justify-between"
          style={{
            maxWidth: "1500px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Parallax speed={5}>
            <div className="w-80 h-48 p-4 rounded-lg border-2 bg-white drop-shadow-sm flex flex-row">
              <div className="w-30 h-full">
                <Tv width={30} height={30} className="text-red-500" />
              </div>
              <div className="grow h-full pl-4">
                <h3 className="text-lg text-left font-semibold">
                  Choose Your Videos
                </h3>
                <h3 className="text-md text-left">
                  Pick YouTube videos that match what you want to learn
                </h3>
              </div>
            </div>
          </Parallax>

          <Parallax speed={-3}>
            <div className="w-80 h-48 p-4 rounded-lg border-2 bg-white drop-shadow-sm flex flex-row">
              <div className="w-30 h-full">
                <Sun width={30} height={30} className="text-yellow-500" />
              </div>
              <div className="grow h-full pl-4">
                <h3 className="text-lg text-left font-semibold">
                  Let AI Do The Work
                </h3>
                <h3 className="text-md text-left">
                  Our AI generates summaries, quizzes, and a complete course
                  structure instantly.
                </h3>
              </div>
            </div>
          </Parallax>

          <Parallax speed={8}>
            <div className="w-80 h-48 p-4 rounded-lg border-2 bg-white drop-shadow-sm flex flex-row">
              <div className="w-30 h-full">
                <Pen width={30} height={30} className="text-cyan-400" />
              </div>
              <div className="grow h-full pl-4">
                <h3 className="text-lg text-left font-semibold ">
                  Start Learning Smarter
                </h3>
                <h3 className="text-md text-left">
                  Follow your custom course, test your knowledge, and track your
                  progress.
                </h3>
              </div>
            </div>
          </Parallax>
        </div>
      </div>
      <div className=" w-full pl-8 pr-8 flex flex-row text-center items-start m-auto">
        <Parallax
          speed={0}
          translateX={[0, 0]}
          style={{ width: "50%", textAlign: "left" }}
        >
          <div className="flex flex-col space-y-4 pt-8">
            <h2 className="text-2xl text-slate-900 font-semibold ">
              Take Control of your Learning
            </h2>
            <p className="w-32 h-1 bg-cyan-400"></p>
            <h5 className="text-lg text-slate-600 pb-6">
              Stop wasting time on courses that don’t meet your needs. With our
              platform, you decide what to learn, how to learn, and when to
              learn.
            </h5>
            <div className="flex flex-row items-center space-x-2">
              <CheckCircle width={24} height={24} className="text-cyan-600" />
              <span>
                Select the YouTube videos that match your goals—no more
                irrelevant content
              </span>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <CheckCircle width={24} height={24} className="text-cyan-600" />
              <span>
                Our AI transforms your chosen videos into a complete course with
                summaries and quizzes
              </span>
            </div>
            <div className="flex flex-row items-center space-x-2 pb-6">
              <CheckCircle width={24} height={24} className="text-cyan-600" />
              <span>
                Learn at your own pace, track your progress, and revisit lessons
                anytime.
              </span>
            </div>
            <Button
              variant="outline"
              className="text-lg border-2 border-cyan-500 w-64 mt-6"
              onClick={() => navigate("/create")}
            >
              Create My Course
            </Button>
          </div>
        </Parallax>

        <Parallax
          speed={0}
          scale={[1, 1]}
          className="w-1/2 flex justify-center items-center p-24"
          style={{ backgroundColor: "rgb(248,227,113)" }}
        >
          <img
            src={createPageScreen}
            alt="Small Image 2"
            style={{ width: "500px" }}
            className="drop-shadow-md"
          />
        </Parallax>
      </div>
      <div
        // style={{
        //   height: "100vh",
        //   backgroundColor: "#e0e0e0",
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "start",
        // }}
        className="w-full pb-48 pl-8 pr-8 flex flex-row text-center m-auto"
      >
        <Parallax
          speed={0}
          scale={[1, 1]}
          style={{
            width: "50%",
            textAlign: "left",
            backgroundColor: "rgb(62, 52,196)",
            padding: 72,
            display: "flex",
          }}
        >
          <div className="w-full flex justify-center items-center">
            <img
              src={exploreScreen}
              alt="Small Image 2"
              style={{ width: "500px" }}
              className="drop-shadow-lg"
            />
          </div>
        </Parallax>
        <div
          style={{ width: "50%", textAlign: "left" }}
          className="flex flex-col space-y-4 p-8"
        >
          <h2 className="text-2xl text-slate-900 font-semibold scribble-highlight">
            Explore User Generated Courses for Free
          </h2>
          <p className="w-32 h-1 bg-cyan-400"></p>
          <h5 className="text-lg text-slate-600 pb-6">
            Curious about what’s possible? Discover a library of courses created
            by other learners, all available for free.
          </h5>
          <div className="flex flex-row items-center space-x-2">
            <CheckCircle width={24} height={24} className="text-cyan-600" />
            <span>
              Browse courses across various topics—from business and technology
              to creative skills.
            </span>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <CheckCircle width={24} height={24} className="text-cyan-600" />
            <span>
              See how others have customized their learning paths and get
              inspired to create your own.
            </span>
          </div>
          <div className="flex flex-row items-center space-x-2 pb-6">
            <CheckCircle width={24} height={24} className="text-cyan-600" />
            <span>
              Start learning right away without any cost or commitment.
            </span>
          </div>
          <Button
            variant="outline"
            className="text-lg border-2 border-cyan-500 w-64"
            onClick={() => navigate("/explore")}
          >
            Explore Now
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center pb-96">
        <div className="w-[800px] text-2xl text-slate-900  font-semibold bg-white text-center">
          Get started now and take control of your learning journey.
        </div>
        <div className="w-full pt-12 flex justify-center flex-row space-x-8">
          <PricingBlock priceLevel="starter" />
          <PricingBlock priceLevel="premium" />
          <PricingBlock priceLevel="advanced" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
