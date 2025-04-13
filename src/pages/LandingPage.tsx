import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Pen, Sun, Tv, X, Play, Expand, Pause } from "lucide-react";
import { FaFeatherAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import AboutUsModal from "@/myComponents/AboutUsModal";
import createPageScreen from "../assets/create_course.png";
import demoScreenshot from "../assets/view_course.png";
import ai_course_poster from "../assets/ai_course_screenshot.png";
import { Helmet } from "react-helmet-async";
import ViewCourseScreenshot from "../assets/view_course_clean.png";

interface StepProps {
  step: number;
  icon: JSX.Element;
  title: string;
  description: string;
  details: string[];
  videoRef: HTMLVideoElement | null;
  videoSrc: string;
  poster: string;
  playing: boolean;
  onPlay: () => void;
  onVideoEnded: () => void;
  gradientClasses: {
    bg: string;
    text: string;
    bgLight: string;
    transform: string;
    stepBadge: string;
    hoverBg: string;
  };
  layout?: "left" | "right";
  buttonAction?: () => void;
  onPauseVideo: () => void;
}

const videos = {
  step1: {
    title: "Choose Your Videos",
    src: "https://firebasestorage.googleapis.com/v0/b/resume-backend-38c74.appspot.com/o/addVideosCompressed.mp4?alt=media&token=bc60169a-067d-47c1-9f4b-ad2d5598d484",
    description:
      "Choose from millions of educational videos across all subjects and skill levels.",
  },
  step2: {
    title: "AI Creates Your Course",
    src: "https://firebasestorage.googleapis.com/v0/b/resume-backend-38c74.appspot.com/o/customizeCourseCompressed.mp4?alt=media&token=cf3226de-38c1-4c19-91fb-964f416fcc52",
    description:
      "Our AI processes content to create structured learning materials for you.",
  },
  step3: {
    title: "Learn Your Way",
    src: "https://firebasestorage.googleapis.com/v0/b/resume-backend-38c74.appspot.com/o/viewCourseCompressed.mp4?alt=media&token=0464760f-c4f7-470d-9eed-637038505673",
    description:
      "Learn at your own pace with interactive elements to reinforce your knowledge.",
  },
} as const;

export const SunburstRays = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-2 pointer-events-none"
    >
      <div className="w-full h-full bg-gradient-to-br from-transparent via-cyan-400/10 to-transparent [mask-image:repeating-linear-gradient(135deg,black,black_2px,transparent_4px,transparent_10px)]" />
    </div>
  );
};

export const DecorativeBackground = () => (
  <div className="absolute inset-0 opacity-5 pointer-events-none">
    <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-cyan-500 blur-[100px]" />
    <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-indigo-500 blur-[120px]" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-fuchsia-500 blur-[150px] opacity-20" />
  </div>
);

const stepStyles = [
  {
    gradientClasses: {
      bg: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      text: "text-red-600 dark:text-red-400",
      bgLight: "bg-red-100 dark:bg-red-900/30",
      transform: "-rotate-3",
      stepBadge: "bg-red-500",
      hoverBg:
        "bg-gradient-to-br from-red-300 to-amber-300 dark:from-red-700 dark:to-amber-700 rotate-2",
    },
    icon: <Tv size={30} />,
  },
  {
    gradientClasses: {
      bg: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
      text: "text-amber-600 dark:text-amber-400",
      bgLight: "bg-amber-100 dark:bg-amber-900/30",
      transform: "rotate-2",
      stepBadge: "bg-amber-500",
      hoverBg:
        "bg-gradient-to-br from-amber-300 to-lime-300 dark:from-amber-700 dark:to-lime-700 -rotate-2",
    },
    icon: <Sun size={30} />,
  },
  {
    gradientClasses: {
      bg: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20",
      text: "text-cyan-600 dark:text-cyan-400",
      bgLight: "bg-cyan-100 dark:bg-cyan-900/30",
      transform: "-rotate-1",
      stepBadge: "bg-cyan-500",
      hoverBg:
        "bg-gradient-to-br from-cyan-300 to-blue-300 dark:from-cyan-700 dark:to-blue-700 rotate-1",
    },
    icon: <Pen size={30} />,
  },
];

const Step = ({
  step,
  icon,
  title,
  description,
  details,
  videoRef,
  videoSrc,
  poster,
  playing,
  onPlay,
  onVideoEnded,
  gradientClasses,
  layout = "left", // "left" or "right"
  buttonAction,
  onPauseVideo,
}: StepProps) => {
  const isContentLeft = layout === "left";
  const containerFlex = isContentLeft ? "lg:flex-row" : "lg:flex-row-reverse";

  return (
    <div
      className={`flex flex-col ${containerFlex} items-center mb-48 relative`}
    >
      {/* Connection line (improved with clearer positioning) */}
      <div
        className={`absolute left-1/2 ${
          isContentLeft ? "lg:right-0" : "lg:left-0"
        } top-full lg:top-1/2 w-px lg:w-32 h-20 lg:h-px border-dashed border-cyan-300 dark:border-cyan-700 lg:transform lg:-translate-y-1/2`}
      />
      {/* Text content */}
      <div
        className={`w-full lg:w-5/12 ${
          isContentLeft ? "lg:pr-12" : "lg:pl-12"
        } relative z-10 mb-10 lg:mb-0`}
      >
        <div className="relative">
          <div
            className={`bg-gradient-to-br ${gradientClasses.bg} ${gradientClasses.text} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform ${gradientClasses.transform}`}
          >
            {icon}
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
            {description}
          </p>
          <div className="space-y-3">
            {details.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${gradientClasses.bgLight} mr-3 mt-0.5 flex-shrink-0`}
                >
                  <span className={`text-sm font-bold ${gradientClasses.text}`}>
                    {index + 1}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Video content */}
      <div className={`w-full lg:w-7/12 relative z-10`}>
        <div className="relative group">
          <div
            className={`absolute ${
              isContentLeft ? "-right-6" : "-left-6"
            } -bottom-6 w-full h-full ${
              gradientClasses.hoverBg
            } rounded-2xl transform opacity-30 group-hover:rotate-0 transition-transform duration-300`}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="aspect-video rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loop={false} // for example, step 1 plays once
                muted
                playsInline
                src={videoSrc}
                preload="none"
                poster={poster}
                onEnded={onVideoEnded}
              >
                Your browser does not support the video tag.
              </video>
              {!playing && (
                <div
                  className="absolute inset-0 flex items-center justify-center  transition-opacity duration-300"
                  aria-label="Play video"
                >
                  <button
                    onClick={onPlay}
                    aria-label="Play"
                    className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-transform duration-300 transform hover:scale-110"
                  >
                    <Play className="h-12 w-12 text-white drop-shadow-lg" />
                  </button>
                </div>
              )}
              {playing && (
                <div
                  className="absolute hidden group-hover:flex inset-0 items-center justify-center transition-opacity duration-300"
                  aria-label="Playing"
                >
                  <button
                    onClick={onPauseVideo}
                    aria-label="Pause"
                    className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-transform duration-300 transform hover:scale-110"
                  >
                    <Pause className="h-12 w-12 text-white drop-shadow-lg" />
                  </button>
                </div>
              )}
              <div className="absolute w-full bottom-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full">
                  <p className="text-white text-sm mb-3 max-w-md">
                    {/* {buttonLabel && "Learn more about this step"} */}
                    Full screen
                  </p>
                  {buttonAction && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 text-slate-900 hover:bg-white border-none"
                      onClick={buttonAction}
                    >
                      <Expand className="bg-white/90 text-slate-900 hover:bg-white border-none" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`absolute ${
                isContentLeft ? "top-3 left-5" : "top-3 right-5"
              } ${
                gradientClasses.stepBadge
              } text-white text-xs font-bold px-2 py-1 rounded-full`}
            >
              Step {step}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoModal = ({
  activeVideo,
  onClose,
}: {
  activeVideo: keyof typeof videos | null;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {activeVideo && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden z-10"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {videos[activeVideo]?.title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="aspect-video w-full relative">
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              src={videos[activeVideo]?.src}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {videos[activeVideo]?.description}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  // For the floating elements in the hero section
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const seoTitle =
    "CourseCraft - Create Custom Courses from YouTube in Seconds";
  const seoDescription = "Change the way you watch YouTube videos forever";
  const seoKeywords =
    "online learning, custom courses, education platform, YouTube learning, AI education, personalized learning";
  const seoCanonicalUrl = "https://course-craft.tech";
  const [activeVideo, setActiveVideo] = useState<
    "step1" | "step2" | "step3" | null
  >(null);

  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const video3Ref = useRef<HTMLVideoElement | null>(null);
  const [playingVideos, setPlayingVideos] = useState({
    step1: false,
    step2: false,
    step3: false,
  });

  const playVideo = (step: keyof typeof videos) => {
    if (step === "step1") {
      video1Ref?.current?.play();
    } else if (step == "step2") {
      video2Ref?.current?.play();
    } else {
      video3Ref?.current?.play();
    }
    // Implementation for playing the video using refs
    setPlayingVideos((prev) => ({ ...prev, [step]: true }));
  };

  const pauseVideo = (step: keyof typeof videos) => {
    console.log("pausing video for step:", step);
    if (step === "step1") {
      video1Ref?.current?.pause();
    } else if (step == "step2") {
      video2Ref?.current?.pause();
    } else {
      video3Ref?.current?.pause();
    }
    setPlayingVideos((prev) => ({ ...prev, [step]: false }));
  };

  const handleVideoEnded = (step: keyof typeof videos) => {
    setPlayingVideos((prev) => ({ ...prev, [step]: false }));
  };

  const handleCloseModal = () => setActiveVideo(null);

  // Predefined styles for each step for consist

  useEffect(() => {
    if (activeVideo) {
      video1Ref.current?.pause();
      video2Ref.current?.pause();
      video3Ref.current?.pause();
      setPlayingVideos((prev) => ({
        ...prev,
        step1: false,
        step2: false,
        step3: false,
      }));
    }
  }, [activeVideo]);

  return (
    <div className="mobile-layout">
      <div className="mobile-content">
        <div className="min-h-screen bg-white dark:bg-gray-900 text-slate-900 dark:text-white overflow-x-hidden ">
          <Helmet>
            {/* Primary Meta Tags */}
            <title>{seoTitle}</title>
            <meta name="title" content={seoTitle} />
            <meta name="description" content={seoDescription} />
            <meta name="keywords" content={seoKeywords} />
            <meta name="author" content="Nick Wylie" />
            <link rel="canonical" href={seoCanonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={seoCanonicalUrl} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta
              property="og:image"
              content={`${seoCanonicalUrl}/og-image.jpg`}
            />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={seoCanonicalUrl} />
            <meta property="twitter:title" content={seoTitle} />
            <meta property="twitter:description" content={seoDescription} />

            {/* Schema.org structured data */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "CourseCraft",
                url: seoCanonicalUrl,
                description: seoDescription,
                applicationCategory: "EducationApplication",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                author: {
                  "@type": "Person",
                  name: "Nick Wylie",
                },
              })}
            </script>
          </Helmet>
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 ">
                  <FaFeatherAlt className="h-6 w-6 text-[#407e8b] dark:text-primary" />
                  <span className="font-bold text-md sm:text-xl">
                    CourseCraft
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-4 ">
                  <Button
                    variant="ghost"
                    className="hover:bg-slate-100 p-2 dark:hover:bg-slate-800 text-xs sm:text-sm"
                    onClick={() => navigate("/explore")}
                  >
                    Explore
                  </Button>
                  <Button
                    variant="ghost"
                    className="hover:bg-slate-100 dark:hover:bg-slate-800  text-xs sm:text-sm p-2"
                    onClick={() => setIsAboutModalOpen(true)}
                  >
                    About
                  </Button>
                  <Button
                    className="bg-primary hover:bg-[#305f6b] text-white dark:bg-primary/70 dark:hover:bg-primary/50  text-xs p-2 sm:text-sm"
                    onClick={() => navigate("/create")}
                  >
                    Create Course
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="pt-48 pb-48 relative overflow-hidden">
            {/* Decorative elements that respond to mouse movement */}
            <SunburstRays />
            <div
              className="absolute top-40 left-20 w-64 h-64 rounded-full bg-cyan-400/10 dark:bg-cyan-600/10 blur-3xl"
              style={{
                transform: `translate(${mousePosition.x * 20}px, ${
                  mousePosition.y * 20
                }px)`,
              }}
            ></div>
            <div
              className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-slate-400/10 dark:bg-slate-600/10 blur-3xl"
              style={{
                transform: `translate(-${mousePosition.x * 20}px, -${
                  mousePosition.y * 20
                }px)`,
              }}
            ></div>

            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 gap-16 items-center">
                <div className="flex justify-center text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h1 className="text-3xl lg:text-4xl font-extrabold mb-2 leading-tight">
                      Create{" "}
                      <span className="bg-gradient-to-r from-[#407e8b] to-[#60a5fa] bg-clip-text text-transparent">
                        Custom Courses
                      </span>{" "}
                      from YouTube in Seconds
                    </h1>

                    <div className="w-full flex justify-center">
                      <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed w-5/6">
                        Change the way you watch YouTube videos forever.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="outline"
                        className="text-sm px-6 py-4 rounded-lg border-2 border-[#73aff7] hover:border-[#a0cbff] hover:bg-transparent  shadow-lg hover:shadow-[#407e8b]/25 transition-all hover:border:animate-pulse"
                        onClick={() => navigate("/create")}
                      >
                        Start Creating
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="text-sm px-6 py-4 rounded-lg border-2 hover:bg-slate-50 border-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 hover:border-[#407e8b] dark:hover:border-[#60a5fa]  transition-all"
                        onClick={() => navigate("/explore")}
                      >
                        Explore Courses
                      </Button>
                    </div>
                    <div className="flex w-full justify-center mt-12">
                      <div className="bg-gradient-to-r from-[#407e8b] to-[#60a5fa] p-2 rounded-2xl shadow-2xl transform rotate-1 transition-all hover:rotate-0 duration-300 max-w-3xl">
                        <img
                          src={demoScreenshot}
                          alt="Course Creation Interface"
                          className="rounded-xl shadow-lg"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative overflow-hidden pt-48 pb-28">
            <SunburstRays />
            {/* Decorative gradient blobs */}
            <DecorativeBackground />
            <div className="relative z-10 mx-auto max-w-7xl px-6">
              {/* Header Section */}
              <div className="text-center mb-20">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  How it works
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Transform any YouTube video into an interactive course.
                </p>
              </div>

              {/* Steps */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.4, delay: 0 },
                }}
                viewport={{ once: true, amount: "some" }}
              >
                <Step
                  step={1}
                  icon={stepStyles[0].icon}
                  title="Choose Your Videos"
                  description="Select any YouTube videos that match your learning goals. Our platform works with any topic, from coding to cooking."
                  details={[
                    "Find videos from your favorite YouTube educators",
                    "Simply paste the URLs into our course builder",
                    "Organize videos in your preferred learning sequence",
                  ]}
                  videoRef={video1Ref}
                  videoSrc={videos["step1"].src}
                  poster={createPageScreen}
                  playing={playingVideos.step1}
                  onPlay={() => playVideo("step1")}
                  onVideoEnded={() => handleVideoEnded("step1")}
                  gradientClasses={stepStyles[0].gradientClasses}
                  layout="left"
                  buttonLabel="See how it works"
                  buttonAction={() => setActiveVideo("step1")}
                  onPauseVideo={() => pauseVideo("step1")}
                />
              </motion.div>

              {/* Steps */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.4, delay: 0 },
                }}
                viewport={{ once: true, amount: "some" }}
              >
                <Step
                  step={2}
                  icon={stepStyles[1].icon}
                  title="AI Creates Your Course"
                  description="Our AI analyzes videos, generates concise summaries of key points, and creates targeted quizzes to test your understanding."
                  details={[
                    "AI extracts key concepts from video content",
                    "Creates structured summaries optimized for retention",
                    "Generates relevant quizzes to test your knowledge",
                  ]}
                  videoRef={video2Ref}
                  videoSrc={videos["step2"].src}
                  poster={ai_course_poster}
                  playing={playingVideos.step2}
                  onPlay={() => playVideo("step2")}
                  onVideoEnded={() => handleVideoEnded("step2")}
                  gradientClasses={stepStyles[1].gradientClasses}
                  layout="right"
                  buttonLabel="See the magic happen"
                  buttonAction={() => setActiveVideo("step2")}
                  onPauseVideo={() => pauseVideo("step2")}
                />
              </motion.div>

              {/* Steps */}

              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.4, delay: 0.1 },
                }}
                viewport={{ once: true, amount: "some" }}
              >
                <Step
                  step={3}
                  icon={stepStyles[2].icon}
                  title="Study Your Course"
                  description="Experience a structured learning path with video content, AI-generated summaries, and interactive quizzes."
                  details={[
                    "Watch videos at your own pace",
                    "Review AI summaries to reinforce key concepts",
                    "Test your knowledge with interactive quizzes",
                  ]}
                  videoRef={video3Ref}
                  videoSrc={videos["step3"].src}
                  poster={ViewCourseScreenshot}
                  playing={playingVideos.step3}
                  onPlay={() => playVideo("step3")}
                  onVideoEnded={() => handleVideoEnded("step3")}
                  gradientClasses={stepStyles[2].gradientClasses}
                  layout="left"
                  buttonLabel="See the learning experience"
                  buttonAction={() => setActiveVideo("step3")}
                  onPauseVideo={() => pauseVideo("step3")}
                />
              </motion.div>
            </div>

            {/* Video Modal */}
            <VideoModal activeVideo={activeVideo} onClose={handleCloseModal} />
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-gradient-to-r from-[#1e2b38] to-[#1c446f] text-white">
            <div className="max-w-4xl mx-auto text-center px-6">
              <h2 className="text-3xl lg:text-5xl font-bold mb-8">
                Ready to Get Started
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full bg-white text-[#407e8b] hover:bg-slate-100 shadow-xl transition-all"
                  onClick={() => navigate("/create")}
                >
                  Create Your First Course
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full border-2 border-white/70 hover:bg-white/10 transition-all"
                  onClick={() => navigate("/explore")}
                >
                  Explore Courses
                </Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-slate-900 text-white py-12 relative">
            <SunburstRays />
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center mb-6">
                    <FaFeatherAlt className="h-8 w-8 text-cyan-400 mr-2" />
                    <h3 className="text-2xl font-bold">CourseCraft</h3>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-md">
                    Transform YouTube videos into personalized learning
                    experiences with AI-generated summaries and quizzes.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4">Product</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <a
                        href="/explore"
                        className="hover:text-white transition-colors"
                      >
                        Explore
                      </a>
                    </li>
                    <li>
                      <a
                        href="/create"
                        className="hover:text-white transition-colors"
                      >
                        Create Course
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4">Company</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <button
                        onClick={() => setIsAboutModalOpen(true)}
                        className="hover:text-white transition-colors text-left"
                      >
                        About Us
                      </button>
                    </li>
                    <li>
                      <a
                        href="mailto:coursecrafttech@gmail.com"
                        className="hover:text-white transition-colors"
                      >
                        Contact
                      </a>
                    </li>
                    <li>
                      <a
                        href="/privacy"
                        className="hover:text-white transition-colors"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="/terms"
                        className="hover:text-white transition-colors"
                      >
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-slate-400 mb-4 md:mb-0">
                  © {new Date().getFullYear()} CourseCraft. All rights reserved.
                </p>
                <p className="text-slate-400">
                  Created by{" "}
                  <a
                    href="https://www.linkedin.com/in/nick-wylie-developer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Nick Wylie
                  </a>
                </p>
              </div>
            </div>
          </footer>

          <AboutUsModal
            isOpen={isAboutModalOpen}
            onClose={() => setIsAboutModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
