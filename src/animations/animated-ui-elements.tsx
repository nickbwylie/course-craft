// src/components/ui/animated-elements.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button as UIButton } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge as UIBadge } from "@/components/ui/badge";

// ====== Animated Button ======
interface AnimatedButtonProps
  extends React.ComponentPropsWithoutRef<typeof UIButton> {
  effect?: "scale" | "lift" | "pulse" | "shine" | "none";
}

export const AnimatedButton = React.forwardRef<
  React.ElementRef<typeof UIButton>,
  AnimatedButtonProps
>(({ className, effect = "scale", children, ...props }, ref) => {
  // Effect variants
  const getEffectVariants = () => {
    switch (effect) {
      case "scale":
        return {
          rest: { scale: 1 },
          hover: { scale: 1.05 },
          tap: { scale: 0.98 },
        };
      case "lift":
        return {
          rest: { y: 0, boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" },
          hover: { y: -2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)" },
          tap: { y: 1, boxShadow: "0 1px 1px rgba(0, 0, 0, 0.05)" },
        };
      case "pulse":
        return {
          rest: { scale: 1 },
          hover: {
            scale: [1, 1.02, 1],
            transition: { repeat: Infinity, duration: 1.5 },
          },
          tap: { scale: 0.98 },
        };
      case "shine":
        return {
          rest: {
            background: "linear-gradient(90deg, transparent, transparent)",
          },
          hover: {
            background: [
              "linear-gradient(90deg, transparent, transparent)",
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
              "linear-gradient(90deg, transparent, transparent)",
            ],
            transition: { duration: 1.5 },
          },
          tap: { scale: 0.98 },
        };
      case "none":
      default:
        return {
          rest: {},
          hover: {},
          tap: {},
        };
    }
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={getEffectVariants()}
    >
      <UIButton ref={ref} className={className} {...props}>
        {children}
      </UIButton>
    </motion.div>
  );
});

AnimatedButton.displayName = "AnimatedButton";

// ====== Animated Badge ======
interface AnimatedBadgeProps
  extends React.ComponentPropsWithoutRef<typeof UIBadge> {
  effect?: "pulse" | "bounce" | "fade" | "none";
  delay?: number;
}

export const AnimatedBadge = React.forwardRef<
  React.ElementRef<typeof UIBadge>,
  AnimatedBadgeProps
>(({ className, effect = "pulse", delay = 0, children, ...props }, ref) => {
  // Effect variants
  const getEffectVariants = () => {
    switch (effect) {
      case "pulse":
        return {
          initial: { scale: 0 },
          animate: {
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 15,
              delay,
            },
          },
          hover: { scale: 1.1 },
        };
      case "bounce":
        return {
          initial: { y: -20, opacity: 0 },
          animate: {
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay,
            },
          },
          hover: { y: -3, transition: { duration: 0.2 } },
        };
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: { duration: 0.3, delay },
          },
          hover: { opacity: 0.8 },
        };
      case "none":
      default:
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          hover: { opacity: 1 },
        };
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={getEffectVariants()}
      className="inline-block"
    >
      <UIBadge ref={ref} className={className} {...props}>
        {children}
      </UIBadge>
    </motion.div>
  );
});

AnimatedBadge.displayName = "AnimatedBadge";

// ====== Animated Tabs ======
interface AnimatedTabsProps
  extends React.ComponentPropsWithoutRef<typeof Tabs> {
  indicatorClassName?: string;
}

export const AnimatedTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  AnimatedTabsProps
>(({ className, indicatorClassName, children, ...props }, ref) => {
  // We need to handle the tab indicator animation
  const [selectedTab, setSelectedTab] =
    React.useState<HTMLButtonElement | null>(null);
  const [indicatorState, setIndicatorState] = React.useState({
    width: 0,
    left: 0,
  });

  // Update indicator position when selected tab changes
  React.useEffect(() => {
    if (selectedTab) {
      setIndicatorState({
        width: selectedTab.offsetWidth,
        left: selectedTab.offsetLeft,
      });
    }
  }, [selectedTab]);

  // Clone TabsList to add our custom handler
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === TabsList) {
      // Clone the TabsList
      return React.cloneElement(child, {
        ...child.props,
        children: React.Children.map(child.props.children, (tabChild) => {
          if (React.isValidElement(tabChild) && tabChild.type === TabsTrigger) {
            // Clone each TabsTrigger to add a ref
            return React.cloneElement(tabChild, {
              ...tabChild.props,
              onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                if (tabChild.props.onClick) {
                  tabChild.props.onClick(e);
                }
                // Update the selected tab reference
                setSelectedTab(e.currentTarget);
              },
              // If it's the default tab, get its ref
              ref: (el: HTMLButtonElement) => {
                if (el && tabChild.props.value === props.defaultValue) {
                  setSelectedTab(el);
                }
              },
            });
          }
          return tabChild;
        }),
      });
    }
    return child;
  });

  return (
    <Tabs ref={ref} className={cn("relative", className)} {...props}>
      {enhancedChildren}
      {/* Animated Indicator */}
      {selectedTab && (
        <motion.div
          className={cn(
            "absolute bottom-0 h-0.5 bg-cyan-600 dark:bg-cyan-500",
            indicatorClassName
          )}
          initial={false}
          animate={{
            width: indicatorState.width,
            left: indicatorState.left,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Tabs>
  );
});

AnimatedTabs.displayName = "AnimatedTabs";

// ====== Animated Navigation ======
export const AnimatedNavItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    active?: boolean;
  }
>(({ className, active, children, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      {...props}
      initial="initial"
      animate={active ? "active" : "initial"}
      whileHover="hover"
      variants={{
        initial: { color: "inherit" },
        active: { color: "rgb(64, 126, 139)" },
        hover: { x: 5, transition: { duration: 0.2 } },
      }}
    >
      {children}
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-[rgb(64,126,139)] dark:bg-[rgb(74,136,149)]"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1, originX: 0 }}
          exit={{ scaleX: 0, originX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
});

AnimatedNavItem.displayName = "AnimatedNavItem";

// ====== Animated List ======
export const AnimatedList: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className, staggerDelay = 0.05 }) => {
  const childArray = React.Children.toArray(children);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className={className}
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.3 },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// ====== Animated Notification Count ======
export const AnimatedCounter: React.FC<{
  count: number;
  className?: string;
}> = ({ count, className }) => {
  return (
    <motion.div
      key={count}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 15,
        },
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium",
        className
      )}
    >
      {count}
    </motion.div>
  );
};

// ====== Animated Dropdown ======
export const AnimatedDropdown: React.FC<{
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}> = ({ children, className, isOpen }) => {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={false}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        height: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
};

// ====== Animated Page Section ======
export const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay,
        },
      }}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// ====== Animated Icon ======
export const AnimatedIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
  effect?: "pulse" | "spin" | "bounce";
  animate?: boolean;
}> = ({ children, className, effect = "pulse", animate = true }) => {
  const getVariants = () => {
    switch (effect) {
      case "pulse":
        return {
          animate: {
            scale: [1, 1.2, 1],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
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
        };
      case "bounce":
        return {
          animate: {
            y: [0, -5, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
            },
          },
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={className}
      animate={animate ? "animate" : "initial"}
      variants={getVariants()}
    >
      {children}
    </motion.div>
  );
};
