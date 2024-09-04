"use client";

// react/nextjs components
import React, { useState } from "react";
import Image from "next/image";

// custom components
import SignatureCanvas from "@/components/SignatureCanvas";

const initialFormData: ProfileFormData = {
  photo: null,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  country: "United States",
  streetAddress: "",
  city: "",
  region: "",
  postalCode: "",
};

// firebase components
import { useAuth } from "@/components/AuthProvider";

// icons
import { MdPhotoSizeSelectActual } from "react-icons/md";

const Page = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [formButton, setFormButton] = useState<boolean>(false);
  const [signatureButton, setSignatureButton] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const isFormDataEmpty = (): boolean => {
    return Object.entries(formData).every(([key, value]) => {
      if (key === "photo") {
        return true;
      }
      if (typeof value === "string") {
        return value === "";
      }
      return value === null;
    });
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
    <div className="relative h-fit w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className={`w-4/5 xl:w-1/2 space-y-6 pb-12 ${
          signatureButton ? "blur-md" : ""
        } `}
      >
        <div className="space-y-12">
          <div className="flex flex-col gap-8 pb-8 border-b border-gray-900/10 ">
            <h1 className="text:xl md:text-3xl font-semibold leading-7 text-blue-800">
              Profile
            </h1>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="signature"
                  className="flex items-center gap-4 text-lg font-medium leading-6 text-blue-800"
                >
                  Signature
                  <button
                    onClick={() => setSignatureButton(true)}
                    className="text-xs px-2 py-1 border bg-slate-200 rounded-lg hover:scale-105"
                  >
                    Change
                  </button>
                </label>
                <div className="border rounded-lg">
                  {user && user.signature ? (
                    <Image
                      src={user.signature}
                      alt="User Signature"
                      style={{ maxWidth: "20%", height: "auto" }}
                    />
                  ) : (
                    <div>No signature available</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="profile-photo"
                  className="block text-lg font-medium leading-6 text-blue-800"
                >
                  Profile photo
                </label>
                <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="flex flex-col items-center">
                    <MdPhotoSizeSelectActual
                      size={54}
                      className="text-gray-500"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="profile-photo-upload"
                        className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 hover:text-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="profile-photo-upload"
                          name="profilePhoto"
                          type="file"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p>&nbsp;or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8 pb-10 border-b border-gray-900/10 ">
            <div className="w-full flex items-center justify-center gap-12">
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="firstName"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  First name
                </label>
                <div>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={user?.fName || "Default Name"}
                    readOnly={!formButton}
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="lastName"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Last name
                </label>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={user?.lName || "Default Name"}
                    readOnly={!formButton}
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-12">
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Email address
                </label>
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={user?.email || "Default Name"}
                    readOnly={!formButton}
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Phone Number
                </label>
                <div>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    readOnly={!formButton}
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="streetAddress"
                className="block text-lg font-medium leading-6 text-blue-800"
              >
                Street address
              </label>
              <div>
                <input
                  type="text"
                  name="streetAddress"
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  readOnly={!formButton}
                  className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-12">
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="city"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  City
                </label>
                <div>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    readOnly={!formButton}
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="region"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  State/Province
                </label>
                <div>
                  <input
                    type="text"
                    name="region"
                    id="region"
                    value={formData.region}
                    onChange={handleChange}
                    readOnly={!formButton}
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-12">
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="postalCode"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Postal code
                </label>
                <div>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    readOnly={!formButton}
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="country"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Country
                </label>
                <div>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!formButton}
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-8">
          {formButton && (
            <button
              onClick={cancelEdit}
              className="h-10 w-36 flex items-center justify-center text-blue-700 font-semibold bg-[#718096]/30 rounded-lg hover:bg-[#718096]/50"
            >
              Cancel
            </button>
          )}
          {formButton ? (
            <button
              type="submit"
              className="disabled:opacity-90 h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-500 rounded-lg hover:bg-blue-800"
              disabled={isFormDataEmpty()}
            >
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={editProfile}
              className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-800 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
      <SignatureCanvas
        signatureButton={signatureButton}
        setSignatureButton={setSignatureButton}
      />
    </div>
  );
};

export default Page;
