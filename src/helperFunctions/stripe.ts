import { SERVER } from "@/constants";
import { supabase } from "@/supabaseconsant";

export enum TokenPackages {
  "free" = "free",
  "starter" = "starter",
  "pro" = "pro",
  "expert" = "expert",
}

export const TokenPackagePrices: Record<TokenPackages, number> = {
  [TokenPackages.free]: 0,
  [TokenPackages.starter]: 4.99,
  [TokenPackages.pro]: 9.99,
  [TokenPackages.expert]: 19.99,
} as const;

export async function createStripeCheckoutSession(
  priceId: string,
  userId: string
) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  const token = session?.access_token || " ";
  console.log("price id here", priceId);
  console.log("user id here", userId);

  const response = await fetch(`${SERVER}/create_checkout_session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ priceId: priceId, userId: userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  const data = await response.json();
  return data;
}
