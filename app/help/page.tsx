"use client";

// react/nextjs components
import React, { useState } from "react";

// email components
import emailjs from "@emailjs/browser";

// global states
import { useAlertStore } from "@/store/AlertStore";

// enums
import { AlertType } from "@/enums";

// Initialize the state with an empty object of type HelpFormData
const initialFormData: HelpFormData = {
  subject: "",
  message: "",
};

const Page = () => {
  const [formData, setFormData] = useState<HelpFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [setAlert] = useAlertStore((state) => [state.setAlert]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (!formData.subject || !formData.message) {
      setIsSubmitted(false);
      return;
    }

    // Get form data
    const form = event.currentTarget;

    // alert the user
    let alert: { title: string; content: string };
    let alertType: AlertType;

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_KEY || "",
        form,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
      )
      .then(
        (result) => {
          alert = {
            title: "Success!",
            content: "Email was sent successfully.",
          };
          alertType = AlertType.Success;
          setAlert(alert, alertType);
          console.log(result.text);
        },
        (error) => {
          alert = {
            title: "Error!",
            content: "Failed to send email. Try again.",
          };
          alertType = AlertType.Error;
          setAlert(alert, alertType);
          console.log(error.text);
        }
      )
      .finally(() => {
        setFormData(initialFormData);
        setIsSubmitted(false);
      });
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-full w-4/6 flex flex-col items-center justify-center gap-12">
        <h1 className="text-2xl md:text-4xl text-blue-800 font-bold tracking-wider">
          Technical Support
        </h1>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="h-full w-full flex flex-col items-center justify-start gap-8 font-semibold"
        >
          <div className="h-fit w-full flex items-center justify-center gap-10">
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
                readOnly
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
                readOnly
                className="h-12 w-full text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
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
                className="h-12 w-full flex flex-col items-center justify-center text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
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
                className="h-12 w-full flex flex-col items-center justify-center text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-none"
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
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="h-12 w-full flex flex-col items-center justify-center text-blue-800 bg-transparent pl-4 border border-blue-800 rounded-md focus-within:outline-blue-600"
              />
              {isSubmitted && !formData.subject && (
                <span className="text-sm text-red-500 -mb-4">Required</span>
              )}
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
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="h-full w-full flex items-start justify-start text-blue-800 bg-transparent p-4 border border-blue-800 rounded-md focus-within:outline-blue-600"
              />
              {isSubmitted && !formData.message && (
                <span className="text-sm text-red-500 -mb-4">Required</span>
              )}
            </label>
          </div>
          <div className="w-full flex items-center justify-end">
            <button
              type="submit"
              className="h-12 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-600 rounded hover:bg-blue-700 hover:scale-95"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
