import React from "react";
import { LogIn, Notebook, CirclePlus, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const CreateCourseFallback: React.FC = () => {
  const { setShowLoginModal } = useAuth();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
      <div className="mb-6">
        <div className="h-16 w-16 bg-[#407e8b]/10 dark:bg-[#60a5fa]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CirclePlus className="h-7 w-7 text-[#407e8b] dark:text-[#60a5fa]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Create Your Own Custom Course
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8">
          Transform YouTube videos into structured learning experiences with
          AI-generated summaries and quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Feature
          icon={
            <Sparkles className="h-5 w-5 text-[#407e8b] dark:text-[#60a5fa]" />
          }
          title="AI-Powered"
          description="Generate smart summaries and quizzes automatically"
        />
        <Feature
          icon={
            <BookOpen className="h-5 w-5 text-[#407e8b] dark:text-[#60a5fa]" />
          }
          title="Customizable"
          description="Select videos and adjust settings to fit your needs"
        />
        <Feature
          icon={
            <Notebook className="h-5 w-5 text-[#407e8b] dark:text-[#60a5fa]" />
          }
          title="Private Library"
          description="Save and access your courses anytime"
        />
      </div>

      <Button
        className="bg-[#407e8b] hover:bg-[#305f6b] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] text-white px-6"
        onClick={() => setShowLoginModal(true)}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In to Create a Course
      </Button>
    </div>
  );
};

const Feature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center">
    <div className="h-10 w-10 rounded-full bg-[#407e8b]/10 dark:bg-[#60a5fa]/20 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-1">
      {title}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
  </div>
);

export default CreateCourseFallback;
