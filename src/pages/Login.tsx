import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import { supabase } from "@/supabaseconsant";
import { useAuth } from "@/contexts/AuthContext";

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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useTracking } from "@/hooks/useTracking";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  terms: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions",
  }),
});

function SignupForm({
  setShowLoginModal,
  setShowSignUpModal,
}: {
  setShowLoginModal: (state: boolean) => void;
  setShowSignUpModal: (state: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { trackEvent } = useTracking();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });

        trackEvent("signup_error", undefined, {
          email: values.email,
          error: error.message,
        });
        return;
      }

      if (data?.user?.id) {
        // Create user record in the users table
        await supabase.from("users").insert({
          id: data.user.id,
          email: values.email,
          created_at: new Date().toISOString(),
          name: "",
        });

        toast({
          title: "Account Created",
          description: "Your account has been successfully created.",
          variant: "success",
        });

        // Switch back to login view
        setShowLoginModal(false);

        trackEvent("signup", data.user.id, {
          email: values.email,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col gap-6  w-[340px] sm:w-[400px]">
      <Button
        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
        variant="ghost"
        size="icon"
        aria-label="Close"
        onClick={() => setShowLoginModal(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          terms of service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          privacy policy
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary-light text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              onClick={() => setShowSignUpModal(false)}
              className="text-primary cursor-pointer hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showLoginModal, setShowLoginModal } = useAuth();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const { trackEvent } = useTracking();
  if (!showLoginModal) {
    return <></>;
  }

  async function forgotPassword() {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      console.log(data);
      console.log(error);
    } catch (e) {
      console.log(e);
    }
  }

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return { data, error };
  }

  const loginWithEmail = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const { data, error } = await signInWithEmail();

    if (error) {
      alert(error.message);
      return;
    }

    if (data?.user) {
      setShowLoginModal(false);
      alert("Successfully signed in!");

      trackEvent("login", data.user.id, {
        email: email,
      });
      return;
    }

    alert("Unable to sign in. Please check your credentials.");
  };

  return (
    <>
      {/* Modal Overlay */}

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
        {!showSignUpModal ? (
          <div className="relative flex flex-col gap-6 w-[340px] sm:w-[400px]">
            <Button
              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
              variant="ghost"
              size="icon"
              aria-label="Close"
              onClick={() => setShowLoginModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          onClick={() => forgotPassword()}
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        placeholder="Create a password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full bg-primary-light text-white "
                      onClick={(e) => loginWithEmail(e)}
                    >
                      Login
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a
                      onClick={() => setShowSignUpModal(true)}
                      className="underline underline-offset-4 cursor-pointer"
                    >
                      Sign up
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <SignupForm
            setShowSignUpModal={setShowSignUpModal}
            setShowLoginModal={setShowLoginModal}
          />
        )}
      </div>
    </>
  );
}
