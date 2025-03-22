import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useNavigate } from "react-router";
import {
  CheckCircle,
  Pen,
  Quote,
  Sun,
  Tv,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Helmet } from "react-helmet";

import createPageScreen from "../assets/createCoursePage.png";
import exploreScreen from "../assets/explorePageTest.png";
import AboutUsModal from "@/myComponents/AboutUsModal";
import { useTheme } from "@/styles/useTheme";

// Reusable animation component
const FadeInWhenVisible = ({ children, delay = 0, className = "" }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, delay, gradient }) => {
  const { isDark } = useTheme();

  return (
    <FadeInWhenVisible delay={delay}>
      <Card className="w-full h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:shadow-gray-900/30">
        <div className={`h-2 w-full ${gradient}`}></div>
        <CardHeader>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-700">
            <Icon className="text-black dark:text-white" size={24} />
          </div>
          <CardTitle className="text-xl mt-4 text-black dark:text-white">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-300">{description}</p>
        </CardContent>
      </Card>
    </FadeInWhenVisible>
  );
};

// Benefit item component
const BenefitItem = ({ children }) => (
  <div className="flex items-start space-x-3 mb-6">
    <CheckCircle
      className="text-slate-700 dark:text-slate-300 mt-1 flex-shrink-0"
      size={20}
    />
    <p className="text-slate-700 dark:text-slate-300">{children}</p>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      <Helmet>
        <title>CourseCraft - Create Custom Courses from YouTube Videos</title>
        <meta
          name="description"
          content="Transform YouTube videos into personalized learning experiences with AI-generated summaries and quizzes. Learn smarter with CourseCraft."
        />
        <meta
          name="keywords"
          content="online learning, YouTube courses, AI education, custom courses, educational platform"
        />
        <meta
          property="og:title"
          content="CourseCraft - Create Custom Courses from YouTube"
        />
        <meta
          property="og:description"
          content="Transform educational content into personalized learning experiences with AI-generated summaries and quizzes."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://course-craft.tech" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="CourseCraft - Create Custom Courses from YouTube"
        />
        <meta
          name="twitter:description"
          content="Transform YouTube videos into interactive learning experiences."
        />
      </Helmet>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden transition-colors duration-300">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden"></div>

        {/* Hero content */}
        <div className="relative z-10 px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block py-1 px-3 text-sm font-medium bg-slate-900/10 dark:bg-white/10 text-black dark:text-white rounded-full mb-4 transition-colors duration-300">
              Learning Reimagined
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-500 to-blue-600 dark:from-slate-400 dark:to-blue-500 bg-clip-text text-transparent">
              Create Custom Courses from YouTube in Seconds
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 transition-colors duration-300">
              Transform educational content into personalized learning
              experiences. Learn what you want, when you want, how you want.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full bg-gray-900 hover:bg-black text-white dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg hover:shadow-primary/40 dark:hover:shadow-blue-600/30 transition-all"
              onClick={() => navigate("/create")}
            >
              Create a Course
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg text-black dark:text-white px-8 py-6 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-primary/70 dark:hover:border-blue-600/70 hover:bg-gray-300/5 dark:hover:bg-white/5 transition-all"
              onClick={() => navigate("/explore")}
            >
              Explore Courses
            </Button>
          </motion.div>
        </div>
      </section>
      {/* How it Works Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 text-sm font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-full mb-4 transition-colors duration-300">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white transition-colors duration-300">
                How It Works
              </h2>
              <div className="w-24 h-1 bg-primary dark:bg-blue-600 mx-auto transition-colors duration-300"></div>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Tv}
              title="Choose Your Videos"
              description="Select YouTube videos that align with your learning goals and interests. Pick content from any creator, on any topic."
              delay={0.2}
              gradient="bg-gradient-to-r from-red-400 to-red-500"
            />
            <FeatureCard
              icon={Sun}
              title="Let AI Do The Work"
              description="Our powerful AI analyzes the content, generates comprehensive summaries, creates quizzes, and structures your personalized course."
              delay={0.4}
              gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
            />
            <FeatureCard
              icon={Pen}
              title="Start Learning Smarter"
              description="Follow your custom course, test your knowledge with quizzes, track your progress, and learn at your own pace."
              delay={0.6}
              gradient="bg-gradient-to-r from-cyan-400 to-blue-500"
            />
          </div>
        </div>
      </section>
      {/* Take Control Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <FadeInWhenVisible className="order-2 lg:order-1">
              <span className="inline-block py-1 px-3 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full mb-4 transition-colors duration-300">
                Your Learning, Your Rules
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white transition-colors duration-300">
                Take Control of Your Learning Journey
              </h2>
              <div className="w-24 h-1 bg-primary dark:bg-blue-600 mb-6 transition-colors duration-300"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 transition-colors duration-300">
                Stop wasting time on courses that don't meet your needs. Our
                platform puts you in charge of what, how, and when you learn.
              </p>

              <BenefitItem>
                Select YouTube videos that match your specific goals—no more
                irrelevant content
              </BenefitItem>
              <BenefitItem>
                Our AI transforms your chosen videos into a complete course with
                summaries and quizzes
              </BenefitItem>
              <BenefitItem>
                Learn at your own pace, track your progress, and revisit lessons
                anytime
              </BenefitItem>

              <Button
                size="lg"
                className="mt-8 rounded-full px-8 py-6 bg-primary dark:bg-blue-600 hover:bg-primary/90 dark:hover:bg-blue-700 text-white transition-colors duration-300"
                onClick={() => navigate("/create")}
              >
                Create My Course
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </FadeInWhenVisible>

            <div className="order-1 lg:order-2">
              <FadeInWhenVisible>
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-yellow-900/30 dark:to-yellow-700/30 p-10 rounded-3xl shadow-xl transition-colors duration-300">
                  <img
                    src={createPageScreen}
                    alt="Course Creation Screen"
                    className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </section>
      {/* Explore Section */}
      <section className="py-20 bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <FadeInWhenVisible>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-purple-900 p-10 rounded-3xl shadow-xl transition-colors duration-300">
                  <img
                    src={exploreScreen}
                    alt="Explore Screen"
                    className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </FadeInWhenVisible>
            </div>

            <FadeInWhenVisible>
              <span className="inline-block py-1 px-3 text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full mb-4 transition-colors duration-300">
                Community Learning
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white transition-colors duration-300">
                Explore User-Generated Courses for Free
              </h2>
              <div className="w-24 h-1 bg-primary dark:bg-blue-600 mb-6 transition-colors duration-300"></div>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 transition-colors duration-300">
                Curious about what's possible? Discover a library of courses
                created by other learners, all available for free.
              </p>

              <BenefitItem>
                Browse courses across various topics—from business and
                technology to creative skills
              </BenefitItem>
              <BenefitItem>
                See how others have customized their learning paths and get
                inspired
              </BenefitItem>
              <BenefitItem>
                Start learning right away without any cost or commitment
              </BenefitItem>

              <Button
                variant="outline"
                size="lg"
                className="mt-8 rounded-full px-8 py-6 border-2 border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-300"
                onClick={() => navigate("/explore")}
              >
                Explore Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full mb-4 transition-colors duration-300">
                Success Stories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white transition-colors duration-300">
                What Our Users Say
              </h2>
              <div className="w-24 h-1 bg-primary dark:bg-blue-600 mx-auto transition-colors duration-300"></div>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "I created a custom AI course using YouTube videos from my favorite creators. The AI-generated quizzes helped me retain what I learned.",
                name: "Sarah J.",
                role: "Data Scientist",
              },
              {
                quote:
                  "As a teacher, this platform allows me to curate video content for my students with built-in assessment tools. A game-changer for hybrid learning.",
                name: "Mark T.",
                role: "High School Teacher",
              },
              {
                quote:
                  "I completed three courses in the time it would have taken me to finish one traditional course. The focused learning approach is incredibly efficient.",
                name: "Priya M.",
                role: "Software Developer",
              },
            ].map((testimonial, index) => (
              <FadeInWhenVisible key={index} delay={0.2 * index}>
                <Card className="h-full border-none shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
                  <CardHeader className="pb-0">
                    <Quote className="text-black/30 dark:text-white/30 h-12 w-12 transition-colors duration-300" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="italic text-slate-700 dark:text-slate-300 transition-colors duration-300">
                      {testimonial.quote}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t dark:border-gray-700 pt-4 transition-colors duration-300">
                    <div>
                      <p className="font-medium text-black dark:text-white transition-colors duration-300">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-400 mr-2" />
                <h3 className="text-xl font-bold">CourseCraft</h3>
              </div>
              <p className="text-slate-400 max-w-xs">
                Transform YouTube videos into personalized learning experiences
                with AI-generated summaries and quizzes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div>
                <h4 className="font-medium mb-4">Company</h4>
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
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-400">
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
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>
              © {new Date().getFullYear()} CourseCraft. All rights reserved.
            </p>
            <p className="text-sm">
              Created by{" "}
              <a
                href="https://www.linkedin.com/in/nick-wylie-developer/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
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
  );
};

export default LandingPage;
