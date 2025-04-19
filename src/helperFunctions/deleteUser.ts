import { SERVER } from "@/constants";
import { supabase } from "@/supabaseconsant";

export async function deleteUser(userId: string) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const token = session?.access_token || " ";
  const response = await fetch(`${SERVER}/delete_users_account_supabase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  const data = await response.json();
  return data;
}
