"use client";

// react/nextjs components
import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

// custom hooks
import UseScroll from "@/hooks/UseScroll";

const Header = () => {
  const scrolled = UseScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={`sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200 ${
        scrolled ? "border-b border-gray-200 bg-white/75 backdrop-blur-lg" : ""
      } ${selectedLayout ? "border-b border-gray-200 bg-white" : ""}`}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
            <span className="font-bold text-xl text-blue-500 flex ">Logo</span>
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="h-10 w-10 flex items-center justify-center text-center bg-blue-100 rounded-full">
            <span className="text-sm text-blue-500 font-extrabold">HQ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
