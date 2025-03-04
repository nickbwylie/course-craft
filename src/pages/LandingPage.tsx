import React, { useEffect, useRef } from "react";
import { Parallax, useParallax } from "react-scroll-parallax";
import { motion, useInView, useAnimation } from "framer-motion";
import { useNavigate } from "react-router";
import {
  CheckCircle,
  Pen,
  Quote,
  Sun,
  Tv,
  ArrowRight,
  MousePointer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import images
import image1 from "../assets/youtubePreview.jpg";
import image2 from "../assets/youtubePreview2.jpg";
import image3 from "../assets/youtubePreview3.jpg";
import createPageScreen from "../assets/createCoursePage.png";
import exploreScreen from "../assets/explorePageScreen.png";
import PricingBlock from "@/myComponents/PricingBlock";

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
const FeatureCard = ({ icon: Icon, title, description, delay, gradient }) => (
  <FadeInWhenVisible delay={delay}>
    <Card className="w-full h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className={`h-2 w-full ${gradient}`}></div>
      <CardHeader>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100">
          <Icon className="text-primary" size={24} />
        </div>
        <CardTitle className="text-xl mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  </FadeInWhenVisible>
);

// Benefit item component
const BenefitItem = ({ children }) => (
  <div className="flex items-start space-x-3 mb-6">
    <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
    <p className="text-slate-700">{children}</p>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <Parallax
            speed={-5}
            className="absolute top-[15%] left-[8%] rotate-[-8deg]"
          >
            <motion.img
              src={image1}
              alt="YouTube Preview"
              className="w-48 md:w-64 rounded-lg shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </Parallax>
          <Parallax
            speed={15}
            className="absolute top-[25%] right-[12%] rotate-[5deg]"
          >
            <motion.img
              src={image3}
              alt="YouTube Preview"
              className="w-56 md:w-72 rounded-lg shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </Parallax>
          <Parallax
            speed={8}
            className="absolute bottom-[20%] left-[15%] rotate-[10deg]"
          >
            <motion.img
              src={image2}
              alt="YouTube Preview"
              className="w-64 md:w-80 rounded-lg shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            />
          </Parallax>
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block py-1 px-3 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
              Learning Reimagined
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Create Custom Courses from YouTube in Seconds
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
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
              className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/40 transition-all"
              onClick={() => navigate("/create")}
            >
              Create a Course
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-full border-2 border-slate-300 hover:border-primary/70 hover:bg-primary/5 transition-all"
              onClick={() => navigate("/explore")}
            >
              Explore Courses
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <MousePointer className="h-6 w-6 text-slate-400 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 text-sm font-medium bg-violet-100 text-violet-800 rounded-full mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <FadeInWhenVisible className="order-2 lg:order-1">
              <span className="inline-block py-1 px-3 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
                Your Learning, Your Rules
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Take Control of Your Learning Journey
              </h2>
              <div className="w-24 h-1 bg-primary mb-6"></div>
              <p className="text-lg text-slate-600 mb-8">
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
                className="mt-8 rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white"
                onClick={() => navigate("/create")}
              >
                Create My Course
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </FadeInWhenVisible>

            <div className="order-1 lg:order-2">
              <FadeInWhenVisible>
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 p-10 rounded-3xl shadow-xl">
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
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <FadeInWhenVisible>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-10 rounded-3xl shadow-xl">
                  <img
                    src={exploreScreen}
                    alt="Explore Screen"
                    className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </FadeInWhenVisible>
            </div>

            <FadeInWhenVisible>
              <span className="inline-block py-1 px-3 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full mb-4">
                Community Learning
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Explore User-Generated Courses for Free
              </h2>
              <div className="w-24 h-1 bg-primary mb-6"></div>
              <p className="text-lg text-slate-600 mb-8">
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
                className="mt-8 rounded-full px-8 py-6 border-2 border-indigo-400 text-indigo-700 hover:bg-indigo-50"
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
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 text-sm font-medium bg-green-100 text-green-800 rounded-full mb-4">
                Success Stories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Users Say
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
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
                <Card className="h-full border-none shadow-lg bg-white">
                  <CardHeader className="pb-0">
                    <Quote className="text-primary/30 h-12 w-12" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="italic text-slate-700">{testimonial.quote}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">
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

      {/* Pricing Section
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
                Pricing Plans
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Started Now and Transform Your Learning
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Choose the plan that fits your learning needs. All plans include
                our core features.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInWhenVisible delay={0.2}>
              <PricingBlock priceLevel="starter" />
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <PricingBlock priceLevel="premium" />
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.6}>
              <PricingBlock priceLevel="advanced" />
            </FadeInWhenVisible>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Create your first custom course today and discover a new way to
              learn.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-10 py-6 rounded-full bg-white text-primary hover:bg-white/90 shadow-lg"
              onClick={() => navigate("/create")}
            >
              Get Started For Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CourseCreator</h3>
              <p className="text-slate-400">
                Transform YouTube videos into personalized learning experiences.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>
              © {new Date().getFullYear()} CourseCreator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
