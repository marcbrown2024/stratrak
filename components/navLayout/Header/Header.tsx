"use client";

// react/nextjs components
import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

// custom hooks
import UseScroll from "@/hooks/UseScroll";

// zustand stores 
import { useModalStore } from "@/store/DropDownModalStore";

const Header = () => {
  const scrolled = UseScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const toggleModal = useModalStore((state) => state.toggleModal);

  return (
    <div
      className={`sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200 ${
        scrolled ? "border-b border-gray-200 bg-white/75 backdrop-blur-lg" : ""
      } ${selectedLayout ? "border-b border-gray-200 bg-white" : ""}`}
    >
      <div className="h-20 flex items-center justify-between px-4">
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
          <button  onClick={toggleModal} className="h-16 w-16 flex items-center justify-center text-center bg-blue-100 rounded-full">
            <span className="text-xl text-blue-500 font-extrabold">HQ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
