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
  refreshSession: () => Promise<void>;
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
        // Only clear user state if there's an actual auth error, not just a network error
        if (error.message.includes("JWT") || error.message.includes("token")) {
          setUser(null);
          setSession(null);
        }
        return;
      }

      if (data?.session) {
        setUser(data.session.user);
        setSession(data.session);

        // Schedule next refresh before token expires
        scheduleRefresh(data.session);
      }
    } catch (err) {
      console.error("Unexpected error refreshing session:", err);
    }
  };

  // Helper function to schedule the next refresh
  const scheduleRefresh = (currentSession: Session) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Get token expiration time
    const expiresAt = currentSession.expires_at;
    if (!expiresAt) {
      console.warn("No expiration time found in session");
      return;
    }

    // Calculate time until expiration in milliseconds
    const expiresIn = expiresAt * 1000 - Date.now();
    // Refresh at 85% of the way through the token lifetime for safety
    const refreshTime = Math.max(1000, expiresIn * 0.85);

    refreshTimerRef.current = setTimeout(refreshSession, refreshTime);
  };

  useEffect(() => {
    // Check if a session exists on initial load
    const getInitialSession = async () => {
      try {
        // This gets any existing session from localStorage
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting initial session:", error);
          setIsLoading(false);
          return;
        }

        const currentSession = data?.session;
        if (currentSession) {
          setUser(currentSession.user);
          setSession(currentSession);

          // Schedule refresh for this session
          scheduleRefresh(currentSession);
        } else {
        }
      } catch (e) {
        console.error("Unexpected error getting initial session:", e);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setUser(newSession?.user || null);
          setSession(newSession);

          if (newSession) {
            scheduleRefresh(newSession);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setSession(null);

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
    try {
      // Clear refresh timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
