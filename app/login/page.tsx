"use client";

// react/nextjs components
import React, { ChangeEvent, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth, enrollUser, secondaryAuth, userExists} from '@/firebase'
import { AlertType } from "@/enums";
import { useAlertStore } from "@/store/AlertStore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import useFirebaseAuth from "@/hooks/UseFirebaseAuth";
// custom components

interface FormData {
  email: string;
  password: string;
}

const initialFormData = {
  email: "",
  password: "",
}

const Page = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [setAlert, closeAlert] = useAlertStore((state) => [state.setAlert, state.closeAlert]);

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(secondaryAuth)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const logInUser = async () => {
    const userResponse = await signInWithEmailAndPassword(formData.email, formData.password)
    return userResponse
    console.log("user response: ", userResponse)
  }

  const { executeAuth: executeUserLogin, loading: userLoginLoading, error: userLoginError } = useFirebaseAuth(logInUser);

  const handleSubmit = async (e: React.FormEvent) => {
    closeAlert()
    e.preventDefault();
  
    // Call the executeAuth function with the appropriate arguments
    // const { success, result } = await executeUserLogin();

    console.log("formData: ", formData)
    signInWithEmailAndPassword(formData.email, formData.password).then(userResponse => {console.log(userResponse)})

    // if (success) {
    //   // On success, set success alert and clear form data
    //   setAlert({ title: "Welcome!", content: "User logged in successfully." }, AlertType.Success);
    //   setFormData(initialFormData);
    //   router.push('/');
    // }

  };


  useEffect(() => {
    if (userLoginError) {
      setAlert({ title: "Something went wrong", content: userLoginError ?? "An unexpected error occurred." }, AlertType.Error);
    }
  }, [userLoginError])  

  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row items-start justify-center gap-12 md:gap-0 overflow-hidden">
      <div className="h-fit md:h-4/5 w-full md:w-1/2 flex flex-col items-center justify-center gap-8 md:ml-40">
        <h1 className="text-6xl md:text-9xl font-bold text-blue-800">
          TrialList
        </h1>
      </div>
      <div className="h-fit md:h-full w-full md:w-1/2 flex items-center justify-center md:justify-end">
        <form
          onSubmit={handleSubmit}
          className="h-[28rem] w-80 md:w-96 space-y-4 bg-blue-500 p-10 md:mr-20 rounded-xl shadow-xl z-10"
        >
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-2">
            <label htmlFor="username" className="block font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-lg text-blue-700 font-bold bg-white px-4 py-2 rounded shadow-xl"
          >
            Login
          </button>
          <div className="text-center pt-4">
            <a
              href="/forgot-password"
              className="text-white font-medium hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
