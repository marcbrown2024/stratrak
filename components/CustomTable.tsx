// react/nextjs components
import React, { useState } from "react";
import Image from "next/image";

// mui components
import Tooltip from "@mui/material/Tooltip";

// firebase components
import { updatePrivilege } from "@/firebase";

import { useAlertStore } from "@/store/AlertStore";

// enums
import { AlertType } from "@/enums";

// icons
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// custom hooks
import useUser from "@/hooks/UseUser";

type CustomTableProps = {
  users: User[];
  refreshUsers: () => void;
  setLoading: (value: boolean) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  filter: string;
  searchQuery: string;
};

const CustomTable: React.FC<CustomTableProps> = ({
  users,
  refreshUsers,
  setLoading,
  setCurrentPage,
  currentPage,
  filter,
  searchQuery,
}) => {
  const { user } = useUser();
  const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
  const [privilegeChangeRowId, setPrivilegeChangeRowId] = useState<
    string | null
  >(null);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  // Handle delete button click
  const handleDeleteClick = (userId: string) => {
    if (deleteRowId === userId) {
      setDeleteRowId(null);
    } else {
      // Check if the user trying to delete themselves
      if (user?.userId === userId) {
        setAlert(
          {
            title: "Warning!",
            content: "You cannot delete your own account.",
          },
          AlertType.Info
        );
        return;
      }
      setDeleteRowId(userId);
      setPrivilegeChangeRowId(null);
    }
  };

  // Handle privilege change button click
  const handlePrivilegeChangeClick = (userId: string) => {
    if (privilegeChangeRowId === userId) {
      setPrivilegeChangeRowId(null);
    } else {
      // Check if the user trying to change their role themselves
      if (user?.userId === userId) {
        setAlert(
          {
            title: "Warning!",
            content:
              "You can't change your own role. Contact another administrator",
          },
          AlertType.Info
        );
        return;
      }
      setPrivilegeChangeRowId(userId);
      setDeleteRowId(null);
    }
  };
  const handleCancel = () => {
    setPrivilegeChangeRowId(null);
    setDeleteRowId(null);
  };

  const handleDeleteUser = async (userId: string) => {
    closeAlert();
    setLoading(true);
    try {
      // Make a POST request to the API route
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      let alert: AlertBody;
      let alertType: AlertType;
      handleCancel();
      setLoading(false);
      setTimeout(() => {
        if (data.success) {
          alert = {
            title: "Success!",
            content: "User was deleted successfully.",
          };
          alertType = AlertType.Success;
          refreshUsers();
        } else {
          alert = {
            title: "Error!",
            content: data.message || "Could not delete user. Please try again.",
          };
          alertType = AlertType.Error;
        }
        setAlert(alert, alertType);
      }, 500);
    } catch (error) {
      setTimeout(() => {
        setAlert(
          {
            title: "Error!",
            content: "Could not delete user. Please try again.",
          },
          AlertType.Error
        );
      }, 500);
    }
  };

  const handleUpdatePrivilege = (email: string, isAdmin: boolean) => {
    closeAlert();
    updatePrivilege(email, isAdmin).then((response) => {
      let alert: AlertBody;
      let alertType: AlertType;

      if (response.success) {
        alert = {
          title: "Success!",
          content: "User privilege updated successfully.",
        };
        alertType = AlertType.Success;
        refreshUsers();
      } else {
        alert = {
          title: "Error!",
          content: "Could not update user privilege. Please try again.",
        };
        alertType = AlertType.Error;
      }
      setAlert(alert, alertType);
    });
    handleCancel();
  };

  // Filter users based on the selected filter and search query
  const filteredData = users
    .filter((item) => {
      // Filter based on selected filter (Admins/Users)
      if (filter === "Admins") return item.isAdmin;
      if (filter === "Users") return !item.isAdmin;

      // Additionally filter based on search query
      const searchTerm = searchQuery.toLowerCase();
      return (
        item.fName.toLowerCase().includes(searchTerm) || // Filter by fname
        item.lName.toLowerCase().includes(searchTerm) || // Filter by lname
        item.email.toLowerCase().includes(searchTerm) // Filter by email (or any other relevant fields)
      );
    })
    .sort((a, b) => {
      // Handle "N/A" for lastActivity
      if (a.lastActivity === "") return 1; // Place a after b
      if (b.lastActivity === "") return -1; // Place b after a

      // Sort by lastActivity (most recent first)
      const dateA = new Date(a.lastActivity).getTime();
      const dateB = new Date(b.lastActivity).getTime();
      return dateB - dateA; // Descending order
    });

  // Total items per page
  const ITEMS_PER_PAGE = 8;

  // Calculate indices for current page items
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);
  const currentItems = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (direction: string) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= 3 ||
        i > totalPages - 3 ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(i);
      } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
        pageNumbers.push("...");
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-11/12 bg-gray-200 pb-[6px] rounded-lg overflow-hidden">
      <div className="h-14 w-full bg-gray-300 pr-2 shadow-lg rounded-t-lg">
        <div className="h-full w-full flex text-sm text-left font-semibold tracking-wide uppercase bg-gray-200 rounded-t-lg shadow-lg">
          <div className="h-full w-[20%] flex items-center justify-start px-4">
            Member
          </div>
          <div className="h-full w-32 flex items-center justify-start px-4">
            Admin
          </div>
          <div className="h-full w-[20%] flex items-center justify-start px-4">
            Email
          </div>
          <div className="h-full w-60 flex items-center justify-start px-4">
            Last Activity
          </div>
          <div className="h-full w-[21%] flex items-center justify-start px-4">
            Action
          </div>
          <div className="h-full w-[21%] flex items-center justify-start px-4">
            Change Role
          </div>
        </div>
      </div>
      {currentItems.map((item, idx) => (
        <div key={idx} className="h-16 w-full pr-2 bg-gray-300 shadow-lg">
          <div
            key={item.userId}
            className="h-full w-full flex text-sm text-gray-700 text-left bg-gray-100 border-b hover:bg-gray-50 shadow-lg"
          >
            <div className="h-full w-[20%] flex items-center justify-start gap-2 px-4 overflow-hidden">
              <Image
                width={20}
                height={20}
                src={
                  item.profilePhoto
                    ? item.profilePhoto
                    : "/images/profile_user_avatar.png"
                }
                alt="Profile Photo"
                className="h-10 w-10 rounded-full border"
              />
              <span className="text-nowrap">
                {item.fName} {item.lName}
              </span>
            </div>
            <div className="h-full w-32 flex items-center justify-start px-4">
              {item.isAdmin ? "Yes" : "No"}
            </div>
            <div className="h-full w-[20%] flex items-center justify-start text-nowrap px-4 overflow-hidden">
              {item.email}
            </div>
            <div className="h-full w-60 flex items-center justify-start px-4 overflow-hidden">
              {item.lastActivity ? item.lastActivity : "N/A"}
            </div>
            <div className="relative h-full w-[21%] flex items-center justify-start pl-11 overflow-hidden">
              <button
                onClick={() => handlePrivilegeChangeClick(item.userId)}
                className={`w-32 text-sm bg-gray-200 p-1 rounded-md hover:bg-gray-300 transform ${
                  privilegeChangeRowId === item.userId
                    ? "-translate-x-48"
                    : "-translate-x-[26px]"
                } transition-all duration-500 ease-in-out`}
              >
                {item.isAdmin ? "Demote to user" : "Elevate to admin"}
              </button>
              <div
                className={`absolute flex items-center justify-center gap-3 transform ${
                  privilegeChangeRowId === item.userId
                    ? "-translate-x-[26px]"
                    : "translate-x-40 opacity-0"
                } transition-all duration-500 ease-in-out`}
              >
                <button
                  onClick={() =>
                    handleUpdatePrivilege(item.email, !item.isAdmin)
                  }
                  className="w-16 text-sm text-white bg-blue-500 py-1 rounded-md hover:bg-blue-600"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancel}
                  className="w-16 text-sm bg-gray-200 py-1 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="relative h-full w-[21%] flex items-center justify-start pl-8 overflow-hidden">
              <button
                onClick={() => handleDeleteClick(item.userId)}
                className={`w-28 text-sm bg-gray-200 p-1 rounded-md hover:bg-gray-300 transform ${
                  deleteRowId === item.userId
                    ? "-translate-x-40"
                    : "-translate-x-4"
                } transition-all duration-500 ease-in-out`}
              >
                Delete User
              </button>
              <div
                className={`absolute flex items-center justify-center gap-3 transform ${
                  deleteRowId === item.userId
                    ? "-translate-x-4"
                    : "translate-x-60"
                } transition-all duration-500 ease-in-out`}
              >
                <button
                  onClick={() => handleDeleteUser(item.userId)}
                  className="w-16 text-sm bg-red-300 py-1 rounded-md hover:bg-red-400"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancel}
                  className="w-16 text-sm bg-gray-200 py-1 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="w-full bg-gray-300 pr-2 shadow-lg">
        <div className="w-full grid sm:grid-cols-9 text-xs text-gray-500 font-semibold tracking-wide uppercase bg-gray-50 px-4 py-3 border rounded-b-lg shadow-lg">
          <span className="flex items-center col-span-3">
            Showing {startIndex + 1}-{endIndex} of {filteredData.length}
          </span>
          <span className="col-span-2"></span>
          {/* Pagination */}
          <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
            <nav aria-label="Table navigation">
              <ul className="inline-flex items-center">
                <li>
                  <button
                    className={`px-3 py-1 rounded-md rounded-l-lg focus:outline-none ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 focus:shadow-outline-purple"
                    }`}
                    aria-label="Previous"
                    onClick={() => handlePageChange("previous")}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft size={16} />
                  </button>
                </li>
                {pageNumbers.map((number, index) => (
                  <li key={index}>
                    {number === "..." ? (
                      <span className="px-3 py-1">...</span>
                    ) : (
                      <button
                        className={`px-3 py-1 rounded-md ${
                          currentPage === number
                            ? "text-white bg-gray-600"
                            : "text-gray-600"
                        } focus:outline-none focus:shadow-outline-purple`}
                        onClick={() =>
                          typeof number === "number" && setCurrentPage(number)
                        }
                      >
                        {number}
                      </button>
                    )}
                  </li>
                ))}
                <li>
                  <button
                    className={`px-3 py-1 rounded-md rounded-r-lg focus:outline-none ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 focus:shadow-outline-purple"
                    }`}
                    aria-label="Next"
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight size={16} />
                  </button>
                </li>
              </ul>
            </nav>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
