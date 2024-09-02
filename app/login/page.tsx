"use client";

// react/nextjs components
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// custom components

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    // For example, send the credentials, role, and userId to an API
    router.push("/dashboard");
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
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm font-medium text-white"
            >
              Remember Me
            </label>
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
