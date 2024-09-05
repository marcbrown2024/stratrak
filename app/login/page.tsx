"use client";

// react/nextjs components
import React, { ChangeEvent, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

// firebase components
import { auth, updateUserLastActivity } from "@/firebase";
import { useAuth } from "@/components/AuthProvider";

// enums
import { AlertType } from "@/enums";

// global store
import { useAlertStore } from "@/store/AlertStore";
import { signInWithEmailAndPassword } from "firebase/auth";
import useFirebaseAuth from "@/hooks/UseFirebaseAuth";

// custom components

interface FormData {
  email: string;
  password: string;
}

const initialFormData = {
  email: "",
  password: "",
};

const Page = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  useEffect(() => {
    if (user && isAuthenticated) redirect("/");
  }, [user, isAuthenticated]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const logInUser = async () => {
    const userResponse = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    return userResponse;
  };

  const {
    executeAuth: executeUserLogin,
    loading: userLoginLoading,
    error: userLoginError,
  } = useFirebaseAuth(logInUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    closeAlert();

    // Call the executeAuth function with the appropriate arguments
    const { success, result } = await executeUserLogin();

    if (success) {
      // On success, set success alert and clear form data
      setAlert(
        { title: "Welcome!", content: "User logged in successfully." },
        AlertType.Success
      );
      setFormData(initialFormData);

      // Redirect to the home page
      router.push("/");
    }
  };

  useEffect(() => {
    if (userLoginError) {
      setAlert(
        {
          title: "Something went wrong",
          content: userLoginError ?? "An unexpected error occurred.",
        },
        AlertType.Error
      );
    }
  }, [userLoginError, setAlert]);

  useEffect(() => {
    // Check if user is available and has an id
    if (user && user.userId) {
      // Call updateUserLastActivity with user.userId
      updateUserLastActivity(user.userId)
        .then((result) => {
          if (result.success) {
            console.log("User's last activity updated successfully.");
          } else {
            console.error("Failed to update user's last activity.");
          }
        })
        .catch((error) => {
          console.error("Error updating user's last activity:", error);
        });
    }
  }, [user]);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row items-center justify-center bg-[#D8E1F2] overflow-hidden">
      <div className="h-full w-full md:w-1/2 flex items-center justify-center">
        <h1 className="text-6xl md:text-9xl font-bold text-[#4E81BD]">
          Trialist
        </h1>
      </div>
      <div className="h-full w-full md:w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 bg-white p-8 border border-gray-300 rounded-xl shadow-lg"
        >
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <h2 className="text-3xl font-medium text-[#015FCC]">Sign In</h2>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-[#4E81BD]"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full text-sm text-gray-900 bg-[#F5F7FA] border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#015FCC]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-[#4E81BD]"
              >
                Your password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full text-sm text-gray-900 bg-[#F5F7FA] border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#015FCC]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-sm text-[#4E81BD]">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#015FCC] hover:underline">
                Forget Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-[#015FCC] px-5 py-2.5 rounded-lg hover:bg-[#0048A8]"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
