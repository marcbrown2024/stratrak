// react/nextjs components
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

// mui components
import Tooltip from "@mui/material/Tooltip";

// firebase components
import {
  createUser,
  enrollUser,
  getUserFromDb,
  secondaryAuth,
  userEmailExists,
  deleteUser,
  updatePrivilege,
} from "@/firebase";
import { useAlertStore } from "@/store/AlertStore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "./AuthProvider";
import useFirebaseAuth from "@/hooks/UseFirebaseAuth";
import { FirebaseError } from "firebase/app";

// custom components
import Loader from "./Loader";

// enums
import { AlertType } from "@/enums";

// icons
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { RiExchangeFill } from "react-icons/ri";
import { IoCheckmarkDoneSharp, IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

type FormData = User & {
  password: string;
};

const initialFormData: FormData = {
  email: "",
  fName: "",
  lName: "",
  id: "",
  isAdmin: false,
  orgId: "",
  signature: "",
  lastActivity: "",
  userId: "",
  password: "",
};

type CustomTableProps = {
  users: User[];
  refreshUsers: () => void
};

// Total items per page
const ITEMS_PER_PAGE = 4;

const CustomTable: React.FC<CustomTableProps> = ({ users, refreshUsers }) => {
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

  const [deleteUserRow, setDeleteUserRow] = useState<boolean>(false);
  const [changePrivilege, setChangePrivilege] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleFilterChange = (newFilter: "Users" | "Admins" | "All Users") => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  // const handleDeleteClick = (id: string) => {
  //   setSelectedRowId(id);
  //   setDeleteUserRow(true);
  // };

  const handlePrivilegeChangeClick = (id: string) => {
    setSelectedRowId(id);
    setChangePrivilege(true);
  };

  const handleDeleteUser = (email: string) => {
    closeAlert()
    deleteUser(email).then((response) => {
      let alert: AlertBody;
      let alertType: AlertType;

      if (response.success) {
        alert = {
          title: "Success!",
          content: "User was deleted successfully.",
        };
        alertType = AlertType.Success;
        refreshUsers()
      } else {
        alert = {
          title: "Error!",
          content: "Could not delete user. Please try again.",
        };
        alertType = AlertType.Error;
      }
      setAlert(alert, alertType);
    });
    setSelectedRowId(null);
  };

  const handleUpdatePrivilege = (email: string, isAdmin: boolean) => {
    closeAlert()
    updatePrivilege(email, isAdmin).then((response) => {
      let alert: AlertBody;
      let alertType: AlertType;

      if (response.success) {
        alert = {
          title: "Success!",
          content: "User privilege updated successfully.",
        };
        alertType = AlertType.Success;
        refreshUsers()
      } else {
        alert = {
          title: "Error!",
          content: "Could not update user privilege. Please try again.",
        };
        alertType = AlertType.Error;
      }
      setAlert(alert, alertType);
    });

    setSelectedRowId(null);
  };

  const registerUser = async () => {
    // Await the result of the asynchronous email check
    const inUse = await emailInUse(formData.email);

    if (inUse === true || inUse === null) {
      throw new FirebaseError(
        "auth/email-already-in-use", // Custom error code
        "The email address is already in use by another account." // Custom error message
      );
    } 

    // Proceed with the registration process if the email is not in use
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
    setCreateUserButton(false);
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
      refreshUsers()
      
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
  }, [userCreationError, setAlert]);

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

  const emailInUse = async (email: string): Promise<boolean | null> => {
    try {
      const response = await userEmailExists(email);
      console.log("response: ", response);

      if (response.success) {
        return response.data;
      }

      return null; // Return null if the response was unsuccessful
    } catch (error) {
      console.error("Error checking email:", error);
      return null; // Return null if there's an error
    }
  };

  // Filter users based on the selected filter
  const filteredData = users.filter((item) => {
    if (filter === "Admins") return item.isAdmin;
    if (filter === "Users") return !item.isAdmin;
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
            className={`absolute bottom-2 md:right-20 2xl:right-28 ${
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
                  First Name
                </th>
                <th scope="col" className="p-4">
                  Last Name
                </th>
                <th scope="col" className="p-4">
                  Admin
                </th>
                <th scope="col" className="p-4">
                  Email
                </th>
                <th scope="col" className="p-4">
                  Last Activity
                </th>
                <th scope="col" className="px-2 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className={`odd:bg-white even:bg-sky-100`}>
                  <td className="px-4 py-3 font-medium">{item.fName}</td>
                  <td className="px-4 py-3 font-medium">{item.lName}</td>
                  <td className="px-4 py-3">{item.isAdmin ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">
                    {item.lastActivity ? item.lastActivity : "N/A"}
                  </td>
                  <td className="flex items-center justify-center px-4 py-3">
                    <div
                      className={`flex gap-3 ${
                        deleteUserRow && selectedRowId === item.id
                          ? "-translate-x-9"
                          : "-translate-x-6"
                      } transition duration-300 ease-in-out`}
                    >
                      <Tooltip title="Delete User" arrow>
                        <button onClick={() => handleDeleteUser(item.email)}>
                          <TiUserDelete
                            size={24}
                            className="text-[#1286ff] transition-transform duration-300 hover:scale-110"
                          />
                        </button>
                      </Tooltip>
                      <Tooltip
                        title={
                          item.isAdmin ? "Demote to user" : "Elevate to admin"
                        }
                        arrow
                      >
                        <button
                          onClick={() =>
                            handleUpdatePrivilege(item.email, !item.isAdmin)
                          }
                        >
                          <RiExchangeFill
                            size={24}
                            className="text-[#1286ff] transition-transform duration-300 hover:scale-110"
                          />
                        </button>
                      </Tooltip>
                    </div>
                    {/* <div
                      className={`gap-3 ${
                        deleteUserRow && selectedRowId === item.id
                          ? "flex"
                          : "hidden"
                      }`}
                    >
                      <Tooltip title="Delete">
                        <button
                          type="button"
                          className="transition-transform duration-300 hover:scale-110"
                        >
                          <MdDelete className="text-xl text-[#7d1f2e]" />
                        </button>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="transition-transform duration-300 hover:scale-110"
                        >
                          <IoClose className="text-xl" />
                        </button>
                      </Tooltip>
                    </div> */}
                    {/* ----------------------------------------------------------- */}
                    {/* <div
                      className={`gap-3 ${
                        changePrivilege && selectedRowId === item.id
                          ? "flex"
                          : "hidden"
                      }`}
                    >
                      <Tooltip title="Inactive">
                        <button
                          type="button"
                          className="transition-transform duration-300 hover:scale-110"
                        >
                          <IoCheckmarkDoneSharp className="text-xl text-green-600" />
                        </button>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <button
                          onClick={handleCancel}
                          type="button"
                          className="transition-transform duration-300 hover:scale-110"
                        >
                          <IoClose className="text-2xl text-red-600" />
                        </button>
                      </Tooltip>
                    </div> */}
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
