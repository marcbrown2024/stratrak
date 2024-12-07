// react/nextjs components
import React from "react";

// global states
import LoadingStore from "@/store/LoadingStore";

import { DNA } from "react-loader-spinner";

const Loader = () => {
  const loading = LoadingStore((state) => state.loading);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 h-full w-[calc(100vw-17rem)] flex items-center justify-center bg-slate-50 z-50">
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
