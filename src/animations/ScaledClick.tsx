import { HTMLMotionProps, motion } from "framer-motion";

interface AnimatedButtonWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hoverScale?: number;
  tapScale?: number;
}

export const ScaledClick: React.FC<AnimatedButtonWrapperProps> = ({
  children,
  hoverScale = 1.1,
  tapScale = 0.9,
  ...motionProps
}) => {
  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
