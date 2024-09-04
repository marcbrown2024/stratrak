"use client";

import React, { useState } from "react";

const initialFormData: ProfileFormData = {
  signature: "",
  photo: null,
  firstName: "",
  lastName: "",
  email: "",
  country: "United States",
  streetAddress: "",
  city: "",
  region: "",
  postalCode: "",
};

import { FaCircleUser } from "react-icons/fa6";

const Page = () => {
  // State to hold form data
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : null,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Add form submission logic here
  };

  return (
    <div className="h-fit w-full flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-1/2">
        <div className="space-y-12">
          <div className="flex flex-col gap-8 pb-10 border-b border-gray-900/10 ">
            <h1 className="text:xl md:text-3xl font-semibold leading-7 text-blue-800">
              Profile
            </h1>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="signature"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Signature
                </label>
                <input
                  type="text"
                  name="signature"
                  id="signature"
                  value={formData.signature}
                  onChange={handleChange}
                  className="w-full sm:text-sm lg:text-base sm:leading-6 p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="photo"
                  className="block text-lg font-medium leading-6 text-blue-800"
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3 border">
                  <FaCircleUser size={36} className="text-gray-500" />
                  <button
                    type="button"
                    onClick={() => document.getElementById("photo")?.click()}
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-blue-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <input
                      type="file"
                      name="photo"
                      id="photo"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;

// <label
// htmlFor="streetAddress"
// className="w-full flex flex-col gap-2 text-blue-800"
// >
// Street Address
// <input
//   id="streetAddress"
//   name="streetAddress"
//   autoComplete="on"
//   required
//   readOnly={!formButton}
//   className="h-10 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
// />
// </label>

// {formButton && (
//   <button
//     onClick={cancelEdit}
//     className="h-10 w-36 flex items-center justify-center text-blue-700 font-semibold bg-[#718096]/30 rounded hover:bg-[#718096]/50"
//   >
//     Cancel
//   </button>
// )}
// {formButton ? (
//   <button
//     type="submit"
//     className="disabled:opacity-90 h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-500 rounded hover:bg-blue-800"
//     disabled={isFormDataEmpty()}
//   >
//     Save Changes
//   </button>
// ) : (
//   <button
//     type="button"
//     onClick={editProfile}
//     className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-800 rounded hover:bg-blue-700"
//   >
//     Edit Profile
//   </button>
// )}

// const [formButton, setFormButton] = useState<boolean>(false);
