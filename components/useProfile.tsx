"use client";

// react components
import React, { useState } from "react";

// global states

// components

const UserProfile = () => {
  const [formButton, setFormButton] = useState(false);
  const [editrole, setEditRole] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editZipCode, setEditZipCode] = useState("");

  const [formData, setFormData] = useState({
    role: "",
    fullName: "",
    number: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const editProfile = () => {
    setFormButton(!formButton);
    setFormData({
      role: "",
      fullName: "",
      number: "",
      city: "",
      state: "",
      zipCode: "",
    });
  };

  const cancelEdit = () => {
    setFormButton(false);
    setEditRole("");
    setEditFullName("");
    setEditNumber("");
    setEditCity("");
    setEditState("");
    setEditZipCode("");
  };

  const isFormDataEmpty = () => {
    return Object.values(formData).every((value: string) => value === "");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="h-full w-full xl:w-3/6 flex flex-col items-start justify-center"
      >
        <div className="h-full w-full flex flex-col items-start justify-start gap-2 text-[15px] font-semibold">
          <div className="h-auto w-full flex items-center justify-center gap-10">
            <label
              htmlFor="role"
              className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
            >
              Role
              <input
                id="role"
                name="role"
                autoComplete="off"
                required
                onChange={(e: any) =>
                  setFormData((formData) => ({
                    ...formData,
                    role: e.target.value,
                  }))
                }
                onFocus={() => formButton && setEditRole("role")}
                readOnly={!formButton}
                className={`h-12 w-full flex flex-col items-center justify-center ${
                  formButton
                    ? "text-[#464646]"
                    : "text-[#858585] focus-within:outline-none"
                } p-4 bg-transparent border-2 border-blue-800 rounded-md`}
              />
            </label>
            <label
              htmlFor="fullName"
              className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
            >
              Full Name
              <input
                id="fullName"
                name="fullName"
                autoComplete="off"
                required
                onChange={(e: any) =>
                  setFormData((formData) => ({
                    ...formData,
                    fullName: e.target.value,
                  }))
                }
                onFocus={() => formButton && setEditFullName("fullName")}
                readOnly={!formButton}
                className={`h-12 w-full flex flex-col items-center justify-center ${
                  formButton
                    ? "text-[#464646]"
                    : "text-[#858585] focus-within:outline-none"
                } p-4 bg-transparent border-2 border-blue-800 rounded-md`}
              />
            </label>
          </div>
          <label
            htmlFor="email"
            className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
          >
            Email
            <input
              id="email"
              name="email"
              autoComplete="off"
              required
              readOnly
              className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent p-4 border-2 border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
          <label
            htmlFor="number"
            className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
          >
            Number
            <input
              id="number"
              name="number"
              autoComplete="off"
              required
              onChange={(e: any) =>
                setFormData((formData) => ({
                  ...formData,
                  number: e.target.value,
                }))
              }
              onFocus={() => formButton && setEditNumber("number")}
              readOnly={!formButton}
              className={`h-12 w-full flex flex-col items-center justify-center ${
                formButton
                  ? "text-[#464646]"
                  : "text-[#858585] focus-within:outline-none"
              } p-4 bg-transparent border-2 border-blue-800 rounded-md`}
            />
          </label>
          <label
            htmlFor="city"
            className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
          >
            City
            <input
              id="city"
              name="city"
              autoComplete="off"
              required
              onChange={(e: any) =>
                setFormData((formData) => ({
                  ...formData,
                  city: e.target.value,
                }))
              }
              onFocus={() => formButton && setEditCity("city")}
              readOnly={!formButton}
              className={`h-12 w-full flex flex-col items-center justify-center ${
                formButton
                  ? "text-[#464646]"
                  : "text-[#858585] focus-within:outline-none"
              } p-4 bg-transparent border-2 border-blue-800 rounded-md`}
            />
          </label>
          <div className="h-auto w-full flex items-center justify-center gap-10">
            <label
              htmlFor="state"
              className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
            >
              State
              <input
                id="state"
                name="state"
                autoComplete="off"
                required
                onChange={(e: any) =>
                  setFormData((formData) => ({
                    ...formData,
                    state: e.target.value,
                  }))
                }
                onFocus={() => formButton && setEditState("state")}
                readOnly={!formButton}
                className={`h-12 w-full flex flex-col items-center justify-center ${
                  formButton
                    ? "text-[#464646]"
                    : "text-[#858585] focus-within:outline-none"
                } p-4 bg-transparent border-2 border-blue-800 rounded-md`}
              />
            </label>
            <label
              htmlFor="zipCode"
              className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
            >
              Zip Code
              <input
                id="zipCode"
                name="zipCode"
                autoComplete="off"
                required
                onChange={(e: any) =>
                  setFormData((formData) => ({
                    ...formData,
                    zipCode: e.target.value,
                  }))
                }
                onFocus={() => formButton && setEditZipCode("zipCode")}
                readOnly={!formButton}
                className={`h-12 w-full flex flex-col items-center justify-center ${
                  formButton
                    ? "text-[#464646]"
                    : "text-[#858585] focus-within:outline-none"
                } p-4 bg-transparent border-2 border-blue-800 rounded-md`}
              />
            </label>
          </div>
          <label
            htmlFor="country"
            className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
          >
            Country
            <input
              id="country"
              name="country"
              value="United States"
              autoComplete="off"
              readOnly
              className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent p-4 border-2 border-blue-800 rounded-md focus-within:outline-none"
            />
          </label>
        </div>
        <div className="h-full w-full flex items-center justify-end gap-20 p-2 mt-4">
          {formButton && (
            <div
              onClick={cancelEdit}
              className="h-10 w-36 flex items-center justify-center text-blue-500 font-semibold rounded bg-zinc-200 hover:bg-[#fff] cursor-pointer"
            >
              Cancel
            </div>
          )}
          {formButton ? (
            <button
              type="submit"
              className="disabled:opacity-90 h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-500 rounded hover:bg-[#701b29]"
              disabled={isFormDataEmpty()}
            >
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={editProfile}
              className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-600 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
