// react/nextjs components
import React, { useEffect } from "react";

// global states
import LoadingStore from "@/store/LoadingStore";

import { DNA } from "react-loader-spinner";
const Loader = () => {
  const loading = LoadingStore((state) => state.loading);

  // Add/remove overflow hidden to the body when loading state changes
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Enable scrolling again when loading is false
    }

    return () => {
      document.body.style.overflow = ""; // Clean up when the component is unmounted
    };
  }, [loading]);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-slate-50 z-50 overflow-hidden">
      <DNA
        height="100"
        width="100"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
};

export default Loader;