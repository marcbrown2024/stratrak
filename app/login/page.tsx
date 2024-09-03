"use client";

// react/nextjs components
import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth, enrollUser, userExists} from '@/firebase'
import { AlertType } from "@/enums";
import { useAlertStore } from "@/store/AlertStore";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
  const [setAlert] = useAlertStore(state => [state.setAlert])

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignInErrors = () => {

  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let alertBody: AlertBody

    try {
      const userDetails = await signInWithEmailAndPassword(formData.email, formData.password)
      if (userDetails) {
        alertBody = {
          title: "Success!",
          content: "User logged in"
        }
        setAlert(alertBody, AlertType.Success)
      } else {
        const existResponse = await userExists(formData.email)
        console.log("exist response: ", existResponse) //TODO: remove
        const defaultPword = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!

        if (existResponse.data.exists && formData.password === defaultPword) {
          const createdUser = await createUserWithEmailAndPassword(auth, formData.email, defaultPword)
          if (createdUser) { // if user was created successfully
            console.log("createdUser: ", createdUser) //TODO: remove
            alertBody = {
              title: "Success!",
              content: "User account activated. Please change password."
            }
            enrollUser(existResponse.data.id, createdUser.user.uid)
            setAlert(alertBody, AlertType.Success)
            setFormData(initialFormData)
            router.push('/')
            return
          }
        }
        alertBody = {
            title: "Error",
            content: "User account does not exist"
        }
        setAlert(alertBody, AlertType.Error)
      }
      setFormData(initialFormData)
      router.push('/')
    } catch (e) {
      alertBody = {
        title: "Error",
        content: "There was an error when attempting to sign in user"
      }
      setAlert(alertBody, AlertType.Error)
      setFormData(initialFormData)

    }

  };

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
