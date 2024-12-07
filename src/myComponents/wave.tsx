import React from "react";

export default function Wave() {
  return (
    <>
      <div className="fixed bottom-0 left-0 w-full h-24 sm:h-32 md:h-40 lg:h-48 overflow-hidden pointer-events-none z-10">
        <div className="absolute bottom-0 left-0 w-full h-full">
          <svg
            className="absolute bottom-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
          >
            <defs>
              <path
                id="wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="wave-animation">
              <use
                xlinkHref="#wave"
                x="48"
                y="0"
                fill="rgba(59, 130, 246, 0.7)"
              />
              <use
                xlinkHref="#wave"
                x="48"
                y="3"
                fill="rgba(59, 130, 246, 0.5)"
              />
              <use
                xlinkHref="#wave"
                x="48"
                y="5"
                fill="rgba(59, 130, 246, 0.3)"
              />
              <use xlinkHref="#wave" x="48" y="7" fill="rgb(59, 130, 246)" />
            </g>
          </svg>
        </div>
      </div>
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .wave-animation {
          animation: wave 15s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
          width: 200%;
        }
      `}</style>
    </>
  );
}
