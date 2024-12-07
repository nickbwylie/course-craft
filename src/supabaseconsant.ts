import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://brfywfaoiqbynekircrv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZnl3ZmFvaXFieW5la2lyY3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYzNzE4MTEsImV4cCI6MjA0MTk0NzgxMX0.G49ZHoBJePdeuEWLbW9-BNv7AIV8oJlUcj6dDakqhnc"
);
