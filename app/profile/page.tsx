"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Image from "next/image";

// custom components
import SignatureCanvas from "@/components/SignatureCanvas";
import Loader from "@/components/Loader";

// firebase components
import { useAuth } from "@/components/AuthProvider";
import { updateUserProfile, uploadSignature } from "@/firebase";

// global components
import { useAlertStore } from "@/store/AlertStore";
import LoadingStore from "@/store/LoadingStore";

// enums
import { AlertType } from "@/enums";

// libraries
import { timeZoneToCountry } from "@/lib/countries";

// icons
import { MdPhotoSizeSelectActual } from "react-icons/md";

const initialFormData: ProfileFormData = {
  profilePhoto: "",
  fName: "",
  lName: "",
  phoneNumber: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
};

const Page = () => {
  const { user } = useAuth();
  const initialFormData: ProfileFormData = {
    profilePhoto: user?.profilePhoto,
    fName: user?.fName,
    lName: user?.lName,
    phoneNumber: user?.phoneNumber,
    streetAddress: user?.streetAddress,
    city: user?.city,
    state: user?.state,
    postalCode: user?.postalCode,
  };
  const { loading, setLoading } = LoadingStore();
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [formButton, setFormButton] = useState<boolean>(false);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const country = timeZoneToCountry[timeZone] || "Unknown";
  const [inputKey, setInputKey] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

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

  const editProfile = () => {
    setFormButton(true);
    setFormData(initialFormData);
  };

  const cancelEdit = () => {
    setFormData(initialFormData);
    setFormButton(false);
  };

  const handleSubmit = async (formData: ProfileFormData) => {
    if (!user?.userId) {
      setLoading(false);
      return;
    }

    const updatedFields: Partial<ProfileFormData> = {};

    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof ProfileFormData;
      // Check if the field has changed from the initial user data
      if (formData[fieldKey] !== user[fieldKey]) {
        updatedFields[fieldKey] = formData[fieldKey];
      }
    });

    console.log(JSON.stringify(updatedFields));

    const updateStatus = await updateUserProfile(user.userId, updatedFields);

    if (updateStatus.success) {
      setAlert(
        { title: "Success", content: "Profile updated successfully." },
        AlertType.Success
      );
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      setAlert(
        {
          title: "Error",
          content: "Failed to update profile. Please try again.",
        },
        AlertType.Error
      );
    }
  };

  const hasChanges = () => {
    const changed =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    console.log(JSON.stringify(formData));
    console.log(JSON.stringify(initialFormData));

    closeAlert();
    if (!changed) {
      console.log("No changes detected, showing info alert.");
      setAlert(
        { title: "Info", content: "No changes detected." },
        AlertType.Info
      );
    } else {
      console.log("Changes detected, submitting form.");
      handleSubmit(formData); // Form submission on change detection
    }
  };

  useEffect(() => {
    setLoading(true);
    if (user) {
      setLoading(false);
      closeAlert();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && user) {
      setTimeout(() => {
        setAlert(
          {
            title: "Notice",
            content: "To update your information, please click 'Edit Profile'.",
          },
          AlertType.Info
        );
      }, 2000);
    }
  }, [loading, user]);

  return (
    <div className="relative h-fit w-full flex flex-col items-center justify-center">
      <form className="relative w-4/5 2xl:w-1/2 space-y-6 pb-8">
        <div className="space-y-12">
          <div className="flex flex-col gap-8 pb-8 border-b border-gray-900/10 ">
            <h1 className="text:xl md:text-3xl font-semibold leading-7 text-blue-800">
              Profile
            </h1>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <label
                  htmlFor="signature"
                  className="flex items-center gap-4 text-lg font-medium leading-6 text-blue-800"
                >
                  Signature
                  <div className="w-full flex items-center justify-between">
                    <button
                      type="button"
                      disabled={!formButton}
                      // onClick={() => {
                      //   setSignatureButton(true);
                      // }}
                      className="text-xs px-2 py-1 border bg-slate-200 rounded-lg hover:scale-105"
                    >
                      Change
                    </button>
                    {/* {!signature && (
                      <button
                        type="button"
                        disabled={!formButton}
                        onClick={handleRemoveSignature}
                        className="text-xs text-white px-2 py-1 bg-red-600 border rounded-lg hover:scale-105"
                      >
                        Remove
                      </button>
                    )} */}
                  </div>
                </label>
                <div className="border rounded-lg">
                  {/* {signature !== "" ? (
                    <Image
                      width={600}
                      height={600}
                      src={signature || user?.signature}
                      alt="User Signature"
                      style={{ maxWidth: "50%", height: "auto" }}
                    />
                  ) : (
                    <div className="p-2">No signature available</div>
                  )} */}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="profile-photo"
                className="flex items-center justify-between text-lg font-medium leading-6 text-blue-800"
              >
                <div className="flex items-center justify-center">
                  Profile photo
                  <span className="text-sm">
                    &nbsp;{selectedFile && "- " + selectedFile}
                  </span>
                </div>
                {(selectedFile || user?.profilePhoto !== "") && (
                  <button
                    type="button"
                    disabled={!formButton}
                    onClick={handleRemoveFile}
                    className="text-xs text-white px-2 py-1 bg-red-600 border rounded-lg hover:scale-105"
                  >
                    Remove
                  </button>
                )}
              </label>
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
                      <span>Upload a file</span>
                      <input
                        id="profilePhoto"
                        name="profilePhoto"
                        type={formButton ? "file" : "text"}
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
          <div className="flex flex-col gap-8 pb-10 border-b border-gray-900/10 ">
            <div className="w-full flex items-center justify-center gap-12">
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="fName"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  First name
                </label>
                <div>
                  <input
                    type="text"
                    name="fName"
                    id="fName"
                    onChange={handleChange}
                    value={user?.fName}
                    readOnly={!formButton}
                    className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                      !formButton ? "border-0" : "cursor-text"
                    }`}
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="lName"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  Last name
                </label>
                <div>
                  <input
                    type="text"
                    name="lName"
                    id="lName"
                    onChange={handleChange}
                    value={user?.lName}
                    readOnly={!formButton}
                    className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                      !formButton ? "border-0" : "cursor-text"
                    }`}
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
                    onChange={handleChange}
                    value={user?.email}
                    readOnly
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus-within:outline-none cursor-not-allowed"
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
                    onChange={handleChange}
                    value={user?.phoneNumber}
                    readOnly={!formButton}
                    className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                      !formButton ? "border-0" : "cursor-text"
                    }`}
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
                  onChange={handleChange}
                  value={user?.streetAddress}
                  readOnly={!formButton}
                  className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                    !formButton ? "border-0" : "cursor-text"
                  }`}
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
                    onChange={handleChange}
                    value={user?.city}
                    readOnly={!formButton}
                    className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                      !formButton ? "border-0" : "cursor-text"
                    }`}
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="state"
                  className="text-lg font-medium leading-6 text-blue-800"
                >
                  State/Province
                </label>
                <div>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    onChange={handleChange}
                    value={user?.state}
                    readOnly={!formButton}
                    className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                      !formButton ? "border-0" : "cursor-text"
                    }`}
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
                    onChange={handleChange}
                    value={user?.postalCode}
                    readOnly={!formButton}
                    className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                      !formButton ? "border-0" : "cursor-text"
                    }`}
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
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={country}
                  readOnly
                  className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus-within:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="w-4/5 2xl:w-1/2 flex items-center justify-end pb-6">
        {formButton && (
          <div className="flex items-center justify-end gap-8">
            <button
              type="button"
              // onClick={handleSubmit}
              onClick={hasChanges}
              className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-800 rounded-lg hover:bg-blue-700 hover:scale-x-95"
            >
              Save Changes
            </button>
            <button
              onClick={cancelEdit}
              className="h-10 w-36 flex items-center justify-center text-blue-700 font-semibold bg-[#718096]/30 rounded-lg hover:bg-[#718096]/50 hover:scale-x-95"
            >
              Cancel
            </button>
          </div>
        )}
        {!formButton && (
          <button
            type="button"
            onClick={editProfile}
            className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-800 rounded-lg hover:bg-blue-700 hover:scale-x-95"
          >
            Edit Profile
          </button>
        )}
      </div>
      {/* <SignatureCanvas
        signatureButton={signatureButton}
        setSignatureButton={setSignatureButton}
        setSignature={setSignature}
        setSignatureChanged={setSignatureChanged}
      /> */}
    </div>
  );
};

export default Page;