"use client";

// react components
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// global states

// components
import UserProfile from "@/components/useProfile";

// assets

// icons
import { MdModeEdit } from "react-icons/md";
import { AiFillDelete, AiOutlineClose, AiTwotoneCamera } from "react-icons/ai";
import { BiSolidUserCircle } from "react-icons/bi";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();
  const [EditPopUp, setEditPopUp] = useState(false);
  const [DeletePopUp, setDeletePopUp] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const photoInputRef = React.createRef<HTMLInputElement>();
  const userPhotoUrl =
    "https://cdn-icons-png.flaticon.com/512/3237/3237472.png";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
    setEditPopUp(false);
  };

  const handleClick = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  useEffect(() => {
    const closePopupsOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (DeletePopUp === true) {
        if (!target.closest(".deletePopUp")) {
          setDeletePopUp(false);
        }
      } else {
        if (!target.closest(".editPopUp") && !target.closest(".deletePopUp")) {
          setEditPopUp(false);
        }
      }
    };
    document.addEventListener("click", closePopupsOnOutsideClick);
    return () => {
      document.removeEventListener("click", closePopupsOnOutsideClick);
    };
  }, [EditPopUp, setEditPopUp, DeletePopUp, setDeletePopUp]);

  return (
    <div className="relative h-auto w-full flex flex-col items-start xl:items-center justify-start gap-16 p-4">
      <div className="h-auto w-full flex flex-col items-center justify-center gap-4 -mb-4">
        <div className="h-auto w-full md:w-11/12 xl:w-3/6 flex items-center justify-between text-xl font-semibold bg-[#fff] px-4 py-3 rounded-lg">
          <h1>Update Profile</h1>
          <div className="flex items-center justify-center">
            <Image
              src={userPhotoUrl}
              width={50}
              height={50}
              alt=""
              priority
              className="rounded-full"
            />
          </div>
        </div>
        <div className="h-auto w-full flex items-center justify-center">
          <div className="relative h-full w-full flex items-start justify-center">
            <div className="relative h-auto w-auto flex items-start">
              <Image
                src={userPhotoUrl}
                width={120}
                height={120}
                alt=""
                priority
                className="rounded-full"
              />
              <button
                onClick={() => setEditPopUp(true)}
                className="editPopUp absolute bottom-2 right-2 h-6 w-6 flex items-center justify-center text-[#fff] bg-blue-900 rounded-full"
              >
                <MdModeEdit />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`editPopUp absolute top-[11.3rem] left-2 md:left-60 xl:left-[32%] h-96 w-[20rem] md:w-[35rem] xl:w-[41.4rem] ${
          EditPopUp ? "flex" : "hidden"
        } flex-col items-center justify-center bg-[#fff] rounded-lg border`}
      >
        <div className="h-1/6 w-full flex items-center justify-between p-8">
          <h1 className="text-lg font-semibold">Profile photo</h1>
          <AiOutlineClose
            className="text-xl cursor-pointer"
            onClick={() => setEditPopUp(false)}
          />
        </div>
        <div className="h-4/6 w-full flex items-center justify-center">
          <Image
            src={userPhotoUrl}
            width={100}
            height={100}
            alt=""
            priority
            className="h-48 w-48 rounded-full"
          />
        </div>
        <div className="h-1/6 w-full flex items-center justify-between text-sm font-semibold p-8 border">
          <div className="flex items-center justify-center gap-10">
            <button
              onClick={handleClick}
              className="flex flex-col items-center justify-center"
            >
              <AiTwotoneCamera className="text-2xl" />
              Add Photo
            </button>
            <button className="flex flex-col items-center justify-center">
              <BiSolidUserCircle className="text-2xl" />
              Default Photo
            </button>
            <label htmlFor="fileInput">
              <input
                ref={photoInputRef}
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <button
            onClick={() => setDeletePopUp(true)}
            className="deletePopUp flex flex-col items-center justify-center"
          >
            <AiFillDelete className="text-2xl" />
            Delete
          </button>
        </div>
      </div>
      <div
        className={`deletePopUp absolute top-[18rem] left-[40%] h-48 w-80 ${
          DeletePopUp ? "flex" : "hidden"
        } flex-col items-center justify-center bg-blue-500 text-[#fff] rounded-lg border`}
      >
        <div className="h-2/6 w-full flex items-center justify-between p-4">
          <h2 className="h-full w-auto flex items-center justify-end font-semibold">
            Delete profile photo
          </h2>
          <AiOutlineClose
            className="text-xl cursor-pointer"
            onClick={() => setDeletePopUp(false)}
          />
        </div>
        <p className="h-3/6 w-full flex items-start justify-start p-4">
          Are you sure? Having a profile picture helps others recognize you.
        </p>
        <div className="h-1/6 w-full flex items-center justify-end gap-6 p-4">
          <button
            onClick={() => setDeletePopUp(false)}
            className="flex items-center justify-center"
          >
            Cancel
          </button>
          <button className="flex items-center justify-center">Delete</button>
        </div>
      </div>
      <UserProfile />
    </div>
  );
};

export default Page;
