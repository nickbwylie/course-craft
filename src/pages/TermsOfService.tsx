import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="mobile-layout">
      <div className="mobile-content">
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
              Terms of Service
            </h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400">
              Last updated: March 17, 2025
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              1. Introduction
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Welcome to CourseCraft. These Terms of Service ("Terms") govern
              your access to and use of the CourseCraft platform, including any
              content, functionality, and services offered on or through
              CourseCraft.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              By accessing or using our service, you agree to be bound by these
              Terms. If you do not agree to these Terms, you must not access or
              use our service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              2. Eligibility
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              This service is available to users who are 13 years of age or
              older. If you are under 13 years old, you may not use this
              service. If you are between 13 and 18 years old, you may only use
              this service with the consent and supervision of a parent or legal
              guardian who agrees to be bound by these Terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              3. Account Registration
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              To access certain features of the service, you may be required to
              register for an account. You must provide accurate, current, and
              complete information during the registration process and keep your
              account information up-to-date.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              You are responsible for safeguarding the password that you use to
              access the service and for any activities or actions under your
              password. We encourage you to use "strong" passwords (passwords
              that use a combination of upper and lower case letters, numbers,
              and symbols) with your account.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              4. User Content
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Our service allows you to create and share educational content
              ("User Content"). You retain all rights in, and are solely
              responsible for, the User Content you create, post, or display on
              or through our service.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              By creating or sharing User Content on or through our service, you
              grant us a non-exclusive, royalty-free, transferable,
              sublicensable, worldwide license to use, store, display,
              reproduce, modify, create derivative works, and distribute your
              User Content on or through our service.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              You represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                You own the User Content created or have the right to use it and
                grant us the rights and license as provided in these Terms.
              </li>
              <li>
                The creation, posting, or display of your User Content on or
                through our service does not violate the privacy rights,
                publicity rights, copyrights, contract rights, or any other
                rights of any person.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              5. YouTube API Services
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Our service uses YouTube API Services to create and share courses
              based on YouTube content. By using our service, you are also
              agreeing to be bound by the{" "}
              <a
                href="https://www.youtube.com/t/terms"
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400"
              >
                YouTube Terms of Service
              </a>
              .
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Our use of YouTube API Services requires us to inform you that
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
              6. Intellectual Property
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Our service and its original content (excluding User Content and
              YouTube content), features, and functionality are and will remain
              the exclusive property of CourseCraft and its licensors. Our
              service is protected by copyright, trademark, and other laws of
              both the United States and foreign countries.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Our trademarks and trade dress may not be used in connection with
              any product or service without our prior written consent.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              7. Prohibited Uses
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              You may use our service only for lawful purposes and in accordance
              with these Terms. You agree not to use our service:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                In any way that violates any applicable federal, state, local,
                or international law or regulation.
              </li>
              <li>
                To transmit, or procure the sending of, any advertising or
                promotional material, including any "junk mail", "chain letter",
                "spam", or any other similar solicitation.
              </li>
              <li>
                To impersonate or attempt to impersonate CourseCraft, a
                CourseCraft employee, another user, or any other person or
                entity.
              </li>
              <li>
                To engage in any other conduct that restricts or inhibits
                anyone's use or enjoyment of the service, or which, as
                determined by us, may harm CourseCraft or users of the service
                or expose them to liability.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              8. Termination
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              If you wish to terminate your account, you may simply discontinue
              using the service or contact us to request account deletion.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              9. Limitation of Liability
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              In no event shall CourseCraft, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                Your access to or use of or inability to access or use the
                service.
              </li>
              <li>Any conduct or content of any third party on the service.</li>
              <li>Any content obtained from the service.</li>
              <li>
                Unauthorized access, use or alteration of your transmissions or
                content.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              10. Changes to Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. We will provide notice of such changes by
              posting the updated terms on this page and updating the "Last
              updated" date. Your continued use of the service after any such
              changes constitutes your acceptance of the new Terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-200">
              11. Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              <strong>Email:</strong>coursecrafttech@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
