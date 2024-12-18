import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Compass,
  CirclePlus,
  Book,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  ArrowLeftToLine,
  ArrowRightToLine,
  LogIn,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import "./SideNav.css";
import { useEffect, useState } from "react";

import testLogo from "../assets/Perplexity-Brand-Assets/Boundless-Book/blackTestLogo.png";

import { Button } from "@/components/ui/button";

const navItems = [
  {
    name: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    iconSelected: LayoutDashboard,
  },
  { name: "explore", href: "/explore", icon: Compass },
  { name: "create", href: "/create", icon: CirclePlus },
] as const;

interface SideNavProps {
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideNav({ navOpen, setNavOpen }: SideNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const url = location.pathname;

  const [delayedOpen, setDelayedOpen] = useState(navOpen);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    async function delayedOpenUpdate() {
      if (!navOpen) {
        setDelayedOpen(navOpen);
      } else {
        setTimeout(() => {
          setDelayedOpen(navOpen);
        }, 100);
      }
    }

    delayedOpenUpdate();
  }, [navOpen]);

  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        // Screen width is less than or equal to 768px
        setNavOpen(false);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`fixed h-full z-10 h-full side-nav ${
        navOpen ? "open" : "closed"
      }`}
      //   style={{ overflowX: "hidden" }}
    >
      <ScrollArea className="h-screen w-full px-4 py-6">
        <div className="flex flex-col space-y-4 ">
          <h3
            className={`w-full text-center font-semibold text-xl font-bold text-slate-600 flex flex-row truncate ${
              navOpen ? "justify-between" : "justify-center"
            } items-center`}
          >
            {navOpen && <img src={testLogo} width={30} height={30} />}

            {navOpen && (
              <span className="text-slate-800 text-md flex flex-nowrap">
                CourseCraft
              </span>
            )}
            <div className="p-2 rounded-full">
              {navOpen ? (
                <ArrowLeftToLine
                  width={24}
                  height={24}
                  className="text-slate-700 cursor-pointer"
                  onClick={() => setNavOpen(false)}
                />
              ) : (
                <ArrowRightToLine
                  width={24}
                  height={24}
                  className="text-slate-700 cursor-pointer justify-self-center"
                  onClick={() => setNavOpen(true)}
                />
              )}
            </div>
          </h3>

          {/* Navigation Links */}
          {navItems.map((item) => (
            <div
              key={item.href}
              className={`flex flex-row items-center p-2 rounded-lg cursor-pointer transition-all font-semibold  ${
                !navOpen && "justify-center"
              } ${
                item.href === url
                  ? "bg-white text-slate-900 border border-2 border-slate-400"
                  : "text-gray-500 hover:bg-white border border-2 border-slate-100"
              }`}
              onClick={() => navigate(item.href)}
            >
              <item.icon className={`${navOpen && "mr-2"} h-5 w-5`} />

              {delayedOpen && (
                <h5 className="text-base capitalize">{item.name}</h5>
              )}
            </div>
          ))}

          <Separator />

          {/* My Courses Section */}
          {navOpen && (
            <>
              <div className="flex flex-col space-y-2 rounded-lg hover:bg-white">
                {/* Example Course */}
                <div
                  className="flex items-center p-2 cursor-pointer"
                  onClick={() =>
                    navigate("/course/625474d7-21d4-4a7a-b6c8-bfbcd1e758cf")
                  }
                >
                  <Book className="mr-3 h-5 w-5 text-gray-500" />
                  <h5 className="truncate text-base">
                    How to improve yourself
                  </h5>
                </div>
                <div className="flex items-center space-x-2 px-2">
                  <Progress value={45} className="h-2 flex-grow" />
                  <span className="text-xs text-gray-600">45%</span>
                </div>
              </div>
            </>
          )}

          {navOpen && <Separator />}

          {/* Support and Logout */}
          <div className="mt-auto w-full h-full space-y-2 flex grow flex-col self-baseline">
            <div
              className={`flex w-full items-center ${
                !navOpen && "justify-center"
              }  p-2 rounded-lg hover:bg-gray-100 cursor-pointer`}
              onClick={() => navigate("/support")}
            >
              <Settings
                className={`${navOpen && "mr-3"}  h-5 w-5 text-gray-500`}
              />
              {navOpen && <h5 className="text-base">Settings</h5>}
            </div>
            <div
              className={`flex w-full items-center ${
                !navOpen && "justify-center"
              }  p-2 rounded-lg hover:bg-gray-100 cursor-pointer`}
              onClick={() => navigate("/support")}
            >
              <HelpCircle
                className={`${navOpen && "mr-3"} h-5 w-5 text-gray-500`}
              />
              {navOpen && <h5 className="text-base">Support</h5>}
            </div>
            {true === false ? (
              <div
                className={`flex w-full items-center ${
                  !navOpen && "justify-center"
                }  p-2 rounded-lg hover:bg-red-100 cursor-pointer`}
                onClick={() => console.log("Logout")}
              >
                <LogOut
                  className={`${navOpen && "mr-3"} h-5 w-5 `}
                  style={{ color: "rgb(240, 128, 128)" }}
                />
                {navOpen && (
                  <h5
                    className="text-base "
                    style={{ color: "rgb(240, 128, 128)" }}
                  >
                    Log Out
                  </h5>
                )}
              </div>
            ) : (
              <div className="w-full absolute bottom-4 pr-8">
                <Button
                  className={`w-full flex flex-row items-center ${
                    !navOpen && "justify-center"
                  }  p-2 rounded-lg cursor-pointer`}
                  style={{ backgroundColor: "rgb(64, 126, 139)" }}
                  onClick={() => console.log("Logout")}
                >
                  <LogIn
                    className={`${navOpen && "mr-3"} h-5 w-5 text-white`}
                  />
                  {navOpen && (
                    <h5 className="text-base text-white">Sign up/in</h5>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
