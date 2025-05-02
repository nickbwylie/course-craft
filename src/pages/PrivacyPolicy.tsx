import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const pageTitle = "CourseCraft - Privacy Policy";
  const pageDescription =
    "This Privacy Policy explains how CourseCraft collects, uses, and protects your personal data. Learn about your rights and our commitment to your privacy.";

  return (
    <div className="mobile-layout">
      <div className="mobile-content">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta
            name="keywords"
            content="create course, custom learning, AI education, YouTube learning"
          />
          <link rel="canonical" href="https://course-craft.tech/privacy" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://course-craft.tech/privacy" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />

          {/* Twitter */}
          <meta
            property="twitter:url"
            content="https://course-craft.tech/privacy"
          />
          <meta property="twitter:title" content={pageTitle} />
          <meta property="twitter:description" content={pageDescription} />
        </Helmet>
        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="link"
              size="sm"
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Privacy Policy
            </h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400">
              Last updated: April 28, 2025
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Introduction
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Welcome to CourseCraft. We respect your privacy and are committed
              to protecting your personal data. This Privacy Policy explains how
              we collect, use, and safeguard your information when you use our
              website.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We collect the following personal information:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Email Address:</strong> collected during account
                registration through Supabase authentication.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              How We Use Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We use your email address to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Authenticate your account securely.</li>
              <li>
                Communicate important updates about your account or services.
              </li>
              <li>Maintain and improve our platform functionality.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Analytics
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We use Vercel Analytics to monitor website performance and usage
              in an aggregated, anonymized way. No personally identifiable
              information is collected through these analytics.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Cookies
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We do not use cookies for advertising or tracking purposes.
              Cookies may be used by third-party services (such as Vercel) to
              maintain essential website functionality.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Third-Party Services
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We integrate with external services solely to enable core
              functionality:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                OpenAI API to generate course summaries and quizzes based on
                YouTube videos you provide.
              </li>
              <li>YouTube Data API to retrieve video metadata.</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              By using our service, you also agree to the{" "}
              <a
                href="https://www.youtube.com/t/terms"
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400"
              >
                YouTube Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400"
              >
                Google's Privacy Policy
              </a>
              .
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Data Security
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We take appropriate security measures to protect your personal
              data. Authentication and account management are securely handled
              by Supabase.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Data Retention
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We retain your email address for as long as your account remains
              active. You may request deletion of your account and associated
              data at any time by contacting us.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Your Rights
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              You have the right to access, update, or delete your personal
              information. To exercise these rights, please contact us using the
              information below.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Changes to This Privacy Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We may update this Privacy Policy from time to time. We will post
              updates on this page and revise the "Last updated" date above.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              <strong>Email:</strong> support@course-craft.tech
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
