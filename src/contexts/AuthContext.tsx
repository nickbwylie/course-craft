import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/supabaseconsant";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  refreshSession: () => Promise<void>; // New function to manually refresh session
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Store refresh timer in a ref to avoid re-creating it on re-renders
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error("Error refreshing session:", error);
        // If refresh fails, clear user state and possibly show login modal
        setUser(null);
        setSession(null);
        setShowLoginModal(true);
        return;
      }

      if (data?.session) {
        setUser(data.session.user);
        setSession(data.session);

        // Schedule next refresh before token expires
        // Typically refresh when token is 3/4 through its lifetime
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
        }

        const expiresIn = data.session.expires_in || 3600; // Default to 1 hour if not specified
        const refreshTime = expiresIn * 1000 * 0.75; // Convert to ms and schedule at 75% of lifetime

        refreshTimerRef.current = setTimeout(refreshSession, refreshTime);
      }
    } catch (err) {
      console.error("Unexpected error refreshing session:", err);
    }
  };

  useEffect(() => {
    // Check if a session exists on initial load
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data?.session;

      setUser(currentSession?.user || null);
      setSession(currentSession || null);

      // If we have a session, set up refresh timer
      if (currentSession) {
        const expiresIn = currentSession.expires_in || 3600;
        const refreshTime = expiresIn * 1000 * 0.75;

        refreshTimerRef.current = setTimeout(refreshSession, refreshTime);
      }

      setIsLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setUser(newSession?.user || null);
        setSession(newSession);

        // If user signed in or token was refreshed, set up refresh timer
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
          }

          if (newSession) {
            const expiresIn = newSession.expires_in || 3600;
            const refreshTime = expiresIn * 1000 * 0.75;

            refreshTimerRef.current = setTimeout(refreshSession, refreshTime);
          }
        }

        // If user signed out, clear refresh timer
        if (event === "SIGNED_OUT") {
          if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
          }
        }
      }
    );

    // Clean up on unmount
    return () => {
      subscription.subscription.unsubscribe();

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, []);

  const signOut = async () => {
    // Clear refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signOut,
        showLoginModal,
        setShowLoginModal,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
