"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";

// firebase components/functions
import { getTrials } from "@/firebase";
import { useAuth } from "@/components/AuthProvider";

// custom components
import CustomTable from "@/components/CustomTable";

// icons
import { FaUser, FaUsers, FaUserShield } from "react-icons/fa";

const Page = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [trials, setTrials] = useState<TrialDetails[]>([]);

  useEffect(() => {
    if (user?.orgId) {
      getTrials(user.orgId)
        .then((response) => {
          setTrials(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching trials:", error);
          setLoading(false);
        });
    } else {
      setLoading(false); // Set loading to false if user or orgId is undefined
    }
  }, [user]);

  return (
    <div className="h-fit w-full flex flex-col items-center justify-center bg-slate-50 md:pl-20">
      {/* Info Cards */}
      <div className="h-fit w-full flex flex-col md:flex-row gap-4 md:gap-8 bg-slate-50 p-4">
        <div className="h-48 sm:w-[15rem] xl:w-[16.5rem] 2xl:w-[23.3rem] flex flex-col items-start justify-between bg-[#1286ff] p-6 rounded-xl hover:bg-[#1285dd] transition-colors duration-200">
          <FaUser size={40} color="white" />
          <div className="w-full flex items-center justify-between text-lg text-white font-semibold tracking-widest">
            <span>30/50</span>
            <span>Users</span>
          </div>
        </div>
        <div className="h-48 sm:w-[15rem] xl:w-[16.5rem] 2xl:w-[23.3rem] flex flex-col items-start justify-between bg-[#1286ff] p-6 rounded-xl hover:bg-[#1285dd] transition-colors duration-200">
          <FaUserShield size={48} color="white" />
          <div className="w-full flex items-center justify-between text-lg text-white font-semibold tracking-widest">
            <span>30/50</span>
            <span>Admins</span>
          </div>
        </div>
        <div className="h-48 sm:w-[15rem] xl:w-[16.5rem] 2xl:w-[23.3rem] flex flex-col items-start justify-between bg-[#1286ff] p-6 rounded-xl hover:bg-[#1285dd] transition-colors duration-200">
          <FaUsers size={48} color="white" />
          <div className="w-full flex items-center justify-between text-lg text-white font-semibold tracking-widest">
            <span>30/50</span>
            <span>All Users</span>
          </div>
        </div>
      </div>
      {/* Custom Table */}
      <div className="h-fit w-full flex flex-col items-center justify-center gap-4 px-4 pb-4">
        <div className="w-full">
          <CustomTable />
        </div>
      </div>
    </div>
  );
};

export default Page;
