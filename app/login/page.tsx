"use client";

// react/nextjs components
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// custom components

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [rememberMe, setRememberMe] = useState(false);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    // For example, send the credentials, role, and userId to an API
    router.push("/dashboard");
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-end overflow-hidden">
      <div className="absolute left-0 h-full w-full flex items-center rotate-45 z-0">
        <div className="h-full w-1/5 bg-blue-100 blur-[150px]"></div>
        <div className="h-full w-1/5 bg-blue-200 blur-[150px]"></div>
        <div className="h-full w-1/5 bg-blue-300 blur-[150px]"></div>
        <div className="h-full w-1/5 bg-blue-400 blur-[150px]"></div>
        <div className="h-full w-1/5 bg-blue-300 blur-[150px]"></div>
        <div className="h-full w-1/5 bg-blue-500 blur-[150px]"></div>
      </div>
      <div className="relative w-full">
        <div className="absolute -top-96 left-10 md:left-96 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-60 left-20 md:top-48 md:left-80 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-36 md:-top-20 md:left-20 w-72 h-72 bg-blue-500/90 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute -top-10 left-20 md:left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="h-[30rem]  w-[30rem] space-y-4 bg-gradient-to-tl from-[#8476d6] via-[#33b0cf] to-[#6f96d4] p-10 mr-20 rounded-xl shadow-xl z-10"
      >
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-white"
          >
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white"
          >
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
        <div className="space-y-2">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-white"
          >
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {role === "admin" && (
          <div className="space-y-2">
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-white"
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
        )}
        <div className="flex items-center space-x-2 pt-2">
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
  );
};

export default Page;
