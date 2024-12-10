"use client";

// react/nextjs components
import React from "react";

const Page = () => {
  return (
    <div className="h-full w-full flex flex-col gap-2 pb-8 overflow-hidden">
      <div className="flex gap-2">
        {[...new Array(4)].map((i) => (
          <div
            key={"first-array" + i}
            className="h-20 w-full bg-gray-300 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
      <div className="flex gap-2 flex-1">
        {[...new Array(2)].map((i) => (
          <div
            key={"second-array" + i}
            className="h-full w-full bg-gray-300 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Page;
