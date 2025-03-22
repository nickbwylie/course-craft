import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
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
          Last updated: March 17, 2025
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          Introduction
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome to CourseCraft. We respect your privacy and are committed to
          protecting your personal data. This privacy policy will inform you
          about how we look after your personal data when you visit our website
          and tell you about your privacy rights and how the law protects you.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          The Data We Collect
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We may collect, use, store and transfer different kinds of personal
          data about you as follows:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Identity Data</strong> includes first name, last name,
            username or similar identifier.
          </li>
          <li>
            <strong>Contact Data</strong> includes email address.
          </li>
          <li>
            <strong>Technical Data</strong> includes internet protocol (IP)
            address, browser type and version, time zone setting and location,
            operating system and platform, and other technology on the devices
            you use to access this website.
          </li>
          <li>
            <strong>Usage Data</strong> includes information about how you use
            our website, products, and services.
          </li>
          <li>
            <strong>Learning Activity Data</strong> includes information about
            courses you create, view, or complete, quiz results, and learning
            progress.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          How We Use Your Data
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We will only use your personal data when the law allows us to. Most
          commonly, we will use your personal data in the following
          circumstances:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600 dark:text-slate-400">
          <li>To register you as a new user.</li>
          <li>To provide and improve our service to you.</li>
          <li>To manage our relationship with you.</li>
          <li>To personalize your experience.</li>
          <li>To administer and protect our business and this website.</li>
          <li>
            To make suggestions and recommendations to you about features or
            content that may be of interest to you.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          YouTube API Services
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Our service uses YouTube API Services to retrieve video data for
          educational purposes. By using our service, you are also agreeing to
          be bound by the{" "}
          <a
            href="https://www.youtube.com/t/terms"
            className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400"
          >
            YouTube Terms of Service
          </a>
          .
        </p>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Google's Privacy Policy can be found at{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400"
          >
            https://policies.google.com/privacy
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          Data Security
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We have put in place appropriate security measures to prevent your
          personal data from being accidentally lost, used, or accessed in an
          unauthorized way, altered, or disclosed. We limit access to your
          personal data to those employees, agents, contractors, and other third
          parties who have a business need to know.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          Data Retention
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We will only retain your personal data for as long as necessary to
          fulfill the purposes we collected it for, including for the purposes
          of satisfying any legal, accounting, or reporting requirements.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          Your Legal Rights
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Under certain circumstances, you have rights under data protection
          laws in relation to your personal data, including the right to:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600 dark:text-slate-400">
          <li>Request access to your personal data</li>
          <li>Request correction of your personal data</li>
          <li>Request erasure of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Request restriction of processing your personal data</li>
          <li>Request transfer of your personal data</li>
          <li>Right to withdraw consent</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          Cookies
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We use cookies and similar tracking technologies to track the activity
          on our service and hold certain information. Cookies are files with a
          small amount of data which may include an anonymous unique identifier.
        </p>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies,
          you may not be able to use some portions of our Service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          Changes to This Privacy Policy
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date at the top of this Privacy Policy.
        </p>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
          Contact Us
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          <strong>Email:</strong> coursecrafttech@gmail.com
        </p>
      </div>
    </div>
  );
}
