// react/nextjs components
import React from "react";
import Image from "next/image";

// global stores
import useSignatureStore from "@/store/SignatureStore";

// icons
import { IoCloseCircleSharp } from "react-icons/io5";

const SignaturePopUp = () => {
  const { selectedRow, setSelectedRow } = useSignatureStore((state) => ({
    selectedRow: state.selectedRow,
    setSelectedRow: state.setSelectedRow,
  }));

  return (
    <div className="relative h-48 flex space-x-6 bg-[#b5d5f4] px-8 py-8 mb-64 border border-slate-400 rounded-lg">
      <button
        onClick={() => setSelectedRow(null, false)}
        className="absolute -top-4 -right-3 bg-white rounded-full"
      >
        <IoCloseCircleSharp size={36} color="#2563eb" />
      </button>
      <div className="h-full flex flex-col items-start justify-start gap-2">
        <span className="text-2xl font-medium">
          Electronic Signature
        </span>
        <div>
          {selectedRow?.signature?.startsWith("data:image") ? (
            <Image
              width={250}
              height={250}
              src={selectedRow.signature}
              alt="User Signature"
              style={{
                maxWidth: "auto",
                maxHeight: "auto",
              }}
            />
          ) : (
            <p>{selectedRow?.signature || "No signature available"}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-start gap-3">
        <div className="w-full text-2xl font-medium">
          Digital Signature
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-start justify-center gap-1">
            <span className="text-3xl font-medium">
              {selectedRow?.monitorName.split(" ")[0]}
            </span>
            <span className="text-3xl font-medium">
              {selectedRow?.monitorName.split(" ")[1]}
            </span>
          </div>
          <div className="flex flex-col items-start justify-center leading-5">
            <span>Digitally signed</span>
            <span>by {selectedRow?.monitorName}</span>
            <span>Date: {selectedRow?.dateOfVisit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignaturePopUp;
