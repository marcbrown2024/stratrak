"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";

// firestore functions
import { getTrials } from "@/firebase";
import Loader from "@/components/Loader";

// custom components
import CustomTable from "@/components/CustomTable";

// icons
import { FaUser, FaUsers, FaUserShield } from "react-icons/fa";

const Page = () => {
  const [loading, setLoading] = useState<Boolean>(true);

  // Update the state with the imported data
  useEffect(() => {
    getTrials().then((response) => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="h-fit w-full flex flex-col items-center justify-center bg-slate-50 md:pl-20">
      <div className="h-fit w-11/12 flex items-center justify-center bg-slate-50 z-10">
        <div className="w-full flex items-center justify-start gap-20">
          <div className="h-48 w-80 flex flex-col items-start justify-between bg-[#1286ff] p-6 rounded-xl hover:bg-[#1285dd]">
            <FaUser size={40} color="white" />
            <div className="w-full flex items-center justify-between text-lg text-white font-semibold tracking-widest">
              <span>30/50</span>
              <span>Users</span>
            </div>
          </div>
          <div className="h-48 w-80 flex flex-col items-start justify-between bg-[#1286ff] p-6 rounded-xl hover:bg-[#1285dd]">
            <FaUserShield size={48} color="white" />
            <div className="w-full flex items-center justify-between text-lg text-white font-semibold tracking-widest">
              <span>30/50</span>
              <span>Admins</span>
            </div>
          </div>
          <div className="h-48 w-80 flex flex-col items-start justify-between bg-[#1286ff] p-6 rounded-xl hover:bg-[#1285dd]">
            <FaUsers size={48} color="white" />
            <div className="w-full flex items-center justify-between text-lg text-white font-semibold tracking-widest">
              <span>30/50</span>
              <span>All Users</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-fit w-11/12 flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col items-center justify-start px-4">
          <CustomTable />
        </div>
      </div>
    </div>
  );
};

export default Page;
