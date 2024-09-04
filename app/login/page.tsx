"use client";

// react/nextjs components
import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/firebase'
import { AlertType } from "@/enums";
import { useAlertStore } from "@/store/AlertStore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
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
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  // const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const logInUser = async () => {
    const userResponse = await signInWithEmailAndPassword(auth, formData.email, formData.password)
    return userResponse
  }

  const { executeAuth: executeUserLogin, loading: userLoginLoading, error: userLoginError } = useFirebaseAuth(logInUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    closeAlert()
  
    // Call the executeAuth function with the appropriate arguments
    const { success } = await executeUserLogin();

    if (success) {
      // On success, set success alert and clear form data
      setAlert({ title: "Welcome!", content: "User logged in successfully." }, AlertType.Success);
      setFormData(initialFormData);
      router.push('/');
    }

  };

  useEffect(() => {
    if (userLoginError) {
      setAlert({ title: "Something went wrong", content: userLoginError ?? "An unexpected error occurred." }, AlertType.Error);
    }
  }, [userLoginError, setAlert])  

  return (
    <div className="h-screen w-full flex flex-col md:flex-row items-center justify-center bg-[#e0e3e4] overflow-hidden">
      <div className="h-full w-full md:w-1/2 flex items-center justify-center">
        <h1 className="text-6xl md:text-9xl font-bold text-blue-800">
          TrialList
        </h1>
      </div>
      <div className="h-full w-full md:w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[22rem] space-y-6 bg-[#013e91] p-8 border border-gray-700 rounded-xl shadow "
        >
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <span className="text-3xl font-medium text-white ">
            Sign In
          </span>
          <div className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full text-sm text-gray-900 bg-white border border-transparent p-2.5 rounded-lg focus-within:outline-0"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full text-sm text-gray-900 bg-white border border-transparent p-2.5 rounded-lg focus-within:outline-0"
                required
              />
            </div>
            <div className="flex items-start">
              <div className="h-fit flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-50 border border-gray-300 rounded focus:ring-3 focus:ring-blue-300"
                />
              </div>
              <label
                htmlFor="remember"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Remember me
              </label>
              <a
                href="#"
                className="text-sm ms-auto text-white hover:underline"
              >
                Forget Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-blue-800 text-center font-medium bg-white px-5 py-2.5 rounded-lg  hover:bg-slate-100"
            >
              Login to your account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
