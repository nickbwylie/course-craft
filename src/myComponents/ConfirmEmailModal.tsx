import { useEffect, useState } from "react";
import { X, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseconsant";

// Form validation schema
const confirmEmailSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Verification code must be at least 6 characters" })
    .max(8, { message: "Verification code must not exceed 8 characters" }),
});

type ConfirmEmailProps = {
  email: string;
  password: string;
  showConfirmModal: boolean;
  setShowConfirmModal: (state: boolean) => void;
  onSuccessfulVerification?: () => void;
};

export default function ConfirmEmailModal({
  email,
  password,
  showConfirmModal,
  setShowConfirmModal,
  onSuccessfulVerification,
}: ConfirmEmailProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const form = useForm<z.infer<typeof confirmEmailSchema>>({
    resolver: zodResolver(confirmEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof confirmEmailSchema>) {
    setIsVerifying(true);

    try {
      // Here you would call your API to verify the code
      // For this example, we'll simulate a successful verification after a delay
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: values.code,
        type: "signup", // or 'magiclink', 'recovery', etc. depending on the flow
      });

      if (error) {
        form.setError("code", {
          type: "manual",
          message: "Invalid verification code",
        });
        toast({
          title: "Verification Failed",
          description: "The verification code is invalid or expired.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified.",
        variant: "success",
      });

      setShowConfirmModal(false);

      if (onSuccessfulVerification) {
        onSuccessfulVerification();
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  }

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      // Here you would call your API to resend the verification code
      // For this example, we'll simulate a success after a delay
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Error resending code:", error);
        toast({
          title: "Error",
          description: "Failed to resend verification code. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code Resent",
          description: `A new verification code has been sent to ${email}`,
          variant: "default",
        });
        setResendTimer(45);
      }
    } catch (error) {
      console.error("Error resending code:", error);
      toast({
        title: "Error",
        description: "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (showConfirmModal) {
      setResendTimer(45); // Prevent immediate resending on first open
    }
  }, [showConfirmModal]);

  useEffect(() => {
    if (resendTimer === 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!showConfirmModal) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div className="relative flex flex-col gap-6 w-[340px] sm:w-[400px]">
        <Button
          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
          variant="ghost"
          size="icon"
          aria-label="Close"
          onClick={() => setShowConfirmModal(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="mx-auto mb-4 bg-cyan-50 dark:bg-cyan-900/30 h-12 w-12 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <CardTitle className="text-2xl text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              We've sent a verification code to
              <br />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {email}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter code"
                          {...field}
                          className={
                            fieldState.error
                              ? "border-rose-300 dark:border-rose-800"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Please check your inbox and spam folder
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-700 dark:hover:bg-cyan-600"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Verifying...
                    </span>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center flex-col space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Didn't receive a code?
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendCode}
              disabled={isResending || resendTimer > 0}
              className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:bg-cyan-900/20"
            >
              {isResending
                ? "Sending..."
                : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend Code"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
