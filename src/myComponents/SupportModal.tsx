import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  CheckCircle,
  Lightbulb,
  PlusCircle,
  Lock,
  Eye,
} from "lucide-react";
import { FaFeatherAlt } from "react-icons/fa";

function SupportModal({
  supportModalOpen,
  setSupportModalOpen,
}: {
  supportModalOpen: boolean;
  setSupportModalOpen: (state: boolean) => void;
}) {
  return (
    <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FaFeatherAlt className="h-5 w-5 text-[#407f8b] mr-2" />
            Welcome to CourseCraft
          </DialogTitle>
          <DialogDescription className="flex justify-start">
            Your personal learning platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <PlusCircle className="h-5 w-5 text-[#407f8b] mr-2" />
              Create Custom Courses
            </h3>
            <p className="text-sm text-slate-600">
              Transform educational YouTube videos into structured learning
              experiences. Select videos, and our AI will organize them into a
              coherent course with summaries and quizzes.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <BookOpen className="h-5 w-5 text-[#407f8b] mr-2" />
              Learn Your Way
            </h3>
            <p className="text-sm text-slate-600">
              Follow your custom courses at your own pace. Each video comes with
              AI-generated summaries highlighting key points and quizzes to test
              your knowledge.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <Lock className="h-5 w-5 text-[#407f8b] mr-2" />
              Account Information
            </h3>
            <div className="text-sm text-slate-600 space-y-2">
              <p className="flex items-start">
                <PlusCircle className="h-4 w-4 text-[#407f8b] mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Creating courses</strong>: You need to sign up or log
                  in to create courses. Account creation is completely free.
                </span>
              </p>
              <p className="flex items-start">
                <Eye className="h-4 w-4 text-[#407f8b] mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Exploring courses</strong>: Browse and view public
                  courses without creating an account.
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <Lightbulb className="h-5 w-5 text-[#407f8b] mr-2" />
              Tips for Getting Started
            </h3>
            <ul className="text-sm text-slate-600 space-y-2 pl-7 list-disc">
              <li>
                Visit the{" "}
                <Badge variant="outline" className="font-normal">
                  Explore
                </Badge>{" "}
                tab to discover courses created by other users
              </li>
              <li>
                Use the{" "}
                <Badge variant="outline" className="font-normal">
                  Create
                </Badge>{" "}
                tab to build your own course from YouTube videos (login
                required)
              </li>
              <li>
                View the{" "}
                <Badge variant="outline" className="font-normal">
                  Library
                </Badge>{" "}
                tab to track and access your courses (login required)
              </li>
              <li>
                Click on a course to start learning with summaries and quizzes
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <CheckCircle className="h-5 w-5 text-[#407f8b] mr-2" />
              Free Access
            </h3>
            <p className="text-sm text-slate-600">
              CourseCraft is completely free to use. Create an unlimited number
              of courses, learn at your own pace, and share your knowledge with
              others.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => setSupportModalOpen(false)}
            className="bg-[#407f8b] opacity-100 hover:bg-[#407f8b] hover:opacity-75"
          >
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SupportModal;
