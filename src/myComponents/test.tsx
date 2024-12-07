import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { FaHome, FaPlusCircle } from "react-icons/fa"; // Add icons for visual flair
import { HomeIcon, PlusCircledIcon } from "@radix-ui/react-icons";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup displaying information when hovering over an element.",
  },
];

export function NavigationMenuDemo() {
  return (
    <div className="w-full bg-white shadow-lg z-50">
      <NavigationMenu className="container mx-auto py-4 px-8">
        <NavigationMenuList className="flex items-center justify-between">
          {/* Left Side: Main Menu */}
          <div className="flex space-x-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2 text-base font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300">
                <HomeIcon className="text-lg" /> {/* Icon added here */}
                <span>Explore</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white rounded-md shadow-lg p-6 animate-fadeIn">
                <ul className="grid gap-4 md:w-[350px]">
                  <ListItem href="/explore" title="Explore Page">
                    Explore a vast array of user generated courses.
                  </ListItem>
                  <ListItem href="/" title="Home Page">
                    Go home
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem className="flex items-center space-x-2 text-base font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300">
              <PlusCircledIcon /> {/* Icon added here */}
              <a href="/create">Create</a>
            </NavigationMenuItem>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center space-x-8 pl-4">
            <NavigationMenuItem>
              <NavigationMenuLink className="text-base text-gray-800 hover:text-red-600 transition-colors duration-300 text-center">
                Login
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink>
                <Button className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 transition-all duration-300 px-6 py-2 rounded-lg shadow-lg">
                  Sign Up
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block rounded-md p-3 transition-colors duration-300 hover:bg-gray-50 hover:shadow-md",
            className
          )}
          {...props}
        >
          <div className="font-semibold text-gray-900">{title}</div>
          <p className="text-sm text-gray-600 leading-snug">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
