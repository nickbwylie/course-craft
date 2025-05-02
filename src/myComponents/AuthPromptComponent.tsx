import React from "react";
import { LogIn, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const AuthPromptComponent: React.FC = () => {
  const { setShowLoginModal } = useAuth();

  return (
    <div className="w-full mb-8">
      <Card className="border-l-4 border-l-[#407e8b] dark:border-l-[#60a5fa] bg-white dark:bg-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-[#407e8b] dark:text-[#60a5fa]">
            <LockIcon className="h-5 w-5" />
            Sign In Required
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            You need to be signed in to create and save courses. Sign in or
            create an account to continue.
          </p>
          <Button
            className="bg-[#407e8b] hover:bg-[#305f6b] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] text-white"
            onClick={() => setShowLoginModal(true)}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In to Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPromptComponent;
