import { Calculator, CreditCard, BookOpen } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SubscriptionPlans from "@/myComponents/SubscriptionPlans";

export default function SubscriptionPage() {
  const pageTitle = "Token Store - CourseCraft";
  const pageDescription =
    "Get tokens to create more courses on CourseCraft. Choose from our one-time token packs and save with our volume discounts.";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="course pricing, token packs, online learning, ai courses"
        />
        <link rel="canonical" href="https://course-craft.tech/subscribe" />
      </Helmet>

      <div className="space-y-6">
        <SubscriptionPlans />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <div className="h-12 w-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
              One-Time Payment
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              No subscriptions. Just choose the token pack that fits your needs
              and pay securely with Stripe.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <div className="h-12 w-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
              Volume Discount
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              The more tokens you buy, the less you pay per course. Get up to
              80% savings with our larger token packs.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <div className="h-12 w-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
              Create More Courses
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Build your personal learning library by turning any YouTube videos
              into structured courses with our AI-powered summaries and quizzes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
