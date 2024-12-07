"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// global stores
import { useModalStore } from "@/store/DropDownModalStore";
import useNotificationStore from "@/store/NotificationStore";

// firebase components
import { getOrganizationName } from "@/firebase";

// custom hooks
import useUser from "@/hooks/UseUser";

// Icons
import { AiOutlineClose } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { FaUserLock } from "react-icons/fa6";
import { MdOutlineHelp } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

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

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="Popup fixed top-16 right-4 h-[22rem] w-80 flex flex-col items-center bg-[#fffefe] rounded-2xl border z-50 transition-all duration-100 ease-in-out">
      <div className="h-1/2 w-full flex flex-col items-center justify-center gap-4 text-gray-700 p-4">
        <div className="h-auto w-full flex items-center justify-between">
          <span className="font-bold tracking-wider">User Acount</span>
          <button
            onClick={closeModal}
            className="flex items-center justify-center"
          >
            <AiOutlineClose className="text-lg cursor-pointer" />
          </button>
        </div>
        <div className="h-auto w-full flex items-center justify-start gap-4">
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
          <div className="flex flex-col items-start justify-start gap-1 text-[13px] font-semibold">
            <p className="">{user?.fName + " " + user?.lName}</p>
            <p className="">{user?.email}</p>
            <p className="text-wrap">{organizationName}</p>
          </div>
        </div>
        <Link
          onClick={closeModal}
          href={"/profile"}
          className="w-full flex items-center justify-center text-sm font-semibold p-1 rounded-2xl border border-gray-300 hover:bg-gray-100 hover:scale-[98%]"
        >
          View Profile
        </Link>
      </div>
      <div className="h-1/2 w-full bg-[#1286ff] rounded-b-2xl">
        <div className="h-auto w-full flex flex-col items-start justify-center gap-4 mx-4 my-2">
          <span className="text-white font-bold tracking-wider">
            User Support
          </span>
          <div className="h-auto w-full flex flex-col items-start justify-start gap-4">
            <button onClick={closeModal} type="button">
              <Link
                href={"/help"}
                className="flex items-center justify-start gap-4 text-white hover:scale-[98%]"
              >
                <MdOutlineHelp className="text-white text-xl" />
                <span>Help</span>
              </Link>
            </button>
            <button onClick={closeModal} type="button">
              <Link
                href={"/resetPassword"}
                className="flex items-center justify-start gap-4 text-white hover:scale-[98%]"
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
            className="h-8 w-full flex items-center justify-start gap-4 text-white font-medium hover:scale-[98%]"
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
