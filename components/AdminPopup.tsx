// react/nextjs components
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

// firebase components
import { createUserWithEmailAndPassword } from "firebase/auth";
import useFirebaseAuth from "@/hooks/UseFirebaseAuth";
import { FirebaseError } from "firebase/app";

// custom firebase components
import { createUser, secondaryAuth, userEmailExists } from "@/firebase";

// global store
import { useAlertStore } from "@/store/AlertStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// libraries
import { validateInput, validationRules } from "@/lib/defaults";

// enums
import { AlertType } from "@/enums";

type PopupProps = {
  addUser: boolean;
  ammendlog: boolean;
  setAmendLog: React.Dispatch<React.SetStateAction<boolean>>;
  setAddUser: React.Dispatch<React.SetStateAction<boolean>>;
  refreshUsers: () => void;
};

type FormData = User & {
  password: string;
};

const initialFormData: FormData = {
  email: "",
  fName: "",
  lName: "",
  profilePhoto: "",
  id: "",
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
  ammendlog,
  setAmendLog,
  setAddUser,
  refreshUsers,
}) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [ammendLogData, setAmmendLogData] = useState({
    investigatorName: "",
    protocol: "",
    siteVisit: "",
    monitorName: "",
    signature: "",
    visitType: "",
    visitPurpose: "",
    visitDate: "",
    reason: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);
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
        setAddUser(false);
        refreshUsers();
      }
    }
  };

  const handleAmmendLogSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Visit Form Submitted:", ammendLogData);
    // Reset and close the form
    setAmmendLogData({
      investigatorName: "",
      protocol: "",
      siteVisit: "",
      monitorName: "",
      signature: "",
      visitType: "",
      visitPurpose: "",
      visitDate: "",
      reason: "",
    });
    setAmendLog(false);
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

  const handleAmmendLogChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setAmmendLogData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  // Apply overflow-hidden when overlay is visible
  useEffect(() => {
    if (addUser || ammendlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addUser, ammendlog]);

  return (
    <>
      {(addUser || ammendlog) && (
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
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="investigatorName"
                    >
                      Investigator Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="investigatorName"
                      type="text"
                      name="investigatorName"
                      value={ammendLogData.investigatorName}
                      onChange={handleAmmendLogChange}
                      placeholder="Enter investigator name"
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="protocol"
                    >
                      Protocol
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="protocol"
                      type="text"
                      name="protocol"
                      value={ammendLogData.protocol}
                      onChange={handleAmmendLogChange}
                      placeholder="Enter protocol"
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="siteVisit"
                    >
                      Site Visit
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="siteVisit"
                      type="text"
                      name="siteVisit"
                      value={ammendLogData.siteVisit}
                      onChange={handleAmmendLogChange}
                      placeholder="Enter site visited"
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="monitorName"
                    >
                      Monitor Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="monitorName"
                      type="text"
                      name="monitorName"
                      value={ammendLogData.monitorName}
                      onChange={handleAmmendLogChange}
                      placeholder="Enter monitor name"
                      autoComplete="off"
                      required
                    />
                  </div>

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
                      value={ammendLogData.signature}
                      onChange={handleAmmendLogChange}
                      placeholder="Select signature"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="visitType"
                    >
                      Type Of Visit
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="visitType"
                      type="text"
                      name="visitType"
                      value={ammendLogData.visitType}
                      onChange={handleAmmendLogChange}
                      placeholder="Enter type of visit"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="visitPurpose"
                    >
                      Purpose Of Visit
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="visitPurpose"
                      type="text"
                      name="visitPurpose"
                      value={ammendLogData.visitPurpose}
                      onChange={handleAmmendLogChange}
                      placeholder="Enter purpose of visit"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="visitDate"
                    >
                      Date Of Visit
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="visitDate"
                      type="text"
                      name="visitDate"
                      value={ammendLogData.visitDate}
                      onChange={handleAmmendLogChange}
                      placeholder="Enter date of visit"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="reason"
                    >
                      Reason for the amendment
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="reason"
                      name="reason"
                      rows={4}
                      value={ammendLogData.reason}
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
                    addUser ? setAddUser(false) : setAmendLog(false)
                  }
                  type="button"
                  className="text-white bg-red-700 py-2 px-4 rounded hover:bg-red-800 focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white bg-blue-600 py-2 px-4 rounded hover:bg-blue-800 focus:outline-none focus:shadow-outline"
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
