// src/animations/ui-animations.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Enhanced button animation
export const AnimatedButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "subtle" | "outline" | "elevated";
}> = ({
  children,
  className = "",
  onClick,
  disabled = false,
  variant = "default",
}) => {
  // Different effects for different button variants
  const getVariants = () => {
    switch (variant) {
      case "subtle":
        return {
          initial: { scale: 1, backgroundColor: "inherit" },
          hover: {
            scale: 1.02,
            backgroundColor: "rgba(64, 126, 139, 0.1)",
            transition: { duration: 0.2 },
          },
          tap: {
            scale: 0.98,
            backgroundColor: "rgba(64, 126, 139, 0.15)",
            transition: { duration: 0.1 },
          },
        };

      case "outline":
        return {
          initial: { scale: 1, y: 0 },
          hover: {
            scale: 1.02,
            y: -1,
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.2 },
          },
          tap: {
            scale: 0.98,
            y: 0,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.1 },
          },
        };

      case "elevated":
        return {
          initial: {
            scale: 1,
            y: 0,
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          },
          hover: {
            scale: 1.03,
            y: -2,
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
            transition: { duration: 0.2 },
          },
          tap: {
            scale: 0.98,
            y: 0,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.1 },
          },
        };

      case "default":
      default:
        return {
          initial: { scale: 1 },
          hover: { scale: 1.03, transition: { duration: 0.2 } },
          tap: { scale: 0.97, transition: { duration: 0.1 } },
        };
    }
  };

  const buttonVariants = getVariants();

  return (
    <motion.div
      className={cn(className)}
      initial="initial"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      variants={buttonVariants}
      onClick={disabled ? undefined : onClick}
      style={{
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </motion.div>
  );
};

// Card animation with enhanced hover effect
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  hoverEffect?: "lift" | "glow" | "border" | "scale" | "tilt" | "none";
}> = ({
  children,
  className = "",
  onClick,
  disabled = false,
  hoverEffect = "lift",
}) => {
  // Different hover effects for the card
  const getVariants = () => {
    switch (hoverEffect) {
      case "lift":
        return {
          initial: {
            y: 0,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          },
          hover: {
            y: -5,
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.3 },
          },
        };

      case "glow":
        return {
          initial: {
            boxShadow: "0 0 0 rgba(64, 126, 139, 0)",
          },
          hover: {
            boxShadow: "0 0 15px rgba(64, 126, 139, 0.35)",
            transition: { duration: 0.3 },
          },
        };

      case "border":
        return {
          initial: {
            borderColor: "rgba(64, 126, 139, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 1)",
          },
          hover: {
            borderColor: "rgba(64, 126, 139, 0.7)",
            backgroundColor: "rgba(64, 126, 139, 0.03)",
            transition: { duration: 0.3 },
          },
        };

      case "scale":
        return {
          initial: { scale: 1 },
          hover: {
            scale: 1.03,
            transition: { duration: 0.3 },
          },
        };

      case "tilt":
        return {
          initial: {
            rotateX: 0,
            rotateY: 0,
          },
          hover: {
            rotateX: 2,
            rotateY: 2,
            transition: { duration: 0.3 },
          },
        };

      case "none":
      default:
        return {
          initial: {},
          hover: {},
        };
    }
  };

  const cardVariants = getVariants();

  return (
    <motion.div
      className={cn(className)}
      initial="initial"
      whileHover={disabled ? undefined : "hover"}
      variants={cardVariants}
      onClick={disabled ? undefined : onClick}
      style={{
        opacity: disabled ? 0.7 : 1,
        cursor: onClick && !disabled ? "pointer" : "default",
      }}
    >
      {children}
    </motion.div>
  );
};

