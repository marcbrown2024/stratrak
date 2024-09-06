"use client";

// react/nextjs components
import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

// firebase components
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/firebase";

// global stores
import { useAlertStore } from "@/store/AlertStore";

// enums
import { AlertType } from "@/enums";

interface FormData {
  email: string;
}

const initialFormData = {
  email: "",
};

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    closeAlert();
    setLoading(true);

    try {
      // Check if the email exists in Firebase Authentication
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        formData.email
      );

      if (signInMethods.length === 0) {
        // If the email is not found, show an error alert
        setAlert(
          {
            title: "Error",
            content: "Email address not found. Please check and try again.",
          },
          AlertType.Error
        );
      } else {
        // If the email is found, send the password reset email
        await sendPasswordResetEmail(auth, formData.email);
        setAlert(
          {
            title: "Success",
            content: "Password reset email sent successfully.",
          },
          AlertType.Success
        );
        setFormData(initialFormData);
        router.push("/login");
      }
    } catch (error) {
      setAlert(
        {
          title: "Error",
          content: "An unexpected error occurred. Please try again.",
        },
        AlertType.Error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen -mt-44 w-full flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-300 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white font-medium bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
