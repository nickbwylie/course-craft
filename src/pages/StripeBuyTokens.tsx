import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  createStripeCheckoutSession,
  TokenPackagePrices,
  TokenPackages,
} from "@/helperFunctions/stripe";

const stripePromise = loadStripe(
  "pk_test_51RF69Y4K0ftCSNro9xmyxcTramt3jmDo01WAJoLWaegIocnL9pzYzlcIRuSknFjViQok4qT762lrdFeqDgrH9AFR00JuCGaXwC"
);

interface BuyTokensModalProps {
  pkg: TokenPackages | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyTokensModal({
  pkg,
  isOpen,
  onClose,
}: BuyTokensModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pkg) return;
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    createStripeCheckoutSession(pkg)
      .then((res) => {
        if (res.error) setError(res.error);
        else setClientSecret(res.clientSecret);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isOpen, pkg]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>
            Buy {pkg} — ${TokenPackagePrices[pkg]}
          </DialogTitle>
        </DialogHeader>

        {loading && <p className="my-4">Loading payment form…</p>}
        {error && <p className="text-red-400 my-4">Error: {error}</p>}

        {!loading && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: { theme: "stripe" } }}
          >
            <CheckoutFormInsideModal />
          </Elements>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="text-white">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CheckoutFormInsideModal() {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/order/complete",
      },
    });

    if (error) setErrorMessage(error.message || "Payment failed");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <PaymentElement />
      {errorMessage && <p className="text-red-400">{errorMessage}</p>}
      <Button className="w-full mt-4" type="submit">
        Pay
      </Button>
    </form>
  );
}
