// src/animations/loading.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "white";
}

// Dots loading animation
export const LoadingDots: React.FC<LoadingProps> = ({
  className = "",
  size = "md",
  color = "primary",
}) => {
  const dotSize = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  const dotColor = {
    primary: "bg-[rgb(64,126,139)] dark:bg-[rgb(74,136,149)]",
    secondary: "bg-slate-600 dark:bg-slate-400",
    accent: "bg-cyan-600 dark:bg-cyan-500",
    white: "bg-white dark:bg-white",
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className={cn("flex space-x-2 items-center justify-center", className)}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn("rounded-full", dotSize[size], dotColor[color])}
          variants={dotVariants}
          custom={index}
        />
      ))}
    </motion.div>
  );
};

// Spinner loading animation
export const LoadingSpinner: React.FC<LoadingProps> = ({
  className = "",
  size = "md",
  color = "primary",
}) => {
  const spinnerSize = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinnerColor = {
    primary: "border-[rgb(64,126,139)] dark:border-[rgb(74,136,149)]",
    secondary: "border-slate-600 dark:border-slate-400",
    accent: "border-cyan-600 dark:border-cyan-500",
    white: "border-white dark:border-white",
  };

  return (
    <motion.div
      className={cn(
        "border-4 rounded-full border-t-transparent animate-spin",
        spinnerSize[size],
        spinnerColor[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// Pulse loading animation
export const LoadingPulse: React.FC<LoadingProps> = ({
  className = "",
  size = "md",
  color = "primary",
}) => {
  const pulseSize = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const pulseColor = {
    primary: "bg-[rgb(64,126,139)] dark:bg-[rgb(74,136,149)]",
    secondary: "bg-slate-600 dark:bg-slate-400",
    accent: "bg-cyan-600 dark:bg-cyan-500",
    white: "bg-white dark:bg-white",
  };

  return (
    <motion.div
      className={cn(
        "rounded-full opacity-75",
        pulseSize[size],
        pulseColor[color],
        className
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 0.9, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Content loading skeleton with animation
export const LoadingSkeleton: React.FC<{
  className?: string;
  variant?: "line" | "circle" | "rectangle" | "card";
}> = ({ className = "", variant = "line" }) => {
  let baseClasses = "bg-slate-200 dark:bg-slate-700 relative overflow-hidden";

  // Add variant-specific classes
  switch (variant) {
    case "circle":
      baseClasses += " rounded-full w-12 h-12";
      break;
    case "rectangle":
      baseClasses += " rounded-md w-full h-24";
      break;
    case "card":
      baseClasses += " rounded-lg w-full h-40";
      break;
    case "line":
    default:
      baseClasses += " rounded-md w-full h-4";
  }

  return (
    <div className={cn(baseClasses, className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{
          x: ["calc(-100%)", "calc(100% + 100%)"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(156, 163, 175, 0.3), transparent)",
        }}
      />
    </div>
  );
};

// Page transition animation wrapper
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Skeleton loader for courses
export const SkeletonCourseCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-none dark:border dark:border-gray-700 p-0 overflow-hidden",
        className
      )}
    >
      <LoadingSkeleton
        variant="rectangle"
        className="h-40 w-full rounded-none"
      />
      <div className="p-3 space-y-2">
        <LoadingSkeleton variant="line" className="h-4 w-24" />
        <LoadingSkeleton variant="line" className="h-5 w-full" />
        <LoadingSkeleton variant="line" className="h-4 w-full" />
        <LoadingSkeleton variant="line" className="h-4 w-5/6" />
        <div className="flex justify-between pt-1">
          <LoadingSkeleton variant="line" className="h-3 w-16" />
          <LoadingSkeleton variant="line" className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
};
