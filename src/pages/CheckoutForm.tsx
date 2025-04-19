// src/pages/CheckoutWrapper.tsx
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import CheckoutFormData from "./CheckoutFormData";
import {
  createStripeCheckoutSession,
  TokenPackages,
} from "@/helperFunctions/stripe";

const stripePromise = loadStripe(
  "pk_test_51RF69Y4K0ftCSNro9xmyxcTramt3jmDo01WAJoLWaegIocnL9pzYzlcIRuSknFjViQok4qT762lrdFeqDgrH9AFR00JuCGaXwC"
);

export default function CheckoutWrapper() {
  const { state } = useLocation();
  const pkg: TokenPackages = state.tokenPackage;
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    createStripeCheckoutSession(pkg).then((res) => {
      if (res.error) throw new Error(res.error);
      setClientSecret(res.clientSecret);
    });
  }, [pkg]);

  if (!clientSecret) return <p>Loading payment details…</p>;

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-slate-700 rounded-2xl shadow-lg">
      <Elements
        stripe={stripePromise}
        options={{ clientSecret, appearance: { theme: "night" } }}
      >
        <CheckoutFormData />
      </Elements>
    </div>
  );
}
