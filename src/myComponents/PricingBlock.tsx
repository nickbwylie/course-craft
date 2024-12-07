import { ChevronRightIcon, ChevronsLeftRightIcon } from "lucide-react";

const starter = {
  title: "STARTER",
  cost: 2.99,
  videoHours: 200,
  courses: 20,
} as const;

const premium = {
  title: "PREMIUM",
  cost: 5.99,
  videoHours: 500,
  courses: 50,
} as const;
const advanced = {
  title: "ADVANCED",
  cost: 20.99,
  videoHours: 2000,
  courses: 200,
} as const;

const subLevel = {
  starter: starter,
  premium: premium,
  advanced: advanced,
} as const;

export default function PricingBlock({
  priceLevel,
}: {
  priceLevel: keyof typeof subLevel;
}) {
  return (
    <div className="flex flex-col w-72 drop-shadow-md ">
      <div className=" p-8 rounded-t-lg" style={{ backgroundColor: "#4D639C" }}>
        <div
          className="w-full text-md font-semibold"
          style={{ color: "#CCD7E4" }}
        >
          {subLevel[priceLevel].title}
        </div>

        <div
          className="w-full text-3xl font-semibold pt-4 flex flex-row items-center"
          style={{ color: "#D1DBE8" }}
        >
          <span className="text-lg pr-2" style={{ color: "#ADDCEC" }}>
            $
          </span>
          {subLevel[priceLevel].cost}
        </div>

        <div
          className="w-full text-xl font-semibold pt-4 flex flex-row items-center"
          style={{ color: "#BFCCDE" }}
        >
          {subLevel[priceLevel].videoHours}
          <span className="pl-2">hours of video</span>
        </div>
        <div
          className="w-full text-lg font-semibold pt-2 flex flex-row items-center"
          style={{ color: "#BFCCDE" }}
        >
          {subLevel[priceLevel].videoHours}
          <span className="pl-2">course</span>
        </div>
      </div>
      <div className="w-full bg-slate-100 p-4 rounded-b-lg">
        <div
          className="text-sm font-semibold text-center flex flex-row space-x-2 justify-center"
          style={{ color: "#646F92" }}
        >
          START FREE TRIAL
          <ChevronRightIcon />
        </div>
      </div>
    </div>
  );
}
