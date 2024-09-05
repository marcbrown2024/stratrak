"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";

// firebase components/functions
import { getAllUsers } from "@/firebase";
import { useAuth } from "@/components/AuthProvider";

// custom components
import CustomTable from "@/components/CustomTable";

// icons
import { FaUser, FaUsers, FaUserShield } from "react-icons/fa";
import { redirect } from "next/navigation";

const Page = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<Boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [adminCount, setAdminCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    if (user) {
      if (!user.isAdmin) redirect("/");
    }

    const fetchUsers = async () => {
      const response = await getAllUsers();
      if (response.success) {
        const allUsers = response.data;
        const usersCount = allUsers.filter(
          (user: User) => !user.isAdmin
        ).length;
        const adminsCount = allUsers.filter(
          (user: User) => user.isAdmin
        ).length;

        setUsers(allUsers);
        setUserCount(usersCount);
        setAdminCount(adminsCount);
        setTotalCount(allUsers.length);
      } else {
        console.error("Failed to fetch users:", response.data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="h-fit w-full flex flex-col items-center justify-center bg-slate-50 md:pl-20">
      {/* Info Cards */}
      <div className="h-fit w-full flex flex-col md:flex-row gap-4 md:gap-8 bg-slate-50 p-4">
        <div className="h-48 sm:w-[15rem] xl:w-[16.5rem] 2xl:w-[23.3rem] flex flex-col items-start justify-between bg-[#1286ff] p-6 rounded-xl hover:bg-[#1285dd] transition-colors duration-200">
          <FaUser size={40} color="white" />
          <div className="w-full flex items-center justify-between text-lg text-white font-semibold tracking-widest">
            <span>{userCount}/{totalCount}</span>
            <span>Users</span>
          </div>
        </div>
        <div className="h-48 sm:w-[15rem] xl:w-[16.5rem] 2xl:w-[23.3rem] flex flex-col items-start justify-between bg-[#1286ff] p-6 rounded-xl hover:bg-[#1285dd] transition-colors duration-200">
          <FaUserShield size={48} color="white" />
          <div className="w-full flex items-center justify-between text-lg text-white font-semibold tracking-widest">
            <span>{adminCount}/{totalCount}</span>
            <span>Admins</span>
          </div>
        </div>
        <div className="h-48 sm:w-[15rem] xl:w-[16.5rem] 2xl:w-[23.3rem] flex flex-col items-start justify-between bg-[#1286ff] p-6 rounded-xl hover:bg-[#1285dd] transition-colors duration-200">
          <FaUsers size={48} color="white" />
          <div className="w-full flex items-center justify-between text-lg text-white font-semibold tracking-widest">
            <span>{totalCount}</span>
            <span>All Users</span>
          </div>
        </div>
      </div>
      {/* Custom Table */}
      <div className="h-fit w-full flex flex-col items-center justify-center gap-4 px-4 pb-4">
        <div className="w-full">
          <CustomTable users={users} />
        </div>
      </div>
    </div>
  );
};

export default Page;
