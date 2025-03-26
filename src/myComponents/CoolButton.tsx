import { motion } from "framer-motion";
import { useState } from "react";

export const CoolButton = ({ children, className }) => {
  const [flash, setFlash] = useState(false);

  const handleClick = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  };

  return (
    <motion.button
      whileTap={{
        backgroundColor: "#3b82f6",
        color: "#fff",
        transition: { duration: 0.3 },
      }}
      className="bg-slate-300 text-blue-600 hover:bg-blue-50 border border-blue-300 px-4 py-2 rounded"
    >
      Click Me
    </motion.button>
  );
};
