import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaFeatherAlt } from "react-icons/fa";
import {
  BookOpen,
  Lightbulb,
  Heart,
  Landmark,
  Brain,
  FlaskConical,
  Rocket,
} from "lucide-react";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-auto bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <FaFeatherAlt className="h-6 w-6 text-[#407f8b] mr-2" />
            About CourseCraft
          </DialogTitle>
          <DialogDescription className="text-base">
            Transforming passive watching into active learning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          {/* Origin & Mission Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center">
              <Lightbulb className="h-5 w-5 text-[#407f8b] mr-2 flex-shrink-0" />
              Our Story
            </h3>
            <p className="text-slate-600 dark:text-gray-300">
              CourseCraft was founded in 2024 by Nick Wylie as a solo project
              with a clear mission: to transform the way people learn from
              online video content. The idea emerged from recognizing that while
              YouTube is filled with incredible educational content, it lacks
              the structure and engagement tools needed for optimal learning.
            </p>
            <p className="text-slate-600 dark:text-gray-300">
              By leveraging AI technology, CourseCraft transforms scattered
              YouTube videos into cohesive learning experiences, complete with
              summaries and knowledge checks, turning passive watching into
              active learning.
            </p>
          </div>

          {/* How It Works Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center">
              <BookOpen className="h-5 w-5 text-[#407f8b] mr-2 flex-shrink-0" />
              How It Works
            </h3>
            <p className="text-slate-600 dark:text-gray-300">
              CourseCraft allows you to build personalized learning experiences
              by selecting YouTube videos that align with your learning goals.
              Our platform then:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg flex">
                <Brain className="h-5 w-5 text-[#407f8b] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-slate-200">
                    Smart Summaries
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Generates concise, key-point summaries of video content to
                    reinforce learning and provide quick reference materials.
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg flex">
                <FlaskConical className="h-5 w-5 text-[#407f8b] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-slate-200">
                    Knowledge Quizzes
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Creates targeted quizzes to test comprehension and boost
                    retention, turning passive watching into active learning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center">
              <Rocket className="h-5 w-5 text-[#407f8b] mr-2 flex-shrink-0" />
              Learning Benefits
            </h3>
            <p className="text-slate-600 dark:text-gray-300">
              CourseCraft transforms passive video consumption into an active
              learning experience with several key benefits:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-gray-300 list-disc pl-6">
              <li>
                <span className="font-medium">Increased Retention:</span> Active
                engagement with summaries and quizzes significantly improves
                information retention compared to passive watching.
              </li>
              <li>
                <span className="font-medium">Personalized Learning:</span>{" "}
                Create custom courses tailored to your specific learning needs
                and interests.
              </li>
              <li>
                <span className="font-medium">Academic Support:</span> Enhance
                classroom learning by organizing lecture videos with
                AI-generated study materials.
              </li>
              <li>
                <span className="font-medium">Self-Paced Structure:</span> Learn
                at your own pace with organized, structured content that builds
                on itself.
              </li>
            </ul>
          </div>

          {/* Values Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center">
              <Heart className="h-5 w-5 text-[#407f8b] mr-2 flex-shrink-0" />
              Our Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Active Learning
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  We believe that engaging actively with content is the key to
                  deep understanding and retention.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Personalization
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Each learner is unique, and their learning resources should be
                  customizable to their specific needs.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Accessibility
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  We're committed to making high-quality learning experiences
                  accessible to everyone.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Innovation
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  We continuously explore new ways to enhance the learning
                  experience through technology.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center">
              <Landmark className="h-5 w-5 text-[#407f8b] mr-2 flex-shrink-0" />
              Connect With Us
            </h3>
            <p className="text-slate-600 dark:text-gray-300">
              I'd love to hear from you! Whether you have questions, feedback,
              or just want to share your learning experience, don't hesitate to
              reach out.
            </p>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <strong>Email:</strong> support@course-craft.tech
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-[#407f8b] hover:bg-[#305f6b] text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AboutUsModal;
