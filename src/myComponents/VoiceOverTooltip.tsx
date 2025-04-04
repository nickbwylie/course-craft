import { useState, useEffect } from "react";
import { Headphones, X, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureTooltipProps {
  featureName: string;
  onClose: () => void;
}

export const FeatureTooltip = ({
  featureName,
  onClose,
}: FeatureTooltipProps) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we've shown this tooltip before
    const hasSeenTooltip = localStorage.getItem(
      `hasSeenTooltip-${featureName}`
    );

    if (!hasSeenTooltip) {
      // Add a slight delay for the tooltip to appear
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [featureName]);

  const handleClose = () => {
    setIsVisible(false);
    // Mark this tooltip as seen
    localStorage.setItem(`hasSeenTooltip-${featureName}`, "true");

    // Call the parent's onClose callback
    setTimeout(() => {
      onClose();
    }, 300); // Wait for exit animation
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={handleClose}
          />

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 
                     bg-white dark:bg-gray-800 rounded-xl border border-cyan-200 dark:border-cyan-800
                     shadow-xl max-w-sm w-full p-6"
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-full text-cyan-600 dark:text-cyan-400">
                  <Headphones className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {step === 1
                    ? "New Feature!"
                    : `Step ${step} of ${totalSteps}`}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Step content */}
            <div className="mb-6">
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-slate-700 dark:text-slate-300">
                    We've added AI-powered voiceover to enhance your learning
                    experience!
                  </p>
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded">
                    <p className="text-sm text-cyan-800 dark:text-cyan-300">
                      Our AI can read summaries aloud, making it easier to learn
                      while multitasking.
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-slate-700 dark:text-slate-300">
                    Choose from multiple voice options to personalize your
                    listening experience.
                  </p>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-700/30 p-3 rounded">
                    <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Matthew (Male)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span>Joanna (Female)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Brian (British)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span>Ivy (Female)</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <p className="text-slate-700 dark:text-slate-300">
                    Click the Play button to start listening, and the Stop
                    button when you're done.
                  </p>
                  <div className="flex justify-center p-3">
                    <div className="inline-flex gap-3 items-center">
                      <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-full text-cyan-600 dark:text-cyan-400">
                        <Volume2 className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Play Summary
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        →
                      </span>
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                        <X className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Stop Audio
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with navigation */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx + 1 === step
                        ? "bg-cyan-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {step < totalSteps ? (
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 text-sm font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 text-sm font-medium"
                  >
                    Got it!
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
