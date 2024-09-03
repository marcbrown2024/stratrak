// react/nextjs components
import React, { useState } from "react";

// mui components
import Tooltip from "@mui/material/Tooltip";

// icons
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { RiExchangeFill } from "react-icons/ri";

type DataItem = {
  id: number;
  name: string;
  admin: boolean;
  status: string | React.ReactNode | null;
  action?: React.ReactNode | null;
};

const data: DataItem[] = [
  {
    id: 1,
    name: "Item 1",
    admin: true,
    status: (
      <>
        <FaCircle color="green" title="Online" className="opacity-30" /> Online
      </>
    ),
  },
  {
    id: 2,
    name: "Item 2",
    admin: false,
    status: (
      <>
        <FaCircle color="green" title="Online" className="opacity-30" /> Online
      </>
    ),
  },
  {
    id: 3,
    name: "Item 3",
    admin: true,
    status: (
      <>
        <FaCircle color="red" title="Offline" className="opacity-30" /> Offline
      </>
    ),
  },
  {
    id: 4,
    name: "Item 4",
    admin: true,
    status: (
      <>
        <FaCircle color="green" title="Online" className="opacity-30" /> Online
      </>
    ),
  },
  {
    id: 5,
    name: "Item 5",
    admin: false,
    status: (
      <>
        <FaCircle color="green" title="Online" className="opacity-30" /> Online
      </>
    ),
  },
  {
    id: 6,
    name: "Item 6",
    admin: true,
    status: (
      <>
        <FaCircle color="red" title="Offline" className="opacity-30" /> Offline
      </>
    ),
  },
];

// Total items per page
const ITEMS_PER_PAGE = 4;

const CustomTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [filter, setFilter] = useState<"Users" | "Admins" | "All Users">(
    "All Users"
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [addUser, setAddUser] = useState<boolean>(false);

  const filteredData = data.filter((item) => {
    if (filter === "Admins") return item.admin;
    if (filter === "Users") return !item.admin;
    return true;
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (direction: "next" | "previous") => {
    if (direction === "next" && endIndex < filteredData.length) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentPage((prevPage) => prevPage + 1);
        setTransitioning(false);
      }, 300);
    } else if (direction === "previous" && startIndex > 0) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentPage((prevPage) => prevPage - 1);
        setTransitioning(false);
      }, 300);
    }
  };

  const handleFilterChange = (newFilter: "Users" | "Admins" | "All Users") => {
    setFilter(newFilter);
    setCurrentPage(1);
    setTransitioning(true);
    setTimeout(() => {
      setTransitioning(false);
    }, 300);
  };

  const handleAddUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-start gap-8">
      <div className="h-36 w-full flex items-center justify-between z-10 bg-white">
        <div className="h-16 w-full flex items-center justify-start gap-8">
          <button
            onClick={() => handleFilterChange("Users")}
            className="h-10 w-fit flex items-center justify-center font-medium bg-gray-200 p-3 rounded-md hover:bg-gray-300"
          >
            Users
          </button>
          <button
            onClick={() => handleFilterChange("Admins")}
            className="h-10 w-fit flex items-center justify-center font-medium bg-gray-200 p-3 rounded-md hover:bg-gray-300"
          >
            Admins
          </button>
          <button
            onClick={() => handleFilterChange("All Users")}
            className="h-10 w-fit flex items-center justify-center font-medium bg-gray-200 p-3 rounded-md hover:bg-gray-300"
          >
            All Users
          </button>
          <button
            onClick={() => setAddUser(!addUser)}
            className="h-10 w-fit flex items-center justify-center font-medium bg-gray-200 p-3 rounded-md hover:bg-gray-300"
          >
            {addUser ? "Cancel" : "Add User"}
          </button>
        </div>
        <button className="h-10 w-fit flex items-center justify-center text-white font-medium bg-[#1286ff] p-3 rounded-md hover:scale-105 hover:bg-[#1285dd]">
          Refresh
        </button>
      </div>
      <div
        className={`absolute h-fit w-full flex flex-col items-start justify-center gap-8 pb-6 transition-all duration-500 ease-out transform ${
          addUser ? "translate-y-36" : "-translate-y-28"
        } z-0`}
      >
        <div className="h-60 w-full flex flex-col items-start justify-center gap-8 bg-[#1286ff] p-6 rounded-xl">
          <span className="text-2xl text-white font-semibold">
            Create new user
          </span>
          <form
            onSubmit={handleAddUserSubmit}
            className="h-full w-full flex"
          >
            <div className="h-full w-1/2 flex flex-col items-start justify-center gap-6">
              <div className="w-full flex items-center justify-between">
                <label className="w-1/4 font-medium text-white">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-3/4 p-2 text-white bg-black/30 border border-white/50 rounded-md focus-within:outline-none"
                  required
                />
              </div>
              <div className="w-full flex items-center justify-between">
                <label className="w-1/4 font-medium text-white">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-3/4 p-2 text-white bg-black/30 border border-white/50 rounded-md focus-within:outline-none"
                  required
                />
              </div>
            </div>
            <div className="w-1/2 flex items-end justify-end">
              <button
                type="submit"
                className="h-10 w-fit flex items-center justify-center font-medium bg-white p-3 rounded-md hover:bg-white/95 md:mb-3"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
        <div className="h-16 w-full flex items-center justify-center text-[#3b82fe] font-semibold -mb-8">
          <span className="w-1/4 px-2">Users</span>
          <span className="w-1/4 px-2">Admin</span>
          <span className="w-1/4 px-2">Not Sure</span>
          <span className="w-1/4 px-2">Status</span>
          <span className="w-1/4 px-2">Action</span>
        </div>
        <div
          className={`h-fit w-full flex flex-col items-center justify-start space-y-1 transition-transform duration-300 ${
            transitioning ? "transform opacity-80" : ""
          }`}
        >
          {currentItems.map((item, index) => (
            <div
              key={item.id}
              className="w-full flex items-center bg-[#d3e1ee] hover:bg-[#c3d9f0] rounded-md cursor-pointer"
            >
              <span className="w-1/4 p-2">{item.name}</span>
              <span className="w-1/4 p-2">{item.admin ? "Yes" : "No"}</span>
              <span className="w-1/4 p-2">Not Sure</span>
              <span className="w-1/4 p-2 flex items-center gap-2">
                {item.status}
              </span>
              <span className="w-1/4 flex items-center justify-start gap-2 px-2">
                <Tooltip title="Delete User" arrow>
                  <span>
                    <TiUserDelete
                      size={24}
                      className="text-[#1286ff] hover:scale-105"
                    />
                  </span>
                </Tooltip>
                <Tooltip
                  title={item.admin ? "demote to user" : "Elevate to admin"}
                  arrow
                >
                  <span>
                    <RiExchangeFill
                      size={24}
                      className="text-[#1286ff] hover:scale-105"
                    />
                  </span>
                </Tooltip>
              </span>
            </div>
          ))}
        </div>
        <div className="w-full flex items-center justify-end">
          <div className="h-12 w-80 flex items-center justify-end gap-8">
            <div className="flex items-center justify-center gap-2 text-[#1286ff] tracking-wide">
              <span>
                {startIndex + 1}–{Math.min(endIndex, filteredData.length)}
              </span>
              <span>of</span>
              <span>{filteredData.length}</span>
            </div>
            <button
              onClick={() => handlePageChange("previous")}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1 ? "text-[#1285ff98]" : "text-[#1286ff]"
              }`}
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={() => handlePageChange("next")}
              disabled={endIndex >= filteredData.length}
              className={`${
                endIndex >= filteredData.length
                  ? "text-[#1285ff98]"
                  : "text-[#1286ff]"
              }`}
            >
              <FaChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
