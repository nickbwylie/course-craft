// src/animations/components.tsx
import React from "react";
import { motion, MotionProps, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Common animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export const slideInTop: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const slideInBottom: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const scale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export const rotate: Variants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: { opacity: 1, rotate: 0, transition: { duration: 0.4 } },
};

// Button hover animation
export const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

// Card hover animation
export const cardHover: Variants = {
  initial: {
    y: 0,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  hover: {
    y: -6,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.2 },
  },
};

// Staggered children animation
export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Animation wrapper components
interface AnimateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    MotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

// Component for fade in animation
export const AnimateFade: React.FC<AnimateProps> = ({
  children,
  delay = 0,
  className = "",
  once = true,
  amount = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={fadeIn}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Component for slide in from left animation
export const AnimateLeft: React.FC<AnimateProps> = ({
  children,
  delay = 0,
  className = "",
  once = true,
  amount = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={slideInLeft}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Component for slide in from right animation
export const AnimateRight: React.FC<AnimateProps> = ({
  children,
  delay = 0,
  className = "",
  once = true,
  amount = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={slideInRight}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Component for slide in from top animation
export const AnimateTop: React.FC<AnimateProps> = ({
  children,
  delay = 0,
  className = "",
  once = true,
  amount = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={slideInTop}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Component for slide in from bottom animation
export const AnimateBottom: React.FC<AnimateProps> = ({
  children,
  delay = 0,
  className = "",
  once = true,
  amount = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={slideInBottom}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Component for scale animation
export const AnimateScale: React.FC<AnimateProps> = ({
  children,
  delay = 0,
  className = "",
  once = true,
  amount = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={scale}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Component for staggered children animations
export const AnimateStagger: React.FC<AnimateProps> = ({
  children,
  className = "",
  once = true,
  amount = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={staggerChildren}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Component for staggered child item
export const AnimateStaggerItem: React.FC<AnimateProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <motion.div variants={fadeIn} className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
};

// Animated button wrapper
export const AnimatedButton: React.FC<AnimateProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={buttonHover}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated card wrapper
export const AnimatedCard: React.FC<AnimateProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={cardHover}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
