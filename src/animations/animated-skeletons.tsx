// src/components/ui/animated-skeletons.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Shimmer effect for skeletons
const shimmer = {
  animate: {
    x: ["calc(-100%)", "calc(100% + 100%)"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

interface SkeletonProps {
  className?: string;
}

/**
 * Enhanced skeleton component with shimmer animation
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "h-4 w-full rounded-md bg-slate-200 dark:bg-slate-700 overflow-hidden relative",
          className
        )}
      >
        <motion.div
          className="absolute inset-0 -translate-x-full"
          variants={shimmer}
          animate="animate"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(156, 163, 175, 0.3), transparent)",
          }}
        />
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

/**
 * Animated skeleton for course cards
 */
export const SkeletonCourseCard: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-full h-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800",
        className
      )}
    >
      {/* Thumbnail skeleton */}
      <div className="w-full relative pb-[56.25%]">
        <Skeleton className="absolute inset-0 rounded-none h-full" />
        <div className="absolute top-2 right-2 h-5 w-14 rounded-md bg-black/70 backdrop-blur-sm" />
      </div>
      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
};

/**
 * Animated skeleton for featured course sections
 */
export const SkeletonFeatureCard: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row w-full gap-8 border border-slate-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800",
        className
      )}
    >
      {/* Thumbnail skeleton */}
      <div className="min-w-60 sm:min-w-72 h-40 sm:h-48">
        <Skeleton className="w-full h-full rounded-md" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col items-start w-full mt-4 sm:mt-0 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-7 w-4/5" />

        {/* Date skeleton */}
        <Skeleton className="h-4 w-40" />

        {/* Description skeleton - multiple lines */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Button skeleton */}
        <Skeleton className="h-10 w-32 mt-4" />
      </div>
    </div>
  );
};

/**
 * Animated skeleton for video player
 */
export const SkeletonVideoPlayer: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="aspect-video bg-slate-800 dark:bg-slate-700 rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex justify-between mt-2">
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
};

/**
 * Animated skeleton for summary content
 */
export const SkeletonSummary: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
};

/**
 * Animated skeleton for quiz
 */
export const SkeletonQuiz: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("space-y-4 border rounded-lg p-4", className)}>
      <Skeleton className="h-8 w-full" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
};

/**
 * Animated skeleton list item for course list
 */
export const SkeletonCourseListItem: React.FC<SkeletonProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "p-3 flex items-start gap-3 border-b border-slate-200 dark:border-slate-700",
        className
      )}
    >
      <Skeleton className="h-12 w-16 flex-shrink-0 rounded-md" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
    </div>
  );
};

/**
 * Grid of course card skeletons
 */
export const SkeletonCourseGrid: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 6, className }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCourseCard key={i} />
      ))}
    </div>
  );
};

/**
 * Animated skeleton for profile
 */
export const SkeletonProfile: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
};
