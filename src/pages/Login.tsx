import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseconsant";
import { X } from "lucide-react";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showLoginModal, setShowLoginModal } = useAuth();
  if (!showLoginModal) {
    return <></>;
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
      return;
    }

    alert("Unable to sign in. Please check your credentials.");
  };

  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!email) {
      alert("Enter an email");
      return;
    }
    if (!password) {
      alert("Enter a password");
      return;
    }

    const signInAttempt = await signInWithEmail();

    if (signInAttempt.data?.user && !signInAttempt.error) {
      alert("User signed in");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "https://example.com/welcome",
      },
    });

    if (data?.user?.id && !error) {
      await supabase.from("users").insert({
        id: data.user?.id,
        email: email,
        created_at: new Date().toISOString(),
        name: "",
      });

      alert("User has been created");
    } else {
      alert("Error logging in");
    }
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
        {/* Modal Content */}
        {/* <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            position: "relative",
          }}
        >
          <Button
            className="absolute top-2 right-2"
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={() => setShowLoginModal(false)}
          >
            X
          </Button>

          <h3 className="text-3xl text-center">Sign in to Create a Course</h3>
          <h5 className="text-sm font-light text-center">
            Sign in or sign up to continue
          </h5>

          <div className="w-full flex flex-col pt-8 space-y-2">
            <Button
              className="w-full p-2"
              style={{ backgroundColor: "rgb(64,126,139)" }}
            >
              <h5 className="w-full text-white text-md flex flex-row space-x-2 justify-center items-center ">
                <FaGoogle />
                <div>Continue with Google</div>
              </h5>
            </Button>
            <Separator />

            <Input
              type="email"
              placeholder="Enter your Email"
              className="inputField"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Enter your Password"
              className="inputField"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="secondary" onClick={(e) => handleLogin(e)}>
              Continue with Email
            </Button>
          </div>
        </div> */}
        <div className="relative flex flex-col gap-6">
          <Button
            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={() => setShowLoginModal(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Card>
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
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={(e) => loginWithEmail(e)}>
                    Login
                  </Button>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
