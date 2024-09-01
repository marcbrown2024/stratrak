"use client";

// react components
import React, { useRef, useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Get form data
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Create an object from form data
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    setFormData({
      subject: "",
      message: "",
    });
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-full w-4/6 flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold tracking-wider">Help</h1>
        <form
          id="help"
          onSubmit={handleSubmit}
          ref={form}
          className="h-full w-11/12 flex flex-col items-center justify-start gap-8 text-[14px] font-semibold"
        >
          <div className="h-auto w-full flex items-center justify-center gap-10">
            <label
              htmlFor="title"
              className="h-auto w-full flex flex-col items-start justify-center"
            >
              Title
              <input
                id="title"
                name="title"
                autoComplete="on"
                readOnly
                className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent pl-4 border rounded-md focus-within:outline-none"
              />
            </label>
            <label
              htmlFor="fullName"
              className="h-auto w-full flex flex-col items-start justify-center"
            >
              Full Name
              <input
                id="fullName"
                name="fullName"
                autoComplete="on"
                readOnly
                className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent pl-4 border rounded-md focus-within:outline-none"
              />
            </label>
          </div>
          <div className="h-auto w-full flex items-center justify-center gap-10">
            <label
              htmlFor="email"
              className="h-auto w-full flex flex-col items-start justify-center"
            >
              Email
              <input
                id="email"
                name="email"
                autoComplete="on"
                readOnly
                className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent pl-4 border rounded-md focus-within:outline-none"
              />
            </label>
            <label
              htmlFor="phoneNum"
              className="h-auto w-full flex flex-col items-start justify-center"
            >
              Phone Number
              <input
                id="phoneNum"
                name="phoneNumber"
                autoComplete="on"
                readOnly
                className="h-12 w-full flex flex-col items-center justify-center text-[#858585] bg-transparent pl-4 border rounded-md focus-within:outline-none"
              />
            </label>
          </div>
          <label
            htmlFor="subject"
            className="h-auto w-full flex flex-col items-start justify-center"
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
              className="h-12 w-full flex flex-col items-center justify-center bg-transparent pl-4 border rounded-md"
            />
          </label>
          <label
            htmlFor="message"
            className="h-3/6 w-full flex flex-col items-start justify-center"
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
              className="h-full w-full flex items-start justify-start border rounded-md p-4 bg-transparent"
            />
          </label>
          <button
            type="submit"
            className="disabled:opacity-80 h-12 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-600 rounded hover:bg-blue-700 mt-8"
            disabled={!formData.subject || !formData.message}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
