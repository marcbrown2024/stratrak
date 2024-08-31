"use client";

// react/nextjs components
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// custom components

// zustand stores
import { useModalStore } from "@/store/DropDownModalStore";

// Icons
import { AiOutlineClose } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { FaUserLock } from "react-icons/fa6";
import { MdOutlineHelp } from "react-icons/md";

const DropDownModal = () => {
  const isModalOpen = useModalStore((state) => state.isModalOpen);
  const toggleModal = useModalStore((state) => state.toggleModal);
  const currentPathname = usePathname();
  const router = useRouter();
  const userPhotoUrl =
    "https://cdn-icons-png.flaticon.com/512/3237/3237472.png";

  return (
    <div
      className={`absolute top-16 right-8 hidden md:flex items-center justify-center z-50 ${
        isModalOpen ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300 ease-in-out`}
    >
      <div className="h-[30rem] w-96 flex flex-col items-center text-black bg-[#fffefe] border rounded-2xl mr-8 pt-2">
        <div className="h-1/2 w-full flex flex-col items-center justify-center gap-6 p-4">
          <div className="h-auto w-full flex items-center justify-between">
            <span className="text-xl text-blue-500 font-bold tracking-wider">
              User Acount
            </span>
            <button
              onClick={toggleModal}
              className="flex items-center justify-center"
            >
              <AiOutlineClose className="text-xl text-blue-500 cursor-pointer" />
            </button>
          </div>
          <div className="h-auto w-full flex items-center justify-start gap-8">
            <Image
              src={userPhotoUrl}
              alt=""
              width={50}
              height={50}
              className="h-20 w-20 rounded-full"
            />
            <div className="flex flex-col items-start justify-start gap-1">
              <p className="text-lg text-blue-500 font-semibold">First Last</p>
              <p className="text-base text-blue-500 font-medium">Department</p>
              <p className="text-base text-blue-500 font-medium">
                Company Name
              </p>
            </div>
          </div>
          <Link
            href={"/userProfile"}
            className={`h-10 w-full flex items-center justify-center text-blue-500 font-semibold border border-blue-500 rounded-3xl`}
          >
            View Profile
          </Link>
        </div>
        <div className="h-1/2 w-full bg-blue-500 rounded-b-2xl">
          <div className="h-auto w-full flex flex-col items-start justify-center gap-4 mx-4 my-6">
            <span className="text-xl text-white font-bold tracking-wider">
              User Support
            </span>
            <div className="h-auto w-full flex flex-col items-start justify-start gap-4">
              <button type="button">
                <Link
                  href={"/help"}
                  className="flex items-center justify-start gap-4 text-white text-xl"
                >
                  <MdOutlineHelp className="text-white text-2xl" />
                  <span>Help</span>
                </Link>
              </button>
              <button type="button">
                <Link
                  href={"/resetPassword"}
                  className="flex items-center justify-start gap-4 text-white text-xl"
                >
                  <FaUserLock className="text-white text-2xl" />
                  <span>Reset Password</span>
                </Link>
              </button>
            </div>
          </div>
          <hr className="w-full" />
          <div className="h-auto w-full flex items-center justify-start px-4 py-2 rounded-b-2xl">
            <button type="button">
              <Link
                href={"/login"}
                className="h-8 w-full flex items-center justify-start gap-4 text-white text-xl font-medium mt-2"
              >
                <MdLogout className="text-white text-2xl" />
                Sign Out
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDownModal;
