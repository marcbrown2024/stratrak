// react/nextjs components
import React from "react";
import { DNA } from "react-loader-spinner";

// global states
import LoadingStore from "@/store/LoadingStore";

const Loader = () => {
  const loading = LoadingStore((state) => state.loading);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed h-full w-[calc(100vw-305px)] flex items-center justify-center bg-slate-50 z-50">
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
