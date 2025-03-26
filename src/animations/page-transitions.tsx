// src/animations/page-transitions.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

// Page transition types
export type TransitionType =
  | "fade"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "scale"
  | "none";

// Basic transition variants
const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

// Transition duration and ease settings
const transitionSettings = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1], // Cubic bezier curve
};

// Route-specific transition mapping
const routeTransitions: Record<string, TransitionType> = {
  "/": "fade",
  "/explore": "slide-left",
  "/create": "slide-up",
  "/course": "slide-left",
  "/dashboard": "slide-right",
  "/library": "slide-up",
};

// Get transition type based on route
const getTransitionType = (path: string): TransitionType => {
  // Check for exact path match
  if (routeTransitions[path]) {
    return routeTransitions[path];
  }

  // Check for path prefix match (like /course/123)
  for (const route in routeTransitions) {
    if (path.startsWith(route) && route !== "/") {
      return routeTransitions[route];
    }
  }

  // Default to fade
  return "fade";
};

/**
 * AnimatedLayout component that wraps around your Routes
 * It animates page transitions between route changes
 */
export const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ children }) => {
  const location = useLocation();
  const transitionType = getTransitionType(location.pathname);
  const variants = transitionVariants[transitionType];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transitionSettings}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * PageTransition component
 * Wrap specific pages with this component to apply a specific transition
 */
export const PageTransition: React.FC<{
  children: React.ReactNode;
  type?: TransitionType;
}> = ({ children, type = "fade" }) => {
  const variants = transitionVariants[type];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transitionSettings}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
