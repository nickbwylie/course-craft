import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle, BookOpen, Lock, CheckCircle, Mail } from "lucide-react";

const FEATURES = [
  {
    Icon: PlusCircle,
    title: "Build Custom Courses",
    desc: "Pick YouTube videos and let AI turn them into structured courses with summaries & quizzes.",
  },
  {
    Icon: BookOpen,
    title: "Learn Smarter",
    desc: "Review key insights and quiz yourself—at your own pace.",
  },
  {
    Icon: Lock,
    title: "Free to Start",
    desc: "Sign up free and get two course creations on us.",
  },
  {
    Icon: CheckCircle,
    title: "Unlimited Preview",
    desc: "Browse any public course without logging in.",
  },
];

function SupportModal({
  supportModalOpen,
  setSupportModalOpen,
}: {
  supportModalOpen: boolean;
  setSupportModalOpen: (open: boolean) => void;
}) {
  const contactSupport = () =>
    (window.location.href = "mailto:support@course-craft.tech");

  return (
    <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Welcome to CourseCraft
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            AI-powered courses, your way.
          </DialogDescription>
        </DialogHeader>

        <ul className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
          {FEATURES.map(({ Icon, title, desc }) => (
            <li key={title} className="py-4 flex items-start">
              <Icon className="h-5 w-5 text-[#407f8b] flex-shrink-0 mt-1" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {desc}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setSupportModalOpen(false)}
            className="flex-1 bg-[#407f8b] hover:bg-[#407f8b]/90 text-white py-2 rounded-lg font-medium"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            onClick={contactSupport}
            className="flex-1 flex items-center justify-center gap-2 border-[#407f8b] text-[#407f8b] hover:bg-slate-950 py-2 rounded-lg font-medium"
          >
            <Mail className="h-5 w-5" />
            Email Support
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SupportModal;
