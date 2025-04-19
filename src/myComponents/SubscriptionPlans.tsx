// src/myComponents/TokenPackages.tsx
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coins, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import PayPalCheckoutModal from "./BuyTokens";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  createStripeCheckoutSession,
  TokenPackages,
} from "@/helperFunctions/stripe";
import BuyTokensModal from "@/pages/StripeBuyTokens";

// price id

// Define token packages
export const tokenPackages = [
  {
    id: TokenPackages.free,
    name: "Free Trial",
    tokens: 2,
    price: 0.0,
    description: "Get started with a few courses for free",
    features: [
      "2 basic courses (1 hours max each)",
      "Try summaries and quizzes",
      "No credit card required",
    ],
    popular: false,
    color: "gray",
    link: "",
    priceId: "",
  },
  {
    id: TokenPackages.starter,
    name: "Starter Pack",
    tokens: 10,
    price: 4.99,
    description: "Enough tokens to create up to 10 basic courses",
    features: [
      "No feature gating",
      "Flashcards unlocked",
      "Enhanced course creation settings",
      "Create 10 courses",
    ],
    popular: false,
    color: "blue",
    link: "https://buy.stripe.com/test_9AQ4hv6BDdZnbRuaEE",
    priceId: "price_1RF6By4K0ftCSNroD4p0DJzW",
  },
  {
    id: TokenPackages.pro,
    name: "Pro Pack",
    tokens: 30,
    price: 9.99,
    description: "Best value for regular creators",
    features: [
      "Discounted token rate",
      "Great for power users",
      "Create 30 courses",
    ],
    popular: true,
    color: "cyan",
    link: "https://buy.stripe.com/test_eVa15j1hjf3r6xa7st",
    priceId: "price_1RFNJ44K0ftCSNroAIIjDE2J",
  },
  {
    id: TokenPackages.expert,
    name: "Expert Pack",
    tokens: 100,
    price: 19.99,
    description: "Create dozens of courses with premium AI options",
    features: [
      "Biggest discount",
      "Ideal for educators and teams",
      "Create 100 courses",
    ],
    popular: false,
    color: "purple",
    link: "https://buy.stripe.com/test_eVa15j1hjf3r6xa7st",
    priceId: "price_1RFQvd4K0ftCSNroopkxw00Y",
  },
] as const;

export default function SubscriptionPlans() {
  const { user, setShowLoginModal } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<TokenPackages>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  console.log("selectedPackage", selectedPackage);

  const handlePaymentSuccess = (details: any) => {
    toast({
      title: "Purchase Successful!",
      description: `You've purchased ${details.tokens} tokens!`,
    });

    // Invalidate any user-related queries to fetch updated token balance
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });

    // Redirect to create page or dashboard
    navigate("/create");
  };

  // Helper function to get the color class based on the package
  const getColorClasses = (packageData: (typeof tokenPackages)[0]) => {
    const colorMap = {
      gray: {
        bg: "bg-slate-50 dark:bg-slate-700/50",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200 dark:border-slate-700",
        highlight: "border-slate-300 ring-slate-200",
        button:
          "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300",
        tokenBadge:
          "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
      },
      blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-[#407e8b] dark:text-[#60a5fa]",
        border: "border-blue-200 dark:border-blue-800",
        highlight: "border-blue-400 ring-blue-200",
        button:
          "bg-[#407e8b] hover:bg-[#305f6b] text-white dark:bg-[#407e8b] dark:hover:bg-[#54adbf]",
        tokenBadge:
          "bg-blue-100 dark:bg-blue-900/30 text-[#407e8b] dark:text-blue-400",
      },
      cyan: {
        bg: "bg-cyan-50 dark:bg-cyan-900/20",
        text: "text-[#407e8b] dark:text-cyan-400",
        border: "border-cyan-200 dark:border-cyan-800/80",
        highlight: "border-[#407e8b] ring-cyan-200",
        button:
          "bg-[#407e8b] hover:bg-[#305f6b] text-white dark:bg-[#407e8b] dark:hover:bg-[#54adbf]",
        tokenBadge:
          "bg-cyan-100 dark:bg-cyan-900/40 text-[#407e8b] dark:text-cyan-400",
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
        highlight: "border-purple-400 ring-purple-200",
        button:
          "bg-[#407e8b] hover:bg-[#305f6b] text-white dark:bg-[#407e8b] dark:hover:bg-[#54adbf]",
        tokenBadge:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      },
    };

    return colorMap[packageData.color as keyof typeof colorMap];
  };

  const onSelectPackage = async (priceId: string) => {
    if (!user || !user.id) return;
    console.log("price id here", priceId);
    try {
      const res = await createStripeCheckoutSession(priceId, user.id);

      if (res.error) {
        throw new Error(res.error);
      }
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
      });
      console.error("Error creating checkout session:", error);
    }
    //navigate("/checkout", { state: { tokenPackage } });
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      <div className="w-full flex flex-col text-start">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex flex-row gap-2 items-center">
          <Coins className="w-5 h-5" />
          Choose Your Token Package
        </h2>
        <div className="w-full mx-auto mt-6 text-left">
          <Alert className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Info className="h-5 w-5 text-[#407e8b] dark:text-cyan-400" />
            <AlertTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
              How Tokens Work
            </AlertTitle>
            <AlertDescription className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              All users can browse and view public courses for free. Tokens are
              only required when creating your own courses.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tokenPackages.map((pkg) => {
          const colors = getColorClasses(pkg);

          return (
            <Card
              key={pkg.id}
              className={`relative flex flex-col h-full overflow-hidden transform transition-transform duration-300  hover:shadow-2xl ${
                pkg.popular
                  ? `${colors.highlight} dark:border-2 ring-2 dark:ring-opacity-30`
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {pkg.popular && (
                <div
                  className={`absolute top-2 right-2 rounded-full px-3 py-1 uppercase text-xs font-bold shadow-md ${colors.bg} ${colors.text}`}
                >
                  Popular
                </div>
              )}
              <CardHeader className="pt-6 pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Coins className={colors.text} />
                  {pkg.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  <span className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                    {pkg.price === 0.0 ? "Free" : `$${pkg.price}`}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div
                  className={`${colors.bg} ${colors.text} text-sm font-medium px-3 py-1.5 rounded-full inline-block mb-4`}
                >
                  {pkg.tokens} Tokens
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                  {pkg.description}
                </p>

                <ul className="space-y-2 text-sm">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Zap
                        className={`h-4 w-4 ${colors.text} mr-2 flex-shrink-0 mt-0.5`}
                      />
                      <span className="text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto px-6 pb-4">
                {pkg.id !== TokenPackages.free &&
                  (user && user.email ? (
                    <Button
                      className={`w-full ${colors.bg} ${colors.text} hover:opacity-90 border ${colors.border} py-2 rounded-md font-semibold transition-colors duration-200`}
                      onClick={() => onSelectPackage(pkg.priceId)}
                    >
                      Buy
                    </Button>
                  ) : (
                    <Button
                      className={`w-full ${colors.bg} ${colors.text} hover:opacity-90 border ${colors.border} py-2 rounded-md font-semibold transition-colors duration-200`}
                      onClick={() => setShowLoginModal(true)}
                    >
                      Login
                    </Button>
                  ))}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
              How do tokens work?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Each token allows you to create one course, regardless of which
              package you purchased it in. Tokens never expire.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
              Are there any feature limitations?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              No! All users have access to all features. The only difference
              between packages is the number of tokens (courses) you can create.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
              Can I get a refund?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              We offer refunds within 7 days of purchase if you haven't used any
              tokens yet. Contact support for assistance.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
              What happens when I run out of tokens?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              You can still access and use all courses you've created. To create
              new courses, simply purchase more tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
