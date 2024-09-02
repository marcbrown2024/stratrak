"use client";

// react/nextjs components
import React, { useState } from "react";

type HelpFormData = {
  subject: string;
  message: string;
};

const Page = () => {
  const [formData, setFormData] = useState<HelpFormData>({
    subject: "",
    message: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-full w-4/6 flex flex-col items-center justify-center gap-14">
        <h1 className="text-2xl md:text-4xl text-blue-800 font-bold tracking-wider">
          Technical Support
        </h1>
        <form
          onSubmit={handleSubmit}
          className="h-full w-full flex flex-col items-center justify-start gap-8 font-semibold"
        >
          <div className="h-fit w-full flex items-center justify-center gap-10">
            <label
              htmlFor="role"
              className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
            >
              Role
              <input
                id="role"
                name="role"
                autoComplete="on"
                readOnly
                className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent pl-4 border-2 border-blue-800 rounded-md focus-within:outline-none"
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
                autoComplete="on"
                readOnly
                className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent pl-4 border-2 border-blue-800 rounded-md focus-within:outline-none"
              />
            </label>
          </div>
          <div className="h-fit w-full flex items-center justify-center gap-10">
            <label
              htmlFor="email"
              className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
            >
              Email
              <input
                id="email"
                name="email"
                autoComplete="on"
                readOnly
                className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent pl-4 border-2 border-blue-800 rounded-md focus-within:outline-none"
              />
            </label>
            <label
              htmlFor="phoneNum"
              className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
            >
              Phone Number
              <input
                id="phoneNum"
                name="phoneNumber"
                autoComplete="on"
                readOnly
                className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent pl-4 border-2 border-blue-800 rounded-md focus-within:outline-none"
              />
            </label>
          </div>
          <div className="h-fit w-full flex flex-col items-center justify-center gap-10">
            <label
              htmlFor="subject"
              className="h-fit w-full flex flex-col items-start justify-center gap-2 text-blue-800"
            >
              Subject
              <input
                id="subject"
                name="subject"
                autoComplete="off"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent pl-4 border-2 border-blue-800 rounded-md focus-within:outline-none"
              />
            </label>
            <label
              htmlFor="message"
              className="h-72 w-full flex flex-col items-start justify-center gap-2 text-blue-800"
            >
              Message
              <textarea
                id="message"
                name="message"
                autoComplete="off"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="h-full w-full flex items-start justify-start text-[#858585] bg-transparent p-4 border-2 border-blue-800 rounded-md focus-within:outline-none"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={!formData.subject || !formData.message}
            className="disabled:opacity-80 h-12 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-600 rounded hover:bg-blue-700 mt-8"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
