// src/myComponents/PayPalCheckoutModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseconsant";
import { SERVER } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { Coins } from "lucide-react";

interface PayPalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenPackage: {
    id: string;
    name: string;
    tokens: number;
    price: number;
    color?: string;
  };
  onSuccess: (details: any) => void;
}

export default function BuyTokens({
  isOpen,
  onClose,
  tokenPackage,
  onSuccess,
}: PayPalCheckoutModalProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Get appropriate color class based on package
  const getColorClass = (color?: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600 dark:text-blue-400";
      case "cyan":
        return "text-cyan-600 dark:text-cyan-400";
      case "purple":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-cyan-600 dark:text-cyan-400";
    }
  };

  // Handle approval and capture the order
  const handleApprove = async (data: any, actions: any) => {
    setIsProcessing(true);

    try {
      // Capture the funds from the transaction
      const orderData = await actions.order.capture();

      // Verify the payment on our server
      if (user?.id) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await fetch(`${SERVER}/verify_token_purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            orderID: data.orderID,
            paypalDetails: orderData,
            tokenPackage: tokenPackage,
            amount: tokenPackage.price,
            user_id: user.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Payment verification failed");
        }

        const verificationResult = await response.json();

        // Call the success callback with the details
        onSuccess(verificationResult);
        onClose(); // Close the modal when done
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      console.error("Payment capture error:", error);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className={getColorClass(tokenPackage.color)} />
            Purchase {tokenPackage.name}
          </DialogTitle>
          <DialogDescription>
            You are purchasing {tokenPackage.tokens} tokens for $
            {tokenPackage.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isPending ? (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading PayPal...</p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-white p-4 rounded-md">
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "rect",
                  label: "pay",
                }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: `CourseCraft ${tokenPackage.name} - ${tokenPackage.tokens} Tokens`,
                        amount: {
                          currency_code: "USD",
                          value: tokenPackage.price.toFixed(2),
                        },
                      },
                    ],
                    application_context: {
                      shipping_preference: "NO_SHIPPING",
                    },
                    intent: "CAPTURE",
                  });
                }}
                onApprove={handleApprove}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  toast({
                    title: "Payment Error",
                    description:
                      "There was a problem with PayPal. Please try again.",
                    variant: "destructive",
                  });
                }}
              />
            </div>
          )}

          {isProcessing && (
            <div className="mt-4 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Processing your payment...
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
            className="border-gray-300 dark:border-gray-600 hover:dark:bg-gray-600 dark:text-gray-300"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
