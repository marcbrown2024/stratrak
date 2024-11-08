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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Calculate the timezone offset in minutes and convert it to hours and minutes
    const timezoneOffset = -date.getTimezoneOffset();
    const offsetHours = String(
      Math.floor(Math.abs(timezoneOffset) / 60)
    ).padStart(2, "0");
    const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(
      2,
      "0"
    );

    // Format the timezone offset to match the format ±hh:mm
    const offsetSign = timezoneOffset >= 0 ? "+" : "-";

    return `${hours}:${minutes}:${seconds} ${offsetSign}${offsetHours}:${offsetMinutes}`;
  };

  return (
    <div className="relative h-48 flex space-x-6 bg-slate-50 px-8 py-8 mb-64 border border-slate-400 rounded-lg">
      <button
        onClick={() => setSelectedRow(null, false)}
        className="absolute -top-4 -right-3"
      >
        <IoCloseCircleSharp size={36} color="#2563eb" />
      </button>
      <div className="h-full flex flex-col items-start justify-start gap-2">
        <span className="text-2xl text-blue-600 font-medium">
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
        <div className="w-full text-2xl text-blue-600 font-medium">
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
            <span>Date: {formatDate(selectedRow?.dateOfVisit)}</span>
            <span>{formatTime(selectedRow?.dateOfVisit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignaturePopUp;
