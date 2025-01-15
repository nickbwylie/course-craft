import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseconsant";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";

interface LoginModalProps {
  loginModalOpen: boolean;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginModal({
  loginModalOpen,
  setLoginModalOpen,
}: LoginModalProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return { data, error };
  }

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

    setLoading(true);

    const signInAttempt = await signInWithEmail();

    if (signInAttempt.data?.user) {
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
    //
    // TODO
    // create a user
    await supabase.from("users").insert({
      id: data.user?.id,
      email: email,
      created_at: new Date(),
      name: "",
    });

    if (data) {
      alert("User has been created");
    } else {
      alert("Error logging in");
    }

    setLoading(false);
  };
  return (
    <>
      {/* Modal Overlay */}
      {loginModalOpen && (
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
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <button
              onClick={() => setLoginModalOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              X
            </button>

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
          </div>
        </div>
      )}
    </>
  );
}