// List item animation for staggered lists
export const AnimatedListItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  index?: number; // For staggered animations
  onClick?: () => void;
}> = ({ children, className = "", index = 0, onClick }) => {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{
        duration: 0.2,
        delay: index * 0.05, // Stagger based on index
      }}
      whileHover={{
        x: 5,
        transition: { duration: 0.2 },
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Animated icon that can pulse, spin, or bounce
export const AnimatedIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
  animation?: "pulse" | "spin" | "bounce" | "none";
  hover?: boolean; // Whether to only animate on hover
}> = ({ children, className = "", animation = "pulse", hover = false }) => {
  // Different animations for icons
  const getVariants = () => {
    switch (animation) {
      case "pulse":
        return {
          animate: {
            scale: [1, 1.1, 1],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
          hover: {
            scale: [1, 1.2, 1],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
        };

      case "spin":
        return {
          animate: {
            rotate: 360,
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            },
          },
          hover: {
            rotate: 360,
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            },
          },
        };

      case "bounce":
        return {
          animate: {
            y: [0, -5, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
          hover: {
            y: [0, -8, 0],
            transition: {
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
        };

      case "none":
      default:
        return {
          animate: {},
          hover: { scale: 1.1 },
        };
    }
  };

  return (
    <motion.div
      className={cn(className)}
      initial={{ scale: 1 }}
      animate={hover ? undefined : "animate"}
      whileHover="hover"
      variants={getVariants()}
    >
      {children}
    </motion.div>
  );
};

// Toast notification animation
export const AnimatedToast: React.FC<{
  children: React.ReactNode;
  className?: string;
  visible: boolean;
  position?: "top" | "bottom";
}> = ({ children, className = "", visible, position = "bottom" }) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: position === "top" ? -20 : 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: position === "top" ? -10 : 10,
      scale: 0.98,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

// Tab indicator animation
export const AnimatedTabIndicator: React.FC<{
  width: number;
  left: number;
  className?: string;
}> = ({ width, left, className = "" }) => {
  return (
    <motion.div
      className={cn(
        "absolute bottom-0 h-0.5 bg-cyan-600 dark:bg-cyan-500",
        className
      )}
      initial={false}
      animate={{
        width: width,
        left: left,
        transition: { type: "spring", stiffness: 500, damping: 30 },
      }}
    />
  );
};

// Notification dot animation
export const AnimatedNotificationDot: React.FC<{
  className?: string;
  visible?: boolean;
}> = ({ className = "", visible = true }) => {
  return (
    <motion.div
      className={cn("w-2 h-2 bg-red-500 rounded-full", className)}
      initial={{ scale: 0 }}
      animate={{
        scale: visible ? [0, 1.2, 1] : 0,
        transition: { duration: 0.3 },
      }}
    />
  );
};

// Accordion animation
export const AnimatedAccordion: React.FC<{
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}> = ({ children, className = "", isOpen }) => {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial="collapsed"
      animate={isOpen ? "open" : "collapsed"}
      variants={{
        open: {
          height: "auto",
          opacity: 1,
          transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
        },
        collapsed: {
          height: 0,
          opacity: 0,
          transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Tooltip animation
export const AnimatedTooltip: React.FC<{
  children: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
  visible: boolean;
}> = ({ children, className = "", position = "top", visible }) => {
  const getPosition = () => {
    switch (position) {
      case "top":
        return { y: 10 };
      case "bottom":
        return { y: -10 };
      case "left":
        return { x: 10 };
      case "right":
        return { x: -10 };
      default:
        return { y: 10 };
    }
  };

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...getPosition() }}
      animate={{
        opacity: visible ? 1 : 0,
        ...(visible ? { x: 0, y: 0 } : getPosition()),
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
};

// Menu animation
export const AnimatedMenu: React.FC<{
  children: React.ReactNode;
  className?: string;
  visible: boolean;
  direction?: "up" | "down" | "left" | "right";
}> = ({ children, className = "", visible, direction = "down" }) => {
  const getDirection = () => {
    switch (direction) {
      case "up":
        return { y: 20 };
      case "down":
        return { y: -20 };
      case "left":
        return { x: 20 };
      case "right":
        return { x: -20 };
      default:
        return { y: -20 };
    }
  };

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...getDirection(), scale: 0.95 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.95,
        ...(visible ? { x: 0, y: 0 } : getDirection()),
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
};
