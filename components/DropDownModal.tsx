"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// zustand stores
import { useModalStore } from "@/store/DropDownModalStore";

// firebase components
import { getOrganizationName } from "@/firebase";

// Icons
import { AiOutlineClose } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { FaUserLock } from "react-icons/fa6";
import { MdOutlineHelp } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import useUser from "@/hooks/UseUser";

const DropDownModal = () => {
  const { user } = useUser();
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const { isModalOpen, closeModal } = useModalStore();
  const handleSignOut = () => {
    signOut(auth);
    closeModal();
  };

  useEffect(() => {
    const fetchOrganizationName = async () => {
      if (user && user.orgId) {
        try {
          const name = await getOrganizationName(user.orgId);
          setOrganizationName(name);
        } catch (error) {
          setOrganizationName(null);
        }
      } else {
        setOrganizationName(null);
      }
    };

    fetchOrganizationName();
  }, [user]);

  return (
    <div
      className={`Popup fixed top-12 right-2 2xl:h-[26rem] 2xl:w-[22rem] hidden md:flex flex-col items-center  ${
        isModalOpen ? "visible opacity-100" : "invisible opacity-0"
      } bg-[#fffefe] rounded-2xl mr-8 pt-2 border z-50 transition-all duration-100 ease-in-out`}
    >
      <div className="h-1/2 w-full flex flex-col items-center justify-center gap-4 text-gray-700 p-4">
        <div className="h-auto w-full flex items-center justify-between">
          <span className="text-lg  font-bold tracking-wider">
            User Acount
          </span>
          <button
            onClick={closeModal}
            className="flex items-center justify-center"
          >
            <AiOutlineClose className="text-xl  cursor-pointer" />
          </button>
        </div>
        <div className="h-auto w-full flex items-center justify-start gap-6">
          <Image
            width={50}
            height={50}
            src={
              user?.profilePhoto
                ? user?.profilePhoto
                : "/images/profile_user_avatar.png"
            }
            alt="Profile Photo"
            className="h-16 w-16 rounded-full border"
          />
          <div className="flex flex-col items-start justify-start gap-1 text-sm 2xl:text-[14px] font-semibold">
            <p className="">{user?.fName + " " + user?.lName}</p>
            <p className="">{user?.email}</p>
            <p className="">{organizationName}</p>
          </div>
        </div>
        <Link
          onClick={closeModal}
          href={"/profile"}
          className="w-full flex items-center justify-center font-semibold p-1 rounded-2xl border border-gray-500"
        >
          View Profile
        </Link>
      </div>
      <div className="h-1/2 w-full bg-[#1286ff] rounded-b-2xl">
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
          <button
            type="button"
            onClick={handleSignOut}
            className="h-8 w-full flex items-center justify-start gap-4 text-white font-medium mt-2"
          >
            <MdLogout className="text-white text-xl" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropDownModal;
