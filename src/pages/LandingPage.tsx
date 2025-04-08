import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lightbulb,
  Brain,
  Clock,
  Pen,
  Sun,
  Tv,
  Compass,
  PlayCircle,
  Search,
  Star,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { FaFeatherAlt } from "react-icons/fa";

// UI Components
import { Button } from "@/components/ui/button";
import AboutUsModal from "@/myComponents/AboutUsModal";
import { useTheme } from "@/styles/useTheme";

// Import your images
import createPageScreen from "../assets/create_course.png";
import exploreScreen from "../assets/explore_page.png";
import demoScreenshot from "../assets/view_course.png";
import createcoursedemo from "../assets/create_course_demo.mp4";
import { Helmet } from "react-helmet-async";

const BenefitItem = ({ children, icon: Icon }) => (
  <div className="flex items-start space-x-4 mb-6 group p-4 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
    <div className="bg-cyan-50 dark:bg-cyan-900/40 p-3 rounded-full transition-all duration-300 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-800">
      <Icon
        className="text-cyan-700 dark:text-cyan-400 flex-shrink-0"
        size={22}
      />
    </div>
    <div>
      <p className="text-slate-700 dark:text-slate-300">{children}</p>
    </div>
  </div>
);

const SunburstRays = () => {
  const rays = Array.from({ length: 36 });

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-2 pointer-events-none"
    >
      <div className="w-full h-full bg-gradient-to-br from-transparent via-cyan-400/10 to-transparent [mask-image:repeating-linear-gradient(135deg,black,black_2px,transparent_4px,transparent_10px)]" />
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const { isDark } = useTheme();

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
  const seoDescription =
    "Transform YouTube videos into personalized learning experiences with AI-generated summaries and quizzes. Learn what you want, when you want, how you want.";
  const seoKeywords =
    "online learning, custom courses, education platform, YouTube learning, AI education, personalized learning";
  const seoCanonicalUrl = "https://course-craft.tech";

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
          <section className="pt-48 pb-24 relative overflow-hidden">
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
                        Transform YouTube videos into personalized learning
                        experiences with AI-generated summaries and quizzes.
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
          <section className="py-24 bg-slate-50 dark:bg-gray-800/50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl mb-6">
                  <Lightbulb className="text-[#407e8b] dark:text-cyan-400 h-8 w-8" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Three simple steps to transform any YouTube video into a
                  structured learning experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Step 1 */}
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-red-200 dark:group-hover:bg-red-800/30 relative">
                      <Tv size={32} />
                      <div className="absolute -right-2 -top-2 w-8 h-8 bg-[#407e8b] dark:bg-[#325783] text-white rounded-full flex items-center justify-center font-bold text-lg">
                        1
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      Choose Your Videos
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Select YouTube videos that align with your learning goals
                      and interests. Pick content from any creator, on any
                      topic.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/30 relative">
                      <Sun size={32} />
                      <div className="absolute -right-2 -top-2 w-8 h-8 bg-[#407e8b] dark:bg-[#325783] text-white rounded-full flex items-center justify-center font-bold text-lg">
                        2
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      Let AI Do The Work
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Our AI structures your course, generates summaries, and
                      creates quizzes—so you can focus on learning, not
                      organizing.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 text-[#407e8b] dark:text-cyan-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/30 relative">
                      <Pen size={32} />
                      <div className="absolute -right-2 -top-2 w-8 h-8 bg-[#407e8b] dark:bg-[#325783] text-white rounded-full flex items-center justify-center font-bold text-lg">
                        3
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      Start Learning Smarter
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Follow your custom course, test your knowledge with
                      quizzes, track progress, and master topics at your own
                      pace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Take Control Section */}
          <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden relative">
            <SunburstRays />
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                {/* Image Section */}
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#407e8b]/20 to-[#60a5fa]/20 rounded-3xl transform rotate-6 scale-105"></div>
                    <div className="relative bg-gradient-to-r from-[#407e8b] to-[#60a5fa] p-2 md:p-4 rounded-3xl shadow-2xl">
                      <img
                        src={createPageScreen}
                        alt="Course Creation Screen"
                        className="rounded-2xl w-full"
                      />

                      {/* Decorative elements */}
                      <div className="absolute w-20 h-20 bg-yellow-400 rounded-full -top-6 -right-6 blur-2xl opacity-40"></div>
                      <div className="absolute w-32 h-32 bg-[#407e8b] rounded-full -bottom-10 -left-10 blur-2xl opacity-40"></div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <span className="inline-block py-2 px-4 text-sm font-medium bg-cyan-100 dark:bg-cyan-900/30 text-[#407e8b] dark:text-cyan-400 rounded-full mb-6">
                    Your Learning, Your Rules
                  </span>

                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                    Take Control of Your Learning Journey
                  </h2>

                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Stop wasting time on courses that don't meet your needs. Our
                    platform gives you the power to
                    <span className="font-bold italic">
                      {" "}
                      choose what, how, and when you learn.
                    </span>
                  </p>

                  <div className="space-y-4 mb-8">
                    <BenefitItem icon={Compass}>
                      <span className="font-bold">Choose videos </span>
                      that match your exact learning goals
                    </BenefitItem>

                    <BenefitItem icon={Brain}>
                      <span className="font-bold">AI-powered</span> course
                      creation with
                      <span className="font-bold">
                        {" "}
                        summaries & quizzes
                      </span>{" "}
                      for deep learning
                    </BenefitItem>

                    <BenefitItem icon={Clock}>
                      <span className="font-bold">Flexible learning</span> at
                      your own pace, with progress tracking & unlimited revisits
                    </BenefitItem>
                  </div>

                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 bg-[#407e8b] hover:bg-[#305f6b] text-white shadow-lg hover:shadow-[#407e8b]/25 transition-all"
                    onClick={() => navigate("/create")}
                  >
                    Create My Course
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Explore Section */}
          <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                {/* Content */}
                <div className="lg:col-span-6">
                  <span className="inline-block py-2 px-4 text-sm font-medium bg-cyan-100 dark:bg-cyan-900/30 text-[#407e8b] dark:text-cyan-400 rounded-full mb-6">
                    Community Learning
                  </span>

                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                    Explore User-Generated Courses for Free
                  </h2>

                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Curious about what's possible? Discover a library of courses
                    created by other learners,
                    <span className="font-bold italic">
                      {" "}
                      all available for free.
                    </span>
                  </p>

                  <div className="space-y-4 mb-8">
                    <BenefitItem icon={Search}>
                      <strong>Browse</strong> courses across various topics—from
                      business and technology to creative skills
                    </BenefitItem>

                    <BenefitItem icon={Lightbulb}>
                      <strong>Get Inspired</strong> by how others have
                      customized their learning paths and share new approaches
                    </BenefitItem>

                    <BenefitItem icon={PlayCircle}>
                      <strong>Start Learning</strong> right away—no sign-ups, no
                      fees, just pure learning
                    </BenefitItem>
                  </div>

                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 py-6 border-2 border-[#407e8b] dark:border-[#60a5fa] text-[#407e8b] dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all"
                    onClick={() => navigate("/explore")}
                  >
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* Image */}
                <div className="lg:col-span-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#407e8b]/20 to-[#60a5fa]/20 rounded-3xl transform -rotate-3 scale-105"></div>
                    <div className="relative bg-gradient-to-r from-[#407e8b] to-[#60a5fa] p-2 md:p-4 rounded-3xl shadow-2xl">
                      <img
                        src={exploreScreen}
                        alt="Explore courses"
                        className="rounded-2xl w-full"
                      />

                      {/* Course cards floating above */}
                      <div className="absolute -top-10 -right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg transform rotate-6 transition-all hover:rotate-0 w-48">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <Sparkles className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-sm font-medium">Web Development</p>
                        </div>
                        <div className="h-2 bg-green-100 dark:bg-green-900/40 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
                        </div>
                      </div>

                      <div className="absolute -bottom-8 -left-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg transform -rotate-3 transition-all hover:rotate-0 w-48">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-2">
                            <Sparkles className="h-4 w-4 text-[#407e8b] dark:text-cyan-400" />
                          </div>
                          <p className="text-sm font-medium">Digital Art</p>
                        </div>
                        <div className="h-2 bg-cyan-100 dark:bg-cyan-900/40 rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-[#407e8b] dark:bg-[#60a5fa] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-24 bg-slate-50 dark:bg-gray-800/50 relative">
            <SunburstRays />
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl mb-6">
                  <Star className="text-[#407e8b] dark:text-cyan-400 h-8 w-8" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  What Our Users Say
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Join a community of learners who have transformed their
                  education experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    quote:
                      "I created a custom AI course using YouTube videos from my favorite creators. The AI-generated quizzes helped me retain what I learned.",
                    name: "Sarah J.",
                    role: "Data Scientist",
                    color: "cyan",
                  },
                  {
                    quote:
                      "As a teacher, this platform allows me to curate video content for my students with built-in assessment tools. A game-changer for hybrid learning.",
                    name: "Mark T.",
                    role: "High School Teacher",
                    color: "cyan",
                  },
                  {
                    quote:
                      "I completed three courses in the time it would have taken me to finish one traditional course. The focused learning approach is incredibly efficient.",
                    name: "Priya M.",
                    role: "Software Developer",
                    color: "cyan",
                  },
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                      <div className="absolute top-0 left-0 right-0 h-2 bg-[#407e8b] dark:bg-[#60a5fa] rounded-t-2xl"></div>

                      <div className="flex items-center mb-6">
                        <div className="ml-4">
                          <div className="flex mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-5 w-5 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                        "{testimonial.quote}"
                      </p>

                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full mr-3 bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center">
                          <span className="text-[#407e8b] dark:text-cyan-400 font-bold">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-gradient-to-r from-[#1e2b38] to-[#1c446f] text-white">
            <div className="max-w-4xl mx-auto text-center px-6">
              <h2 className="text-3xl lg:text-5xl font-bold mb-8">
                Ready to Reimagine Your Learning Journey?
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
                        href="mailto:coursecreatortech@gmail.com"
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
