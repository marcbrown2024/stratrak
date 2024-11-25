"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";

// firebase components/functions
import { getAllUsers } from "@/firebase";

// global components
import LoadingStore from "@/store/LoadingStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// custom components
import CustomTable from "@/components/CustomTable";

// icons
import { FaUser, FaUsers, FaUserShield } from "react-icons/fa";
import { redirect } from "next/navigation";

const Page = () => {
  const { user } = useUser();
  const { setLoading } = LoadingStore();
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [adminCount, setAdminCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const refreshUsers = () => {
    fetchUsers();
  };

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers(user?.orgId ?? "").then((response) => {
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
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (user) {
      if (!user.isAdmin) redirect("/");
      fetchUsers();
    }
  }, [user]);

  return (
    <div className="h-fit w-full flex flex-col items-start justify-center bg-slate-50 pl-10 2xl:pl-20 z-10">
      {/* Info Cards */}
      <div className="h-fit w-11/12 flex flex-col md:flex-row gap-4 md:gap-8 bg-slate-50 p-4">
        <div className="relative h-fit w-[18.5rem] 2xl:w-1/3 flex flex-col rounded-lg bg-gray-200 text-gray-700 shadow-md">
          <div className="absolute h-14 w-14 flex items-center justify-center text-white bg-gray-700 mx-4 -mt-4 rounded-xl shadow-gray-600/50 shadow-md  overflow-hidden">
            <FaUser size={28} color="white" />
          </div>
          <div className="flex flex-col text-xl text-right font-semibold tracking-wide p-4">
            <span>Users</span>
            {userCount} / {totalCount}
          </div>
          <div className="text-sm text-gray-500 font-medium p-4 border-t border-blue-gray-50">
            <span>Total number of regular users</span>
          </div>
        </div>
        <div className="relative h-fit w-[18.5rem] 2xl:w-1/3 flex flex-col rounded-lg bg-gray-200 text-gray-700 shadow-md">
          <div className="absolute h-14 w-14 flex items-center justify-center text-white bg-gray-700 mx-4 -mt-4 rounded-xl shadow-gray-600/50 shadow-md  overflow-hidden">
            <FaUserShield size={36} color="white" />
          </div>
          <div className="flex flex-col text-xl text-right font-semibold tracking-wide p-4">
            <span>Admins</span>
            {adminCount} / {totalCount}
          </div>
          <div className="text-sm text-gray-500 font-medium p-4 border-t border-blue-gray-50">
          <span>Total number of admin users</span>
          </div>
        </div>
        <div className="relative h-fit w-[18.5rem] 2xl:w-1/3 flex flex-col rounded-lg bg-gray-200 text-gray-700 shadow-md">
          <div className="absolute h-14 w-14 flex items-center justify-center text-white bg-gray-700 mx-4 -mt-4 rounded-xl shadow-gray-600/50 shadow-md  overflow-hidden">
            <FaUsers size={34} color="white" />
          </div>
          <div className="flex flex-col text-xl text-right font-semibold tracking-wide p-4">
            <span>All Users</span>
            <span>{totalCount}</span>
          </div>
          <div className="text-sm text-gray-500 font-medium p-4 border-t border-blue-gray-50">
            Total users (regular + admins)
          </div>
        </div>
      </div>
      {/* Custom Table */}
      <div className="h-fit w-full flex flex-col items-center justify-center gap-4 px-4 pb-4">
        <div className="w-full">
          <CustomTable users={users} refreshUsers={refreshUsers} />
        </div>
      </div>
    </div>
  );
};

export default Page;
