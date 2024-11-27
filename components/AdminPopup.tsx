// react/nextjs components
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

// firebase components
import { createUserWithEmailAndPassword } from "firebase/auth";
import useFirebaseAuth from "@/hooks/UseFirebaseAuth";
import { FirebaseError } from "firebase/app";

// custom firebase components
import {
  createLog,
  createUser,
  getAllUsers,
  secondaryAuth,
  userEmailExists,
} from "@/firebase";

// global store
import { useAlertStore } from "@/store/AlertStore";
import AdminPopupStore from "@/store/AdminPopupStore";
import LoadingStore from "@/store/LoadingStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// libraries
import { validateInput, validationRules } from "@/lib/defaults";
import { format } from "date-fns";

// enums
import { AlertType } from "@/enums";

// constants
import { blankImage } from "@/constants";

type PopupProps = {
  addUser?: boolean;
  setAddUser?: React.Dispatch<React.SetStateAction<boolean>>;
  refreshUsers?: () => void;
};

type FormData = User & {
  password: string;
};

const initialFormData: FormData = {
  email: "",
  fName: "",
  lName: "",
  profilePhoto: "",
  isAdmin: undefined,
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

const AdminPopup: React.FC<PopupProps> = ({
  addUser,
  setAddUser,
  refreshUsers,
}) => {
  const { user } = useUser();
  const { trialId } = useParams();
  const { isOpen, setIsOpen } = AdminPopupStore();
  const { setLoading } = LoadingStore();
  const [orgUsers, setOrgUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [ammendlogDetails, setAmmendLogDetails] = useState<LogDetails>({
    adminName: "",
    adminSig: "",
    ammended: false,
    ammendedDate: format(new Date(), "MMMM d, yyyy h:mm:ss a 'UTC'XXX"),
    ammendedReason: "",
    monitorName: "",
    signature: "Must be done by monitor",
    typeOfVisit: "Remote",
    purposeOfVisit: "SIV",
    dateOfVisit: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  const handleUserDataChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "isAdmin") {
      // Convert value to boolean (admin = true, user = false)
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

  const handleAmmendLogChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAmmendLogDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
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
        setFormData(initialFormData);
        if (setAddUser) {
          setAddUser(false);
        }
        if (refreshUsers) {
          refreshUsers();
        }
      }
    }
  };

  const handleAmmendLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeAlert();

    if (user) {
      if (user.signature === "" || user.signature === blankImage) {
        setAlert(
          {
            title: "Info",
            content: "Need to have a valid signature to submit.",
          },
          AlertType.Info
        );
        return;
      }
      const formattedDate = format(
        new Date(ammendlogDetails.dateOfVisit),
        "MMMM d, yyyy h:mm:ss a 'UTC'XXX"
      );

      const ammendlogDetailsWithFormattedDate = {
        ...ammendlogDetails,
        adminName: `${user?.fName} ${user?.lName}`,
        adminSig: user?.signature,
        ammended: true,
        dateOfVisit: formattedDate,
      };

      createLog(ammendlogDetailsWithFormattedDate, trialId as string).then(
        (response) => {
          const alert = response.success
            ? {
                title: "Success!",
                content: `Log saved successfully.`,
              }
            : {
                title: "Error",
                content: "Could not save log, please try again.",
              };
          setAlert(
            alert,
            response.success ? AlertType.Success : AlertType.Error
          );
        }
      );

      setIsOpen(false);
      setAmmendLogDetails({
        adminName: "",
        adminSig: "",
        ammended: false,
        ammendedDate: format(new Date(), "MMMM d, yyyy h:mm:ss a 'UTC'XXX"),
        ammendedReason: "",
        monitorName: "",
        signature: "",
        typeOfVisit: "Remote",
        purposeOfVisit: "SIV",
        dateOfVisit: "",
      });
      setTimeout(() => window.location.reload(), 2000);
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

  // Apply overflow-hidden when overlay is visible
  useEffect(() => {
    if (addUser || isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addUser, isOpen]);

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    const fetchUsers = async () => {
      setLoading(true);
      getAllUsers(user?.orgId ?? "").then((response) => {
        if (response.success) {
          setOrgUsers(response.data);
          setLoading(false);
        }
      });
    };

    fetchUsers();
  }, [user]);

  return (
    <>
      {(addUser || isOpen) && (
        <div className="fixed top-0 right-0 h-full w-[calc(100%-12rem)] xl:w-[calc(100%-18rem)] flex items-center justify-center bg-slate-100/70 shadow-lg z-50">
          <div className="custom-scrollbar relative h-[30rem] w-96 pb-4 bg-white shadow-xl rounded-lg overflow-y-auto">
            <div className="fixed h-16 w-96 flex items-center justify-center text-2xl bg-blue-700 text-white text-center font-bold uppercase rounded-t-lg">
              {addUser ? "Add to Org" : "Amend a Study Log"}
            </div>
            <form
              className="py-4 px-6 mt-16"
              onSubmit={addUser ? handleAddUserSubmit : handleAmmendLogSubmit}
            >
              {addUser ? (
                <>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="name"
                    >
                      First Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="fName"
                      type="text"
                      name="fName"
                      value={formData.fName}
                      onChange={handleUserDataChange}
                      placeholder="Enter first name"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="name"
                    >
                      Last Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="lName"
                      type="text"
                      name="lName"
                      value={formData.lName}
                      onChange={handleUserDataChange}
                      placeholder="Enter last name"
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleUserDataChange}
                      placeholder="Enter email address"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative flex">
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleUserDataChange}
                        autoComplete="off"
                        placeholder="Enter temporary password"
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

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="admin"
                    >
                      Admin
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="isAdmin"
                      name="isAdmin"
                      value={
                        formData.isAdmin === true
                          ? "admin"
                          : formData.isAdmin === false
                          ? "user"
                          : ""
                      }
                      onChange={(e) => handleUserDataChange(e)}
                      required
                    >
                      <option value="" disabled>
                        Choose user privilege
                      </option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* Monitor Name */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="monitorName"
                    >
                      Monitor Name
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="monitorName"
                      name="monitorName"
                      value={ammendlogDetails.monitorName}
                      onChange={handleAmmendLogChange}
                      required
                    >
                      <option value="" disabled>
                        Select a monitor
                      </option>
                      {orgUsers.map((monitor) => (
                        <option
                          key={monitor.userId}
                          value={`${monitor.fName} ${monitor.lName}`}
                        >
                          {monitor.fName} {monitor.lName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Signature */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="signature"
                    >
                      Signature
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="signature"
                      type="text"
                      name="signature"
                      placeholder="Must be done by monitor"
                      autoComplete="off"
                      disabled
                    />
                  </div>

                  {/* Type of Visit */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="typeOfVisit"
                    >
                      Type of Visit
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="typeOfVisit"
                      name="typeOfVisit"
                      value={ammendlogDetails.typeOfVisit}
                      onChange={handleAmmendLogChange}
                      required
                    >
                      <option value="Remote">Remote</option>
                      <option value="Onsite">Onsite</option>
                      <option value="Waiver Call">Waiver Call</option>
                    </select>
                  </div>

                  {/* Purpose of Visit */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="purposeOfVisit"
                    >
                      Purpose of Visit
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="purposeOfVisit"
                      name="purposeOfVisit"
                      value={ammendlogDetails.purposeOfVisit}
                      onChange={handleAmmendLogChange}
                      required
                    >
                      <option value="SIV">SIV</option>
                      <option value="IMV">IMV</option>
                      <option value="COV">COV</option>
                      <option value="Audit">Audit</option>
                    </select>
                  </div>

                  {/* Date of Visit */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="dateOfVisit"
                    >
                      Date of Visit
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="dateOfVisit"
                      type="datetime-local"
                      name="dateOfVisit"
                      value={ammendlogDetails.dateOfVisit}
                      onChange={handleAmmendLogChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="ammendedReason"
                    >
                      Reason for the amendment
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="ammendedReason"
                      name="ammendedReason"
                      rows={4}
                      value={ammendlogDetails.ammendedReason}
                      onChange={handleAmmendLogChange}
                      placeholder="Enter reason for the amendment"
                      required
                    />
                  </div>
                </>
              )}
              <div className="w-full flex justify-center gap-8 mt-8">
                <button
                  onClick={() =>
                    addUser ? setAddUser && setAddUser(false) : setIsOpen(false)
                  }
                  type="button"
                  className="h-12 w-32 text-white font-semibold bg-red-700 rounded-lg hover:bg-red-800 focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-12 w-32 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-800 focus:outline-none focus:shadow-outline"
                >
                  {addUser ? "Add User" : "Amend Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPopup;
