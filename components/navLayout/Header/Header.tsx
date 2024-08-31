"use client";

// react/nextjs components
import React, { useEffect } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

// custom hooks
import UseScroll from "@/hooks/UseScroll";

// zustand stores
import { useModalStore } from "@/store/DropDownModalStore";

const Header = () => {
  const scrolled = UseScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const { toggleModal, closeModal } = useModalStore();

  useEffect(() => {
    const closePopupsOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".Popup")) {
        closeModal();
      }
    };
    document.addEventListener("click", closePopupsOnOutsideClick);
    return () => {
      document.removeEventListener("click", closePopupsOnOutsideClick);
    };
  }, []);

  return (
    <div
      className={`sticky inset-x-0 top-0 w-full transition-all border-b border-zinc-200 ${
        scrolled ? "border-b border-zinc-200 bg-white/75 backdrop-blur-lg" : ""
      } ${selectedLayout ? "border-b border-zinc-200 bg-white" : ""} z-30 `}
    >
      <div className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="h-8 w-8 bg-blue-500 rounded-lg" />
            <span className="font-bold text-xl text-blue-500 flex ">Logo</span>
          </Link>
        </div>
        <button
          onClick={toggleModal}
          className="Popup h-10 w-10 md:flex hidden items-center justify-center text-center bg-blue-100 rounded-full"
        >
          <span className="text-blue-500 font-extrabold">HQ</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
