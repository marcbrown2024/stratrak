"use client"

// react/nextjs components
import Link from "next/link";

// meta data
export const metadata = {
  title: "404 - Not Found",
  description: "Page not found",
};

import { DNA } from "react-loader-spinner";


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center my-auto pb-12">
      <h1 className="text-4xl font-bold mb-4">There was a problem.</h1>
      <p className="text-gray-600 mb-6">
        Sorry. We could not find the page you were looking for.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to the Homepage
      </Link>
      <div className="mt-4">
        <DNA
          height="100"
          width="100"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </div>
    </div>
  );
}
