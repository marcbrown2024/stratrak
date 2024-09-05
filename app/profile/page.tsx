"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Image from "next/image";

// custom components
import SignatureCanvas from "@/components/SignatureCanvas";
import Loader from "@/components/Loader";

// firebase components
import { useAuth } from "@/components/AuthProvider";
import { updateUserProfile } from "@/firebase";

// global components
import { useAlertStore } from "@/store/AlertStore";

// enums
import { AlertType } from "@/enums";

// libraries
import { timeZoneToCountry } from "@/lib/countries";

const initialFormData: ProfileFormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  country: "United States",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
};

const Page = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [formButton, setFormButton] = useState<boolean>(false);
  const [signatureButton, setSignatureButton] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureDone, setSignatureDone] = useState<boolean>(false);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const country = timeZoneToCountry[timeZone] || "Unknown";
  const [loading, setLoading] = useState<Boolean>(true);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  useEffect(() => {
    if (signatureDone) {
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  }, [signatureDone]);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [user]);

  const updateSignature = () => {
    setSignatureDone(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.userId) {
      setLoading(false);
      return;
    }

    try {
      await updateUserProfile(user.userId, formData);
      setAlert(
        { title: "Success", content: "Profile updated successfully." },
        AlertType.Success
      );
      setFormData(initialFormData);
    } catch (error: any) {
      setAlert(
        {
          title: "Error",
          content: "Failed to update profile. Please try again.",
        },
        AlertType.Error
      );
    } finally {
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  };
  return (
    <>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="relative h-fit w-full flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className={`relative w-4/5 2xl:w-1/2 space-y-6 pb-8 ${
              signatureButton ? "blur-md" : ""
            } `}
          >
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
                      <button
                        type="button"
                        onClick={() => {
                          setSignatureButton(true);
                          closeAlert();
                        }}
                        className="text-xs px-2 py-1 border bg-slate-200 rounded-lg hover:scale-105"
                      >
                        Change
                      </button>
                    </label>
                    <div className="border rounded-lg">
                      {user && user.signature ? (
                        <Image
                          width={600}
                          height={600}
                          src={user.signature}
                          alt="User Signature"
                          style={{ maxWidth: "50%", height: "auto" }}
                        />
                      ) : (
                        <div>No signature available</div>
                      )}
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
                        placeholder={user?.fName || ""}
                        readOnly={!formButton}
                        className={`w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800 ${
                          !formButton ? "border-0" : "cursor-text"
                        }`}
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
                        placeholder={user?.lName || ""}
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
                        placeholder={user?.email || ""}
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
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder={user?.phoneNumber || ""}
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
                      value={formData.streetAddress}
                      onChange={handleChange}
                      placeholder={user?.streetAddress || ""}
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
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={user?.city || ""}
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
                        value={formData.state}
                        onChange={handleChange}
                        placeholder={user?.state || ""}
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
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder={user?.postalCode || ""}
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
                      placeholder={country}
                      readOnly
                      className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus-within:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
            {formButton && (
              <button
                type="submit"
                className="absolute right-0 -bottom-10 disabled:opacity-90 h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-500 rounded-lg hover:bg-blue-800"
                disabled={isFormDataEmpty()}
              >
                Save Changes
              </button>
            )}
          </form>
          <div
            className={`w-2/4 ${
              signatureButton ? "hidden" : "flex"
            } items-center justify-end pb-8`}
          >
            {formButton && (
              <button
                onClick={cancelEdit}
                className="h-10 w-36 flex items-center justify-center text-blue-700 font-semibold bg-[#718096]/30 mr-48 rounded-lg hover:bg-[#718096]/50"
              >
                Cancel
              </button>
            )}
            {!formButton && (
              <button
                type="button"
                onClick={editProfile}
                className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-800 rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
          <SignatureCanvas
            signatureButton={signatureButton}
            setSignatureButton={setSignatureButton}
            updateSignature={updateSignature}
          />
        </div>
      )}
    </>
  );
};

export default Page;
