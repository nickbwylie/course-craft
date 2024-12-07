/**
 * v0 by Vercel.
 * @see https://v0.dev/t/xYHqD5MkVkT
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import courseLogo from "../assets/courseL.webp";

export default function CoolNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <a href="#" className="flex items-center">
            <MountainIcon className="h-6 w-6" />
          </a>
          {/* Centered navigation */}
          <div className="absolute inset-x-0 flex justify-center">
            <nav className="sm:flex gap-8 items-center">
              <a
                href="/"
                className="font-medium flex items-center text-sm transition-colors hover:underline"
              >
                Home
              </a>
              <a
                href="/explore"
                className="font-medium flex items-center text-sm transition-colors hover:underline"
              >
                Explore
              </a>
              <a
                href="/create"
                className="font-medium flex items-center text-sm transition-colors hover:underline"
              >
                Create
              </a>
              <a
                href="/dashboard"
                className="font-medium flex items-center text-sm transition-colors hover:underline"
              >
                Dashboard
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
            <Button size="sm">Sign up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
