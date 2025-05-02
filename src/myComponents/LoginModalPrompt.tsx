// src/myComponents/LoginPromptModal.tsx
import { motion } from "framer-motion";
import { LogIn, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({
  isOpen,
  onClose,
}: LoginPromptModalProps) {
  const { setShowLoginModal } = useAuth();

  const handleSignIn = () => {
    setShowLoginModal(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mx-auto p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4"
          >
            <Lock className="h-6 w-6 text-primary dark:text-primary-light" />
          </motion.div>
          <DialogTitle className="text-xl text-center">
            Sign in to Create Courses
          </DialogTitle>
          <DialogDescription className="text-center">
            Join CourseCraft to start building your own courses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-2">
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
              >
                <span className="text-xs text-green-600 dark:text-green-400">
                  ✓
                </span>
              </motion.div>
              Create personalized courses from YouTube videos
            </h3>

            <h3 className="text-sm font-medium flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
              >
                <span className="text-xs text-green-600 dark:text-green-400">
                  ✓
                </span>
              </motion.div>
              Generate AI summaries and quizzes
            </h3>

            <h3 className="text-sm font-medium flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
              >
                <span className="text-xs text-green-600 dark:text-green-400">
                  ✓
                </span>
              </motion.div>
              Save and organize your learning materials
            </h3>

            <h3 className="text-sm font-medium flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
              >
                <span className="text-xs text-green-600 dark:text-green-400">
                  ✓
                </span>
              </motion.div>
              Share your courses with others
            </h3>
          </div>

          <div className="bg-slate-100 dark:bg-slate-700/30 p-3 rounded-md text-center">
            <p className="text-sm">Get 2 free courses when you sign up!</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-initial border-slate-300 dark:border-slate-600 dark:text-slate-200 hover:bg-slate-850"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleSignIn}
            className="flex items-center gap-2 flex-1 sm:flex-initial bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark text-white"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
