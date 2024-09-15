"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Image from "next/image";

// custom components
import SignatureCanvas from "@/components/SignatureCanvas";
import Loader from "@/components/Loader";

// firebase components
import { updateUserProfile, uploadSignature } from "@/firebase";

// global components
import { useAlertStore } from "@/store/AlertStore";
import LoadingStore from "@/store/LoadingStore";

// enums
import { AlertType } from "@/enums";

// libraries
import { timeZoneToCountry } from "@/lib/countries";

// constant
import { blankImage } from "@/constants";

// icons
import { MdPhotoSizeSelectActual } from "react-icons/md";
import useUser from "@/hooks/UseUser";

const Page = () => {
  const {user} = useUser()
  const initialFormData: ProfileFormData = {
    profilePhoto: user?.profilePhoto ?? "",
    fName: user?.fName ?? "",
    lName: user?.lName ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    streetAddress: user?.streetAddress ?? "",
    city: user?.city ?? "",
    state: user?.state ?? "",
    postalCode: user?.postalCode ?? "",
  };

  const { setLoading } = LoadingStore();
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const country = timeZoneToCountry[timeZone] || "Unknown";
  const [inputKey, setInputKey] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [signatureButton, setSignatureButton] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");

  const [setAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file.name); // Store the selected file in the state

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;

        setFormData((prevState) => ({
          ...prevState,
          profilePhoto: base64String, // Store the base64 string
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile("");
    setFormData((prevState) => ({
      ...prevState,
      profilePhoto: "",
    }));
    setInputKey((prevKey) => prevKey + 1);
  };

  const RemoveSignature = async () => {
    setSignature(blankImage);
    if (user?.id) {
      await uploadSignature(user?.id, blankImage);
    }
  };

  const informUser = async () => {
    setAlert(
      {
        title: "Notice",
        content: "To update your information, please click 'Edit Profile'.",
      },
      AlertType.Info
    );
  };

  const handleInputClick = () => {
    if (!isEditing) {
      informUser();
    }
  };

  const cancelEdit = async () => {
    setIsEditing(false);
    setFormData(initialFormData);
    handleRemoveFile();
    setSignature(user?.signature ?? "");
    if (user?.id) {
      await uploadSignature(user?.id, user.signature);
    }
  };

  const handleEditStatus = async () => {
    setIsEditing(true);
    setTimeout(() => {
      // Scroll to the bottom of the page when the component mounts
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth", // Use smooth scrolling
      });
    }, 1000);
  };

  useEffect(() => {
    setLoading(true);
    if (user) {
      setFormData(initialFormData);
      setSignature(user.signature);
      setLoading(false);
    }
  }, [user]);

  const handleSubmitForm = async () => {
    if (!user?.userId) {
      setLoading(false);
      return;
    }
    const updatedFields: Partial<ProfileFormData> = {};

    let fieldsChanged = false; // Changed to a mutable variable

    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof ProfileFormData;
      // Check if the field has changed from the initial user data
      if (formData[fieldKey] !== initialFormData[fieldKey]) {
        updatedFields[fieldKey] = formData[fieldKey];
        fieldsChanged = true; // Set to true if any field has changed
      }
    });

    if (!fieldsChanged && signature == user.signature) {
      setAlert(
        {
          title: "Notice",
          content: "No changes to update.",
        },
        AlertType.Info
      );
      return;
    }

    try {
      const updateStatus = await updateUserProfile(user.userId, formData);
      if (updateStatus.success) {
        setAlert(
          { title: "Success", content: "Profile updated successfully." },
          AlertType.Success
        );
        setIsEditing(false);
      } else {
        setAlert(
          {
            title: "Error",
            content: "Failed to update profile. Please try again.",
          },
          AlertType.Error
        );
      }
    } catch (e) {
      setAlert(
        {
          title: "Error",
          content: "An unexpected error occurred. Please try again.",
        },
        AlertType.Error
      );
    }
  };

  return (
    <div className="relative h-fit w-full flex flex-col items-center justify-center">
      <form className="relative w-4/5 2xl:w-1/2 space-y-6 pb-8">
        <div className="space-y-12">
          <div className="flex flex-col gap-8 pb-8 border-b border-gray-900/10 ">
            <div className="flex items-center justify-between gap-8">
              <h1 className="text:xl md:text-3xl font-semibold leading-7 text-blue-800">
                Profile
              </h1>
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEditStatus}
                  className="text-white text-sm px-2 py-1 border bg-blue-700 rounded-xl hover:scale-105"
                >
                  Edit Profile
                </button>
              )}
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 text-lg font-medium leading-6 text-blue-800">
                  Signature
                  <div className="w-full flex items-center justify-between">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={
                          isEditing
                            ? () => setSignatureButton(true)
                            : () => informUser()
                        }
                        className="text-xs px-2 py-1 border bg-slate-200 rounded-lg hover:scale-105"
                      >
                        {signature != blankImage ? "Change" : "Set up"}
                      </button>
                    )}
                    {signature != blankImage && isEditing && (
                      <button
                        type="button"
                        disabled={!isEditing}
                        onClick={RemoveSignature}
                        className="text-xs text-white px-2 py-1 bg-red-600 border rounded-lg hover:scale-105"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="border rounded-lg">
                  {signature !== blankImage && signature !== "" ? (
                    <Image
                      width={600}
                      height={600}
                      src={signature || blankImage}
                      alt="User Signature"
                      style={{ maxWidth: "50%", height: "auto" }}
                    />
                  ) : (
                    <div className="p-2">No signature available</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-lg font-medium leading-6 text-blue-800">
                <div className="flex items-center justify-center">
                  Profile photo
                  <span className="text-sm">
                    &nbsp;{selectedFile && "- " + selectedFile}
                  </span>
                </div>
                {formData.profilePhoto != "" && isEditing && (
                  <button
                    type="button"
                    disabled={!isEditing}
                    onClick={handleRemoveFile}
                    className="text-xs text-white px-2 py-1 bg-red-600 border rounded-lg hover:scale-105"
                  >
                    {user?.profilePhoto ? "Remove Profile Photo" : "Remove"}
                  </button>
                )}
              </div>
              <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="flex flex-col items-center">
                  <MdPhotoSizeSelectActual
                    size={54}
                    className="text-gray-500"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="profilePhoto"
                      className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 hover:text-blue-500"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (!isEditing) {
                            informUser();
                          }
                          document.getElementById("profilePhoto")?.click();
                        }}
                        className={`${!isEditing && "cursor-default"}`}
                      >
                        Upload a file
                      </button>
                      <input
                        id="profilePhoto"
                        name="profilePhoto"
                        type={isEditing ? "file" : "text"}
                        onChange={handleFileChange}
                        className="sr-only"
                        key={inputKey} // Key that changes when the file is removed
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
          <div className="flex flex-col gap-8 pb-8 border-b border-gray-900/10 ">
            <div className="w-full flex items-center justify-center gap-12">
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="fName"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="fName"
                  name="fName"
                  autoComplete="false"
                  onClick={handleInputClick}
                  value={formData.fName || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                    !isEditing ? "border-0 text-gray-400" : "cursor-text"
                  }`}
                />
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="lName"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lName"
                  name="lName"
                  autoComplete="false"
                  onClick={handleInputClick}
                  value={formData.lName || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                    !isEditing ? "border-0 text-gray-400" : "cursor-text"
                  }`}
                />
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
                    autoComplete="false"
                    value={user?.email || ""}
                    readOnly
                    className="w-full sm:text-sm lg:text-base text-gray-400 sm:leading-6 bg-transparent p-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus-within:outline-none cursor-not-allowed"
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
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  autoComplete="false"
                  onClick={handleInputClick}
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                    !isEditing ? "border-0 text-gray-400" : "cursor-text"
                  }`}
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="streetAddress"
                className="text-lg font-medium leading-6 text-blue-800"
              >
                Street Address
              </label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                autoComplete="false"
                onClick={handleInputClick}
                value={formData.streetAddress || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                  !isEditing ? "border-0 text-gray-400" : "cursor-text"
                }`}
              />
            </div>
            <div className="w-full flex items-center justify-center gap-12">
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="city"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  autoComplete="false"
                  onClick={handleInputClick}
                  value={formData.city || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                    !isEditing ? "border-0 text-gray-400" : "cursor-text"
                  }`}
                />
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="state"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  autoComplete="false"
                  onClick={handleInputClick}
                  value={formData.state || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                    !isEditing ? "border-0 text-gray-400" : "cursor-text"
                  }`}
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-12">
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="postalCode"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  autoComplete="false"
                  onClick={handleInputClick}
                  value={formData.postalCode || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                    !isEditing ? "border-0 text-gray-400" : "cursor-text"
                  }`}
                />
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="country"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  autoComplete="false"
                  value={country || ""}
                  readOnly
                  className="w-full sm:text-sm lg:text-base text-gray-400 sm:leading-6 bg-transparent p-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus-within:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="w-4/5 2xl:w-1/2 flex items-center justify-end pb-8">
        {isEditing && (
          <div className="h-full w-full flex items-center justify-end gap-8">
            <button
              type="button"
              onClick={handleSubmitForm}
              className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-800 rounded-lg hover:bg-blue-700 hover:scale-x-95"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-[#a33020] rounded-lg hover:bg-[#8d372b] hover:scale-x-95"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <SignatureCanvas
        setSignatureButton={setSignatureButton}
        signatureButton={signatureButton}
        setSignature={setSignature}
      />
    </div>
  );
};

export default Page;
