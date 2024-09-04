// react/nextjs components
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

// mui components
import Tooltip from "@mui/material/Tooltip";

// icons
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { RiExchangeFill } from "react-icons/ri";
import {
  createUser,
  enrollUser,
  getUserFromDb,
  secondaryAuth,
} from "@/firebase";
import { useAlertStore } from "@/store/AlertStore";
import { AlertType } from "@/enums";
import Loader from "./Loader";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "./AuthProvider";
import useFirebaseAuth from "@/hooks/UseFirebaseAuth";

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

type FormData = User & {
  password: string;
};

const initialFormData: FormData = {
  email: "",
  fName: "",
  lName: "",
  isAdmin: false,
  orgId: "",
  signature: "",
  online: false,
  userId: "",
  password: "",
};

// Total items per page
const ITEMS_PER_PAGE = 4;

const CustomTable = () => {
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<"Users" | "Admins" | "All Users">(
    "All Users"
  );
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  const [addUser, setAddUser] = useState<boolean>(false);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

  const [createUserButton, setCreateUserButton] = useState<boolean>(false);

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
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "previous" && startIndex > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleFilterChange = (newFilter: "Users" | "Admins" | "All Users") => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const registerUser = async () => {
    const firebaseUser = await createUserWithEmailAndPassword(
      secondaryAuth,
      formData.email,
      formData.password
    );

    // Extract only the fields that are in User type
    const { password, ...userData } = formData; // Omit password when sending data

    const userDetails = {
      ...userData,
      userId: firebaseUser.user.uid,
      orgId: user?.orgId,
    };
    await createUser(userDetails);
  };

  const {
    executeAuth: executeUserCreation,
    loading: userCreationLoading,
    error: userCreationError,
  } = useFirebaseAuth(registerUser);

  const handleAddUserSubmit = async (e: FormEvent) => {
    closeAlert();
    e.preventDefault();

    // Call the executeAuth function with the appropriate arguments
    const { success, result } = await executeUserCreation();

    if (success) {
      // On success, set success alert and clear form data
      setAlert(
        { title: "Success!", content: "User created successfully." },
        AlertType.Success
      );
      setFormData(initialFormData);
    }
  };

  useEffect(() => {
    if (userCreationError) {
      setAlert(
        {
          title: "Something went wrong",
          content: userCreationError ?? "An unexpected error occurred.",
        },
        AlertType.Error
      );
    }
  }, [userCreationError]);

  useEffect(() => {
    if (userCreationError) {
      setAlert(
        {
          title: "Something went wrong",
          content: userCreationError ?? "An unexpected error occurred.",
        },
        AlertType.Error
      );
    }
  }, [userCreationError]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "isAdmin") {
      // Convert value to boolean
      const isAdmin = value === "admin";
      setFormData((prevData) => ({
        ...prevData,
        [name]: isAdmin,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <div className="relative w-full flex flex-col items-start justify-start">
      <div className="h-24 w-11/12 flex items-end justify-between bg-slate-50 z-10">
        <div className="h-16 w-full flex items-center justify-start gap-8">
          <button
            onClick={() => handleFilterChange("Users")}
            className="h-10 w-fit flex items-center justify-center font-medium bg-gray-200 px-4 py-3 rounded-md hover:bg-gray-300"
          >
            Users
          </button>
          <button
            onClick={() => handleFilterChange("Admins")}
            className="h-10 w-fit flex items-center justify-center font-medium bg-gray-200 px-4 py-3 rounded-md hover:bg-gray-300"
          >
            Admins
          </button>
          <button
            onClick={() => handleFilterChange("All Users")}
            className="h-10 w-fit flex items-center justify-center font-medium bg-gray-200 px-4 py-3 rounded-md hover:bg-gray-300"
          >
            All Users
          </button>
          <button
            onClick={() => setAddUser(!addUser)}
            className="h-10 w-fit flex items-center justify-center font-medium bg-gray-200 px-4 py-3 rounded-md hover:bg-gray-300"
          >
            {addUser ? "Cancel" : "Add User"}
          </button>
        </div>
        <button className="h-10 w-fit flex items-center justify-center text-white font-medium bg-[#1286ff] px-4 py-3 rounded-md hover:scale-105 hover:bg-[#1285dd] mr-5">
          Refresh
        </button>
      </div>
      <div
        className={`absolute h-fit w-full flex flex-col items-start justify-center gap-8 pb-6 transition-all duration-500 ease-in-out transform ${
          addUser ? "translate-y-32" : "-translate-y-40"
        } z-0`}
      >
        <div
          className={`relative h-fit w-full flex flex-col items-start justify-center gap-8 rounded-xl transition-all duration-500 ease-in-out transform ${
            addUser ? "opacity-100" : "opacity-0"
          }`}
        >
          <form onSubmit={handleAddUserSubmit} className="h-full w-full flex">
            {userCreationLoading ? (
              <Loader />
            ) : (
              <div className="h-full w-full flex flex-col items-start justify-center gap-1">
                <div className="w-full flex items-center justify-center py-2">
                  <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                    <label className="] font-medium">First Name:</label>
                    <input
                      type="text"
                      name="fName"
                      value={formData.fName}
                      onChange={handleChange}
                      className="w-4/5 text-gray-900 sm:text-sm sm:leading-6 bg-slate-50 pl-3 py-1.5 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
                      required
                    />
                  </div>
                  <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                    <label className="] font-medium">Last Name:</label>
                    <input
                      type="text"
                      name="lName"
                      value={formData.lName}
                      onChange={handleChange}
                      className="w-4/5 text-gray-900 sm:text-sm sm:leading-6 bg-slate-50 pl-3 py-1.5 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
                      required
                    />
                  </div>
                </div>
                <div className="w-full flex items-center justify-center py-2">
                  <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                    <label className="] font-medium">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-4/5 text-gray-900 sm:text-sm sm:leading-6 bg-slate-50 pl-3 py-1.5 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
                      required
                    />
                  </div>
                  <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                    <label className="font-medium">Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-4/5 text-gray-900 sm:text-sm sm:leading-6 bg-slate-50 pl-3 py-1.5 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
                      required
                    />
                  </div>
                </div>
                <div className="w-full flex items-end justify-center py-2">
                  <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                    <label className="font-medium">Admin</label>
                    <select
                      name="isAdmin"
                      value={formData.isAdmin ? "admin" : "user"}
                      onChange={handleChange}
                      className="w-[80%] text-sm text-gray-900 bg-slate-50 px-2 py-2 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="w-1/2 flex items-center justify-start">
                    <div className="h-full w-[80%] flex items-center justify-end gap-6">
                      <div
                        className={`flex justify-end gap-6 ${
                          createUserButton
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-32"
                        } transition-all duration-500 ease-in-out`}
                      >
                        <button
                          type="button"
                          onClick={() => setCreateUserButton(false)}
                          className="h-10 w-fit flex items-center justify-center text-white font-medium bg-[#cf3a27] px-5 py-3 rounded-md hover:scale-105"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="h-10 w-fit flex items-center justify-center text-white font-medium bg-[#1286ff] px-5 py-3 rounded-md hover:scale-105"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Add other input fields similarly */}
              </div>
            )}
          </form>
          <div
            className={`absolute bottom-2 right-28 ${
              createUserButton
                ? "opacity-0 translate-x-32"
                : "opacity-100 translate-x-0"
            } transition-all duration-300 ease-in-out`}
          >
            <button
              type="button"
              onClick={() => setCreateUserButton(true)}
              className="h-10 w-fit flex items-center justify-center text-white font-medium bg-[#1286ff] px-5 py-3 rounded-md hover:scale-105"
            >
              Add User
            </button>
          </div>
        </div>
        <div className="w-11/12 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-blue-700">
            <thead className="text-sm text-left uppercase bg-sky-100">
              <tr>
                <th scope="col" className="p-4">
                  Users
                </th>
                <th scope="col" className="p-4">
                  Admin
                </th>
                <th scope="col" className="p-4">
                  Not Sure
                </th>
                <th scope="col" className="p-4">
                  Status
                </th>
                <th scope="col" className="p-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className={`odd:bg-white even:bg-sky-100`}>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">{item.admin ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">Not Sure</td>
                  <td className="flex items-center gap-2 px-4 py-3">
                    {item.status}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tooltip title="Delete User" arrow>
                        <span>
                          <TiUserDelete
                            size={24}
                            className="text-[#1286ff] hover:scale-105 cursor-pointer"
                          />
                        </span>
                      </Tooltip>
                      <Tooltip
                        title={
                          item.admin ? "Demote to user" : "Elevate to admin"
                        }
                        arrow
                      >
                        <span>
                          <RiExchangeFill
                            size={24}
                            className="text-[#1286ff] hover:scale-105 cursor-pointer"
                          />
                        </span>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-full flex items-center justify-end p-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-[#1286ff] tracking-wide">
                <span>
                  {startIndex + 1}-{Math.min(endIndex, filteredData.length)}
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
    </div>
  );
};

export default CustomTable;
