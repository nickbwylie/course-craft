import { supabase } from "@/supabaseconsant";

export const useTracking = () => {
  const trackEvent = async (
    eventName: string,
    userId: string | undefined,
    metadata: Record<string, any>
  ) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Tracking event", {
        user_id: userId,
        event_name: eventName,
        metadata,
        created_at: new Date().toISOString(),
      });
      return;
    }

    try {
      // Simple event tracking utility
      await supabase.from("analytics").insert({
        user_id: userId,
        event_name: eventName,
        metadata,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Event tracking error:", error);
    }
  };

  return {
    trackEvent,
  };
};
