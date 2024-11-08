"use client";

// react/nextjs components
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

// constants
import { SIDENAV_ITEMS } from "@/constants";

// custom hooks
import UseScroll from "@/hooks/UseScroll";

// zustand stores
import { useModalStore } from "@/store/DropDownModalStore";
import useUser from "@/hooks/UseUser";

const Header = () => {
  const { user } = useUser();
  const scrolled = UseScroll(5);
  const currentPathname = usePathname();
  const selectedLayout = useSelectedLayoutSegment();
  const { toggleModal, closeModal } = useModalStore();

  const splitCamelCase = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (char) => char.toUpperCase());
  };

  // Split the pathname into segments and filter out empty strings
  const words = currentPathname.split("/").filter(Boolean);

  // Check if the last segment is 'files'
  const isFilesPage = words[words.length - 1] === "files";

  let currentPath = "";

  // If on the 'files' page, use the previous segment for the title
  if (isFilesPage && words.length > 1) {
    currentPath = `${splitCamelCase(words[words.length - 2])} Files`; // Get the previous segment
  } else {
    // If not on the 'files' page, just take the last segment
    currentPath = splitCamelCase(words.pop() ?? "");
  }

  // Determine the display title based on the current pathname
  const displayTitle =
    currentPathname === "/"
      ? "Home"
      : words[words.length - 1] === "regulatoryDocs"
      ? "Regulatory Documents"
      : ["Active", "Inactive", "Completed"].includes(currentPath)
      ? `${currentPath} Trials`
      : currentPath;

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
  }, [closeModal]);

  if (
    currentPathname === "/login" ||
    currentPathname === "/login/forgetPassword"
  ) {
    return null;
  }

  const getInitials = (user?: User | null): string => {
    if (!user) return "";

    // Get the first letter of first name and last name
    const firstInitial = user.fName ? user.fName.charAt(0).toUpperCase() : "";
    const lastInitial = user.lName ? user.lName.charAt(0).toUpperCase() : "";

    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div
      className={`sticky inset-x-0 top-0 w-full transition-all border-b border-zinc-300 ${
        scrolled
          ? "border-b border-zinc-200 bg-slate-50/75 backdrop-blur-lg"
          : ""
      } ${selectedLayout ? "border-b border-zinc-200 bg-slate-50" : ""} z-30`}
    >
      <div className="h-14 flex items-center justify-between px-6">
        <span className="hidden md:flex text-xl font-bold tracking-wide">
          {displayTitle}
        </span>
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
          onClick={() => toggleModal()}
          className="Popup h-10 w-10 md:flex hidden items-center justify-center text-center bg-[#1286ff] rounded-full"
        >
          <span className="text-sm text-white font-extrabold">
            {getInitials(user)}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
