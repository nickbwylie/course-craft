import React, { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SimpleWalkthrough = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const animationContainer = useRef(null);
  const [animationLoaded, setAnimationLoaded] = useState(false);

  // create course
  // https://assets1.lottiefiles.com/packages/lf20_3rwasyjy.json
  // https://assets7.lottiefiles.com/packages/lf20_w51pcehl.json

  // learn at your own pace
  // https://assets6.lottiefiles.com/packages/lf20_puciaact.json
  // https://assets1.lottiefiles.com/packages/lf20_k86wxpgr.json

  // track your progress
  // https://assets6.lottiefiles.com/packages/lf20_tutvdkg0.json

  const steps = [
    {
      title: "Create Custom Courses",
      description:
        "Just copy and paste YouTube links — we'll automatically turn them into a custom course with AI-generated quizzes and summaries.",
      animationUrl:
        "https://assets7.lottiefiles.com/packages/lf20_w51pcehl.json",
      videoUrl:
        "https://firebasestorage.googleapis.com/v0/b/resume-backend-38c74.appspot.com/o/addVideosCompressed.mp4?alt=media&token=bc60169a-067d-47c1-9f4b-ad2d5598d484",
    },
    {
      title: "Learn At Your Own Pace",
      description: "Watch videos with AI-generated summaries and quizzes.",
      animationUrl:
        "https://assets6.lottiefiles.com/packages/lf20_puciaact.json",
      videoUrl:
        "https://firebasestorage.googleapis.com/v0/b/resume-backend-38c74.appspot.com/o/customizeCourseCompressed.mp4?alt=media&token=cf3226de-38c1-4c19-91fb-964f416fcc52",
    },
    {
      title: "Build Your Personal Library",
      description:
        "Your custom courses — plus courses created by others — stay saved forever in your library.",
      animationUrl:
        "https://assets2.lottiefiles.com/packages/lf20_myejiggj.json",
      videoUrl:
        "https://firebasestorage.googleapis.com/v0/b/resume-backend-38c74.appspot.com/o/viewCourseCompressed.mp4?alt=media&token=0464760f-c4f7-470d-9eed-637038505673",
    },
  ];

  // Initialize animation for the current step
  useEffect(() => {
    let animation = null;
    setAnimationLoaded(false);

    // Make sure we have DOM element and the modal is open
    if (isOpen && animationContainer.current) {
      // Clear previous animations
      animationContainer.current.innerHTML = "";

      // Simple animation loading with error handling
      try {
        animation = lottie.loadAnimation({
          container: animationContainer.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: steps[currentStep].animationUrl,
        });

        // Listen for the DOMLoaded event to know when the animation is ready
        animation.addEventListener("DOMLoaded", () => {
          setAnimationLoaded(true);
        });

        // Add error handling
        animation.addEventListener("error", () => {
          console.error("Animation failed to load");
          setAnimationLoaded(true); // Still mark as loaded to remove loading indicator
        });
      } catch (error) {
        console.error("Animation failed to load:", error);
        setAnimationLoaded(true); // Still mark as loaded to remove loading indicator
      }
    }

    return () => {
      if (animation) {
        animation.destroy();
      }
    };
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-w-md w-full mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-700 z-10 text-slate-500 dark:text-slate-400"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Animation container with loading state */}
        <div className="w-full h-48 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center">
          {/* {!animationLoaded && (
            <div className="h-8 w-8 rounded-full border-4 border-cyan-500 border-r-transparent animate-spin"></div>
          )} */}
          <div
            ref={animationContainer}
            className={`w-full h-48 ${
              animationLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* <div className="aspect-video w-full relative">
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              src={steps[currentStep].videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div> */}
        </div>

        {/* Step content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {steps[currentStep].title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            {steps[currentStep].description}
          </p>

          {/* Step indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-cyan-500 scale-110"
                    : "w-2 bg-slate-300 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
              className="dark:border-slate-600 dark:text-slate-300 hover:bg-slate-900"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  onClose();
                  localStorage.setItem("hasSeenWalkthrough", "true");
                }
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleWalkthrough;
