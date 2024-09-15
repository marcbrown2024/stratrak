"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";

// email components
import emailjs from "@emailjs/browser";

// global states
import { useAlertStore } from "@/store/AlertStore";

// custom components
import Loader from "@/components/Loader";

// enums
import { AlertType } from "@/enums";
import useUser from "@/hooks/UseUser";

// Initialize the state with an empty object of type HelpFormData
const initialFormData: HelpFormData = {
  subject: "",
  message: "",
};

const Page = () => {
  const {user} = useUser()

  const [formData, setFormData] = useState<HelpFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setLoading(true);

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
        },
        (error) => {
          alert = {
            title: "Error!",
            content: "Failed to send email. Try again.",
          };
          alertType = AlertType.Error;
          closeAlert();
          setAlert(alert, alertType);
        }
      )
      .finally(() => {
        setFormData(initialFormData);
        setIsSubmitted(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
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
                    value={user?.fName}
                    onChange={handleChange}
                    placeholder={user?.fName || ""}
                    readOnly
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus-within:outline-none cursor-not-allowed"
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
                    value={user?.lName}
                    onChange={handleChange}
                    placeholder={user?.lName || ""}
                    readOnly
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus-within:outline-none cursor-not-allowed"
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
                    value={user?.email}
                    onChange={handleChange}
                    placeholder={user?.email || ""}
                    readOnly
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus-within:outline-none cursor-not-allowed"
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
                    value={user?.phoneNumber}
                    onChange={handleChange}
                    placeholder={user?.phoneNumber || ""}
                    readOnly
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 rounded-md border-0 ring-1 ring-inset ring-gray-300 focus-within:outline-none cursor-not-allowed"
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
                    className="w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  />
                  {isSubmitted && !formData.subject && (
                    <span className="text-sm text-red-500 -mb-4">Required</span>
                  )}
                </label>
                <label
                  htmlFor="message"
                  className="h-60 w-full flex flex-col items-start justify-center gap-2 text-blue-800"
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
                    className="h-full w-full sm:text-sm lg:text-base sm:leading-6 bg-transparent p-2 border border-transparent rounded-md text-blue-800 ring-1 ring-inset ring-gray-300 outline-0 focus:border-gray-800 active:border-gray-800"
                  />
                  {isSubmitted && !formData.message && (
                    <span className="text-sm text-red-500 -mb-4">Required</span>
                  )}
                </label>
              </div>
              <div className="w-full flex items-center justify-end">
                <button
                  type="submit"
                  className="h-10 w-36 flex items-center justify-center text-[#fff] font-semibold bg-blue-800 rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
