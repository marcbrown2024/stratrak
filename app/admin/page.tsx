"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";

// firebase components/functions
import { getAllUsers, getAmendedLogs } from "@/firebase";

// global components
import LoadingStore from "@/store/LoadingStore";
import AdminPopupStore from "@/store/AdminPopupStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// custom components
import CustomTable from "@/components/CustomTable";
import AdminPopup from "@/components/AdminPopup";
import AmendLogTable from "@/components/AmendLogTable";

// icons
import { FaUser, FaUsers, FaUserShield } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";

const Page = () => {
  const { user } = useUser();
  const { setLoading } = LoadingStore();
  const [users, setUsers] = useState<User[]>([]);
  const [amendLogs, setAmendLogs] = useState<LogDetails[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [adminCount, setAdminCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilterPopup, setShowFilterPopup] = useState<boolean>(false);
  const [addUser, setAddUser] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"Users" | "Admins" | "All Users">(
    "All Users"
  );

  const handleFilterChange = (newFilter: "Users" | "Admins" | "All Users") => {
    setFilter(newFilter);
    setCurrentPage(1);
    setShowFilterPopup(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const refreshData = () => {
    fetchData();
  };

  const fetchData = () => {
    setLoading(true);

    // Fetch all users
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

        // Fetch amended logs
        getAmendedLogs(user?.orgId as string).then((logResponse) => {
          if (logResponse.success) {
            setAmendLogs(logResponse.data);
          }
          setLoading(false);
        });
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const closePopupsOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".FilterPopup")) {
        setShowFilterPopup(false);
      }
    };
    document.addEventListener("click", closePopupsOnOutsideClick);
    return () => {
      document.removeEventListener("click", closePopupsOnOutsideClick);
    };
  }, [setShowFilterPopup]);

  useEffect(() => {
    if (user) {
      if (!user.isAdmin) redirect("/");
      fetchData();
    }
  }, [user]);

  return (
    <div className="h-fit w-full flex flex-col items-center justify-center gap-8 pb-8">
      {/* Info Cards */}
      <div className="h-fit w-[95%] flex flex-col md:flex-row gap-4 md:gap-8">
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
      <div className="relative w-[95%] flex items-center justify-between mt-12">
        <div className="text-lg font-semibold">
          {filter === "Admins" ? (
            <div>
              Admins<span className="text-gray-400 ml-2">{adminCount}</span>
            </div>
          ) : filter === "Users" ? (
            <div>
              Users<span className="text-gray-400 ml-2">{userCount}</span>
            </div>
          ) : (
            <div>
              All Users<span className="text-gray-400 ml-2">{totalCount}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="h-10 w-60 flex items-center gap-3 bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg">
            <div className="h-full w-full flex items-center justify-center gap-2 font-semibold bg-gray-200 px-2 rounded-md shadow-lg">
              <CiSearch size={20} color="black" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilterPopup(!showFilterPopup)}
            className="FilterPopup h-10 w-28 text-[15px] bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg hover:scale-95"
          >
            <div className="h-full w-full flex items-center justify-center gap-2 font-semibold bg-gray-200 rounded-md shadow-lg">
              <IoFilter />
              <span className="">Filters</span>
            </div>
          </button>
          <button
            onClick={() => setAddUser(true)}
            className="h-10 w-28 text-[15px] bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg hover:scale-95"
          >
            <div className="h-full w-full flex items-center justify-center font-semibold bg-gray-200 rounded-md shadow-lg">
              {addUser ? (
                "Cancel"
              ) : (
                <div className="flex items-center gap-2">
                  <FaPlus size={14} />
                  Add User
                </div>
              )}
            </div>
          </button>
          {showFilterPopup && (
            <div className="FilterPopup absolute top-12 right-[8.5rem] w-28 flex flex-col text-sm text-gray-700 bg-gray-200 p-3 rounded-lg shadow">
              <button
                type="button"
                onClick={() => handleFilterChange("All Users")}
                className="font-semibold p-1 rounded-md hover:bg-black/10"
              >
                All Users
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange("Admins")}
                className="font-semibold p-1 rounded-md hover:bg-black/10"
              >
                Admins
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange("Users")}
                className="font-semibold p-1 rounded-md hover:bg-black/10"
              >
                Users
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Custom Table */}
      <CustomTable
        users={users}
        refreshData={refreshData}
        setLoading={setLoading}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        filter={filter}
        searchQuery={searchQuery}
      />
      <AmendLogTable
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        amendLogs={amendLogs}
      />
      <AdminPopup
        addUser={addUser}
        setAddUser={setAddUser}
        refreshData={refreshData}
        orgUsers={users}
      />
    </div>
  );
};

export default Page;
