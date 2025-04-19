import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseconsant";
import { useQuery } from "@tanstack/react-query";

export function useUserInfo() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userInfo", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return null;
      }

      console.log("Fetching user info from Supabase");

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data || null;
    },
    enabled: !!user?.id,
    staleTime: 24 * 60 * 60 * 100, // 2.4 hours
  });
}
