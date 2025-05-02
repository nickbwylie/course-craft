import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, Key } from "lucide-react";
import AccountDeletion from "@/myComponents/AccountDeletion";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseconsant";
import { Helmet } from "react-helmet-async";
import { AuthError } from "@supabase/supabase-js";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Password update state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You must be logged in to access settings",
        variant: "destructive",
      });
    }
  }, [user, navigate]);

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirmation must match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated",
      });
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Update Failed",
        description:
          (error as AuthError)?.message ||
          "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) {
    return null;
  }

  const pageTitle = "Settings - CourseCraft";
  const pageDescription = "Make changes to your app settings.";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 relative">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="course settings" />
        <link rel="canonical" href="https://course-craft.tech/settings" />
        <meta name="robots" content="noindex,nofollow" />{" "}
        {/* Optional: if you want to keep the library private from search engines */}
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://course-craft.tech/settings" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {/* Twitter */}
        <meta
          property="twitter:url"
          content="https://course-craft.tech/settings"
        />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
      </Helmet>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Settings className="h-6 w-6 text-cyan-600 dark:text-cyan-500" />
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Account Settings
        </h1>
      </div>

      <div className="space-y-8">
        {/* Password Section */}
        <div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex flex-row gap-2 items-center">
              <Key className="w-5 h-5" /> Change Password
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {/* Note: Current password might not be needed if using Supabase magic links */}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="bg-white dark:bg-slate-700"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="bg-white dark:bg-slate-700"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    isUpdatingPassword || !newPassword || !confirmPassword
                  }
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Deletion */}
        <div>
          <AccountDeletion />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
