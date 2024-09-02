"use client";

// react components
import React, { useEffect, useState } from "react";
import Image from "next/image";

// components
import UserProfile from "@/components/useProfile";

// icons
import { MdModeEdit } from "react-icons/md";
import { AiFillDelete, AiOutlineClose, AiTwotoneCamera } from "react-icons/ai";
import { BiSolidUserCircle } from "react-icons/bi";

type ProfileFormData = {
  role: string;
  fullName: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
};

const initialFormData: ProfileFormData = {
  role: "",
  fullName: "",
  number: "",
  city: "",
  state: "",
  zipCode: "",
};

const Page = () => {
  const [formButton, setFormButton] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const userPhotoUrl =
    "https://cdn-icons-png.flaticon.com/512/3237/3237472.png";

  const isFormDataEmpty = (): boolean => {
    return Object.values(formData).every((value: string) => value === "");
  };

  const editProfile = () => {
    setFormButton(!formButton);
    setFormData(initialFormData);
  };

  const cancelEdit = () => {
    setFormButton(!formButton);
    setFormData(initialFormData);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      <div className="w-11/12 md:w-3/5 flex items-center justify-between bg-blue-500 px-4 md:px-8 py-4 rounded-lg">
        <h1 className="text-lg md:text-[22px] text-white font-semibold">
          Update Profile
        </h1>
        <div className="flex items-center justify-center bg-white p-[2px] rounded-full">
          <Image
            src={userPhotoUrl}
            width={40}
            height={40}
            alt="profile photo"
            className="rounded-full"
          />
        </div>
      </div>
      <div className="relative w-fit flex items-center justify-center">
        <Image
          src={userPhotoUrl}
          width={50}
          height={50}
          alt="profile photo"
          priority
          className="w-20 h-20 sm:w-28 sm:h-28  rounded-full"
        />
        <button className="editPopUp absolute bottom-2 right-2 h-6 w-6 flex items-center justify-center text-[#fff] bg-black rounded-full">
          <MdModeEdit />
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-11/12 md:w-3/5 flex flex-col items-center justify-start gap-8 font-semibold mt-4"
      >
        <div className="w-full flex items-center justify-center gap-10">
          <label
            htmlFor="firstName"
            className="w-1/2 flex flex-col gap-2 text-blue-800"
          >
            First Name
            <input
              id="firstName"
              name="firstName"
              autoComplete="off"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
          <label
            htmlFor="lastName"
            className="w-1/2 flex flex-col gap-2 text-blue-800"
          >
            Last Name
            <input
              id="lastName"
              name="lastName"
              autoComplete="off"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
        </div>
        <div className="w-full flex items-center justify-center gap-10">
          <label
            htmlFor="email"
            className="w-1/2 flex flex-col gap-2 text-blue-800"
          >
            Email
            <input
              id="email"
              name="email"
              autoComplete="on"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
          <label
            htmlFor="phoneNum"
            className="w-1/2 flex flex-col gap-2 text-blue-800"
          >
            Phone Number
            <input
              id="phoneNum"
              name="phoneNumber"
              autoComplete="on"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
        </div>
        <div className="w-full flex items-center justify-center gap-10">
          <label
            htmlFor="company"
            className="w-full flex flex-col gap-2 text-blue-800"
          >
            Company
            <input
              id="company"
              name="company"
              autoComplete="on"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
        </div>
        <div className="w-full flex items-center justify-center gap-10">
          <label
            htmlFor="streetAddress"
            className="w-full flex flex-col gap-2 text-blue-800"
          >
            Street Address
            <input
              id="streetAddress"
              name="streetAddress"
              autoComplete="on"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
        </div>
        <div className="w-full flex items-center justify-center gap-10">
          <label
            htmlFor="streetAddress2"
            className="w-full flex flex-col gap-2 text-blue-800"
          >
            Street Address 2
            <input
              id="streetAddress2"
              name="streetAddress2"
              autoComplete="on"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
        </div>
        <div className="w-full flex items-center justify-center gap-10">
          <label
            htmlFor="city"
            className="w-1/2 flex flex-col gap-2 text-blue-800"
          >
            City
            <input
              id="city"
              name="city"
              autoComplete="on"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
          <label
            htmlFor="state"
            className="w-1/2 flex flex-col gap-2 text-blue-800"
          >
            State
            <input
              id="state"
              name="state"
              autoComplete="on"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
        </div>
        <div className="w-full flex items-center justify-center gap-10">
          <label
            htmlFor="postalCode"
            className="w-1/2 flex flex-col gap-2 text-blue-800"
          >
            Postal/Zip Code
            <input
              id="postalCode"
              name="postalCode"
              autoComplete="on"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
          <label
            htmlFor="country"
            className="w-1/2 flex flex-col gap-2 text-blue-800"
          >
            Country
            <input
              id="country"
              name="country"
              autoComplete="on"
              required
              readOnly={!formButton}
              className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
        </div>
        <div className="h-full w-full flex items-center justify-end gap-20 p-2 mt-4">
          {formButton && (
            <button
              onClick={cancelEdit}
              className="h-10 w-36 flex items-center justify-center text-blue-700 font-semibold bg-[#718096]/30 rounded hover:bg-[#718096]/50"
            >
              Cancel
            </button>
          )}
          {formButton ? (
            <button
              type="submit"
              className="disabled:opacity-90 h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-500 rounded hover:bg-blue-800"
              disabled={isFormDataEmpty()}
            >
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={editProfile}
              className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-800 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Page;
