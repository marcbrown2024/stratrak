// react/nextjs components
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";

// mui components
import Tooltip from "@mui/material/Tooltip";

// firebase components
import {
  createUser,
  secondaryAuth,
  userEmailExists,
  updatePrivilege,
} from "@/firebase";

import { useAlertStore } from "@/store/AlertStore";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
import { validateInput, validationRules } from "@/lib/defaults";
import useUser from "@/hooks/UseUser";

type FormData = User & {
  password: string;
};

const initialFormData: FormData = {
  email: "",
  fName: "",
  lName: "",
  profilePhoto: "",
  id: "",
  isAdmin: false,
  orgId: "",
  signature: "",
  lastActivity: "",
  userId: "",
  password: "",
  phoneNumber: "",
  country: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
};

type CustomTableProps = {
  users: User[];
  refreshUsers: () => void;
};

const CustomTable: React.FC<CustomTableProps> = ({ users, refreshUsers }) => {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [addUser, setAddUser] = useState<boolean>(false);
  const [createUserButton, setCreateUserButton] = useState<boolean>(false);
  const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
  const [privilegeChangeRowId, setPrivilegeChangeRowId] = useState<
    string | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);
  const [filter, setFilter] = useState<"Users" | "Admins" | "All Users">(
    "All Users"
  );
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  const handleFilterChange = (newFilter: "Users" | "Admins" | "All Users") => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  // Handle delete button click
  const handleDeleteClick = (userId: string) => {
    console.log("userId", userId);
    console.log("user?.id", user?.id);

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
    } catch (error) {
      setAlert(
        {
          title: "Error!",
          content: "Could not delete user. Please try again.",
        },
        AlertType.Error
      );
    }

    handleCancel();
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

  const validateData = () => {
    const {
      isValid: emailIsValid,
      sanitizedValue: emailSanitized,
      errorMessage: emailError,
    } = validateInput("email", formData.email);
    const {
      isValid: passwordIsValid,
      sanitizedValue: passwordSanitized,
      errorMessage: passwordError,
    } = validateInput("password", formData.password);
    const {
      isValid: fNameIsValid,
      sanitizedValue: fNameSanitized,
      errorMessage: fNameError,
    } = validateInput("firstName", formData.fName);
    const {
      isValid: lNameIsValid,
      sanitizedValue: lNameSanitized,
      errorMessage: lNameError,
    } = validateInput("lastName", formData.lName);

    if (emailError) {
      throw new Error(emailError);
    } else if (passwordError) {
      throw new Error(passwordError);
    } else if (fNameError) {
      throw new Error(fNameError);
    } else if (lNameError) {
      throw new Error(lNameError);
    }

    const data = {
      ...formData,
      email: emailSanitized,
      password: passwordSanitized,
      fName: fNameSanitized,
      lName: lNameSanitized,
    };

    return {
      valid: emailIsValid && passwordIsValid && fNameIsValid && lNameIsValid,
      ...data,
    };
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
      orgId: user?.orgId ?? "",
    };

    await createUser(userDetails);
  };

  const { executeAuth: executeUserCreation, error: userCreationError } =
    useFirebaseAuth(registerUser);

  const handleAddUserSubmit = async (e: FormEvent) => {
    closeAlert();
    e.preventDefault();

    let dataValid;
    let response;
    try {
      response = validateData();
      dataValid = response.valid;
    } catch (e) {
      setAlert(
        { title: "Error", content: (e as Error).message },
        AlertType.Error
      );
      dataValid = false;
    }

    if (dataValid) {
      // Call the executeAuth function with the appropriate arguments
      const { success, result } = await executeUserCreation();

      if (success) {
        // On success, set success alert and clear form data
        setAlert(
          { title: "Success!", content: "User created successfully." },
          AlertType.Success
        );
        setTimeout(() => location.reload(), 2000);
      }
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

      if (response.success) {
        return response.data;
      }

      return null; // Return null if the response was unsuccessful
    } catch (error) {
      return null; // Return null if there's an error
    }
  };

  // Filter users based on the selected filter
  const filteredData = users.filter((item) => {
    if (filter === "Admins") return item.isAdmin;
    if (filter === "Users") return !item.isAdmin;
    return true;
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

  const isFormDataEmpty = (): boolean => {
    return Object.entries(formData).every(([key, value]) => {
      if (key === "isAdmin") {
        // Ignore the isAdmin field
        return true;
      }
      if (typeof value === "string") {
        return value === "";
      }
      return value === null;
    });
  };

  return (
    <div className="relative w-full flex flex-col items-start justify-start">
      <div className="h-24 w-11/12 flex items-end justify-between bg-slate-50 z-10">
        <div className="h-16 w-full flex items-center justify-start gap-8">
          <button
            onClick={() => handleFilterChange("Users")}
            className="h-12 w-fit flex items-center justify-center font-medium bg-gray-300 p-4 rounded-md hover:bg-gray-400"
          >
            Users
          </button>
          <button
            onClick={() => handleFilterChange("Admins")}
            className="h-12 w-fit flex items-center justify-center font-medium bg-gray-300 p-4 rounded-md hover:bg-gray-400"
          >
            Admins
          </button>
          <button
            onClick={() => handleFilterChange("All Users")}
            className="h-12 w-fit flex items-center justify-center font-medium bg-gray-300 p-4 rounded-md hover:bg-gray-400"
          >
            All Users
          </button>
          <button
            onClick={() => setAddUser(!addUser)}
            className="h-12 w-fit flex items-center justify-center font-medium bg-gray-300 p-4 rounded-md hover:bg-gray-400"
          >
            {addUser ? "Cancel" : "Add User"}
          </button>
        </div>
      </div>
      <div
        className={`absolute h-fit w-full flex flex-col items-start justify-center gap-8 pb-6 transition-all duration-500 ease-in-out transform ${
          addUser ? "translate-y-32" : "-translate-y-52"
        } -z-10`}
      >
        <div
          className={`relative h-fit w-11/12 flex flex-col items-start justify-center gap-8 bg-gray-200 p-6 border rounded-xl transition-all duration-500 ease-in-out transform ${
            addUser ? "opacity-100" : "opacity-0"
          }`}
        >
          <form onSubmit={handleAddUserSubmit} className="h-full w-full flex">
            <div className="h-full w-full flex flex-col items-start justify-center gap-1">
              <div className="w-full flex items-center justify-center py-2">
                <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                  <label className="] font-medium">First Name:</label>
                  <input
                    type="text"
                    name="fName"
                    value={formData.fName}
                    onChange={handleChange}
                    className="w-4/5 text-gray-900 sm:text-sm sm:leading-6 pl-3 py-1.5 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
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
                    className="w-4/5 text-gray-900 sm:text-sm sm:leading-6 pl-3 py-1.5 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
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
                    autoComplete="false"
                    className="w-4/5 text-gray-900 sm:text-sm sm:leading-6 pl-3 py-1.5 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
                    required
                  />
                </div>
                <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                  <label className="font-medium">Password:</label>
                  <div className="relative w-4/5">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="false"
                      className="w-full text-gray-900 sm:text-sm sm:leading-6 pl-3 py-1.5 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full flex items-end justify-start py-2">
                <div className="w-1/2 flex flex-col items-start justify-start gap-3">
                  <label className="font-medium">Admin</label>
                  <select
                    name="isAdmin"
                    value={formData.isAdmin ? "admin" : "user"}
                    onChange={handleChange}
                    className="h-10 w-[80%] text-sm text-gray-900 bg-white px-2 py-2 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="relative h-12 w-2/5 flex items-center justify-end overflow-hidden">
                  <div
                    className={`absolute w-full flex justify-end ${
                      createUserButton ? "translate-x-32" : "-translate-x-1"
                    } transition-all duration-500 ease-in-out`}
                  >
                    <button
                      type="button"
                      // disabled={isFormDataEmpty()}
                      onClick={() => setCreateUserButton(true)}
                      className="h-10 w-fit flex items-center justify-center font-medium px-5 py-3 bg-gray-300 rounded-md hover:scale-105 hover:bg-gray-300"
                    >
                      Add User
                    </button>
                  </div>
                  <div className="h-full flex items-center justify-end gap-6">
                    <div
                      className={`flex justify-end gap-6 ${
                        createUserButton ? "-translate-x-1" : "translate-x-60"
                      } transition-all duration-500 ease-in-out`}
                    >
                      <button
                        type="submit"
                        className="h-10 w-fit flex items-center justify-center text-white font-medium bg-[#1286ff] px-5 py-3 rounded-md hover:scale-105"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreateUserButton(false)}
                        className="h-10 w-fit flex items-center justify-center text-white font-medium bg-[#cf3a27] px-5 py-3 rounded-md hover:scale-105"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="w-full 2xl:w-11/12 overflow-x-auto 2xl:overflow-hidden shadow-lg rounded-lg">
          <div className="min-w-[1200px]">
            {/* Adjust min-w value based on your column widths */}
            <div className="h-14 text-sm flex text-left font-semibold tracking-wide uppercase bg-gray-200">
              <div className="h-full w-3/12 flex items-center justify-start px-4">
                Member
              </div>
              <div className="h-full w-1/12 flex items-center justify-start px-4">
                Admin
              </div>
              <div className="h-full w-3/12 flex items-center justify-start px-4">
                Email
              </div>
              <div className="h-full w-60 flex items-center justify-start px-4">
                Last Activity
              </div>
              <div className="h-full w-52 flex items-center justify-start px-2">
                Action
              </div>
              <div className="h-full w-52 flex items-center justify-start">
                Change Role
              </div>
            </div>
            <div className="text-sm">
              {currentItems.map((item) => (
                <div
                  key={item.userId}
                  className="flex items-center justify-start hover:bg-gray-100 text-gray-700 border-b"
                >
                  <div className="h-16 w-3/12 flex items-center justify-start gap-2 px-4">
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
                    <span>
                      {item.fName} {item.lName}
                    </span>
                  </div>
                  <div className="w-1/12 flex items-center justify-start px-4">
                    {item.isAdmin ? "Yes" : "No"}
                  </div>
                  <div className="w-3/12 flex items-center justify-start px-4">
                    {item.email}
                  </div>
                  <div className="w-60 flex items-center justify-start px-4">
                    {item.lastActivity ? item.lastActivity : "N/A"}
                  </div>
                  <div className="w-52 font-medium">
                    <div className="relative flex items-center justify-center overflow-hidden">
                      <button
                        onClick={() => handleDeleteClick(item.userId)}
                        className={`w-32 text-sm bg-gray-200 p-1 rounded-md hover:bg-gray-300 transform ${
                          deleteRowId === item.userId
                            ? "-translate-x-40"
                            : "-translate-x-5"
                        } transition-all duration-500 ease-in-out`}
                      >
                        Delete User
                      </button>
                      <div
                        className={`absolute flex items-center justify-center gap-3 transform ${
                          deleteRowId === item.userId
                            ? "-translate-x-4"
                            : "translate-x-44"
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
                  <div className="w-52 font-medium">
                    <div className="relative flex items-center justify-center overflow-hidden">
                      <button
                        onClick={() => handlePrivilegeChangeClick(item.userId)}
                        className={`w-32 text-sm bg-gray-200 p-1 rounded-md hover:bg-gray-300 transform ${
                          privilegeChangeRowId === item.userId
                            ? "-translate-x-40"
                            : "-translate-x-[26px]"
                        } transition-all duration-500 ease-in-out`}
                      >
                        {item.isAdmin ? "Demote to user" : "Elevate to admin"}
                      </button>
                      <div
                        className={`absolute flex items-center justify-center gap-3 transform ${
                          privilegeChangeRowId === item.userId
                            ? "-translate-x-5"
                            : "translate-x-40"
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
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t bg-gray-50 sm:grid-cols-9">
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
    </div>
  );
};

export default CustomTable;
