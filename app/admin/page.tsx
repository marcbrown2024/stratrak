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
import AdminPopup from "@/components/AdminPopup";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addUser, setAddUser] = useState<boolean>(false);
  const [findUser, setFindUser] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"Users" | "Admins" | "All Users">(
    "All Users"
  );

  const handleFilterChange = (newFilter: "Users" | "Admins" | "All Users") => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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
    <div className="h-fit w-full flex flex-col items-center justify-center gap-8 bg-slate-50">
      {/* Info Cards */}
      <div className="h-fit w-11/12 flex flex-col md:flex-row gap-4 md:gap-8 bg-slate-50">
        <div className="relative h-fit w-[18.5rem] 2xl:w-1/3 flex flex-col pb-1 pr-1 rounded-lg bg-gray-300 text-gray-700 shadow-lg">
          <div className="bg-gray-200 rounded-lg shadow-lg">
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
        </div>
        <div className="relative h-fit w-[18.5rem] 2xl:w-1/3 flex flex-col pb-1 pr-1 rounded-lg bg-gray-300 text-gray-700 shadow-lg">
          <div className="bg-gray-200 rounded-lg shadow-lg">
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
        </div>
        <div className="relative h-fit w-[18.5rem] 2xl:w-1/3 flex flex-col pb-1 pr-1 rounded-lg bg-gray-300 text-gray-700 shadow-lg">
          <div className="bg-gray-200 rounded-lg shadow-lg">
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
      </div>
      {/* Filter & Action buttons */}
      <div className="h-16 w-11/12 flex items-center justify-start gap-8 overflow-hidden">
        {!findUser && (
          <>
            <button
              onClick={() => handleFilterChange("Users")}
              className="h-10 w-28 text-[15px] bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg hover:scale-95"
            >
              <div className="h-full w-full flex items-center justify-center font-semibold bg-gray-200 rounded-md shadow-lg">
                Users
              </div>
            </button>
            <button
              onClick={() => handleFilterChange("Admins")}
              className="h-10 w-28 text-[15px] bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg hover:scale-95"
            >
              <div className="h-full w-full flex items-center justify-center font-semibold bg-gray-200 rounded-md shadow-lg">
                Admins
              </div>
            </button>
            <button
              onClick={() => handleFilterChange("All Users")}
              className="h-10 w-28 text-[15px] bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg hover:scale-95"
            >
              <div className="h-full w-full flex items-center justify-center font-semibold bg-gray-200 rounded-md shadow-lg">
                All Users
              </div>
            </button>
            <button
              onClick={() => setAddUser(true)}
              className="h-10 w-28 text-[15px] bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg hover:scale-95"
            >
              <div className="h-full w-full flex items-center justify-center font-semibold bg-gray-200 rounded-md shadow-lg">
                {addUser ? "Cancel" : "Add User"}
              </div>
            </button>
            <button
              onClick={() => setFindUser(true)}
              className="h-10 w-28 text-[15px] bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg hover:scale-95"
            >
              <div className="h-full w-full flex items-center justify-center font-semibold bg-gray-200 rounded-md shadow-lg">
                Find User
              </div>
            </button>
          </>
        )}
        {findUser && (
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for a user..."
              className="w-80 bg-transparent p-2 border-b rounded focus:outline-none"
            />
            <button
              onClick={() => setFindUser(false)}
              className="ml-2 p-2 rounded hover:scale-95"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {/* Custom Table */}
      <CustomTable
        users={users}
        refreshUsers={refreshUsers}
        setLoading={setLoading}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        filter={filter}
        searchQuery={searchQuery}
      />
      <AdminPopup
        addUser={addUser}
        setAddUser={setAddUser}
        refreshUsers={refreshUsers}
      />
    </div>
  );
};

export default Page;
