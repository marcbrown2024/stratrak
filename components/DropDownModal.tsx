"use client";

// react/nextjs components
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// zustand stores
import { useModalStore } from "@/store/DropDownModalStore";

// Icons
import { AiOutlineClose } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { FaUserLock } from "react-icons/fa6";
import { MdOutlineHelp } from "react-icons/md";

const DropDownModal = () => {
  const { isModalOpen, toggleModal, closeModal } = useModalStore();
  const currentPathname = usePathname();
  const router = useRouter();
  const userPhotoUrl =
    "https://cdn-icons-png.flaticon.com/512/3237/3237472.png";

  return (
    <div
      className={`Popup absolute top-10 right-4 h-96 w-80 hidden md:flex flex-col items-center  ${
        isModalOpen ? "visible opacity-100" : "invisible opacity-0"
      } bg-[#fffefe] rounded-2xl mr-8 pt-2 border z-50 transition-all duration-300 ease-in-out`}
    >
      <div className="h-1/2 w-full flex flex-col items-center justify-center gap-4 p-4">
        <div className="h-auto w-full flex items-center justify-between">
          <span className="text-lg text-blue-500 font-bold tracking-wider">
            User Acount
          </span>
          <button
            onClick={closeModal}
            className="flex items-center justify-center"
          >
            <AiOutlineClose className="text-xl text-blue-500 cursor-pointer" />
          </button>
        </div>
        <div className="h-auto w-full flex items-center justify-start gap-6">
          <Image
            src={userPhotoUrl}
            alt=""
            width={50}
            height={50}
            className="h-16 w-16 rounded-full"
          />
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-blue-500 font-semibold">First Last</p>
            <p className="text-sm text-blue-500 font-medium">Department</p>
            <p className="text-sm text-blue-500 font-medium">Company Name</p>
          </div>
        </div>
        <Link
          onClick={closeModal}
          href={"/profile"}
          className={`w-full flex items-center justify-center text-blue-500 font-semibold p-1 rounded-2xl border border-blue-500`}
        >
          View Profile
        </Link>
      </div>
      <div className="h-1/2 w-full bg-blue-500 rounded-b-2xl">
        <div className="h-auto w-full flex flex-col items-start justify-center gap-4 mx-4 my-2">
          <span className="text-lg text-white font-bold tracking-wider">
            User Support
          </span>
          <div className="h-auto w-full flex flex-col items-start justify-start gap-4">
            <button onClick={closeModal} type="button">
              <Link
                href={"/help"}
                className="flex items-center justify-start gap-4 text-white"
              >
                <MdOutlineHelp className="text-white text-xl" />
                <span>Help</span>
              </Link>
            </button>
            <button onClick={closeModal} type="button">
              <Link
                href={"/resetPassword"}
                className="flex items-center justify-start gap-4 text-white"
              >
                <FaUserLock className="text-white text-xl" />
                <span>Reset Password</span>
              </Link>
            </button>
          </div>
        </div>
        <hr className="w-full" />
        <div className="h-auto w-full flex items-center justify-start px-4 py-2 rounded-b-xl">
          <button type="button">
            <Link
              onClick={closeModal}
              href={"/login"}
              className="h-8 w-full flex items-center justify-start gap-4 text-white font-medium mt-2"
            >
              <MdLogout className="text-white text-xl" />
              Sign Out
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropDownModal;