import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseconsant";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash, Trash2 } from "lucide-react";

const AccountDeletion: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    if (!user || !user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to delete your account",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      // 1. Delete user-related data from database tables
      // First, delete courses created by the user
      const { error: coursesError } = await supabase
        .from("courses")
        .delete()
        .eq("user_id", user.id);

      if (coursesError) {
        console.error("Error deleting user courses:", coursesError);
        throw new Error("Failed to delete user data");
      }

      // 2. Delete the user from any other tables as needed
      // For example, if you have a users table with additional data
      const { error: userDataError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (userDataError) {
        console.error("Error deleting user data:", userDataError);
        // Continue anyway, since the auth user is the important part
      }

      // 3. Delete the user from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id
      );

      if (authError) {
        // If admin delete fails, try the standard API
        throw new Error("Failed to delete account");
      }

      // 4. Sign out the user
      await signOut();

      // 5. Show success message
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted",
        variant: "default",
      });

      // 6. Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Account deletion error:", error);
      toast({
        title: "Error",
        description:
          "There was a problem deleting your account. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmDialogOpen(false);
    }
  };

  const isConfirmationValid = confirmationText === "DELETE";

  return (
    <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
      <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-200 flex flex-row gap-2 items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />{" "}
        Danger Zone
      </h2>
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
          <Trash2 className="h-6 w-6 text-red-600 dark:text-red-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
            Delete Account
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          <AlertDialog
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white"
              >
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600 dark:text-red-500">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-700 dark:text-gray-300">
                  This action cannot be undone. Your account and all your data
                  will be permanently deleted.
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>All your created courses will be deleted</li>
                    <li>Your progress tracking will be lost</li>
                    <li>Your personal information will be removed</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mt-2 mb-4">
                <Label
                  htmlFor="confirmation"
                  className="text-sm font-medium text-red-600 dark:text-red-400"
                >
                  Type DELETE to confirm
                </Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="mt-1 border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                  placeholder="DELETE"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={!isConfirmationValid || isDeleting}
                  className={`bg-red-600 hover:bg-red-700 text-white ${
                    !isConfirmationValid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Delete Account Permanently"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletion;
